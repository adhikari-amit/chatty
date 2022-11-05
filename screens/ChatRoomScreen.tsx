import { View, Text, StyleSheet, FlatList,SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Messages from '../components/Messages';
import MessageInput from '../components/MessageInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChatRoom, Message } from '../src/models';
import { DataStore, SortDirection } from 'aws-amplify';


const ChatRoomScreen = () => {
    const route=useRoute()
    const navigation=useNavigation()
    
    const [message, setMessage] = useState<Message[]>([])
    const [chatRoom,setChatRoom]=useState<ChatRoom|null>(null)

    useEffect(()=>{
       fetchChatRoom()
    },[])
    
    useEffect(()=>{
        fetchMessages()
    },[chatRoom])

    const fetchChatRoom=async()=>{   
        if(!route.params?.id){
            console.warn("No ChatRoom Id Provided")
            return
        }
        const chatroom=await DataStore.query(ChatRoom,route.params.id)
        if(!chatroom){
            console.error("Couldn't find ChatRoom")
        }
        else{
            setChatRoom(chatroom)
        }

    }
    
    const fetchMessages=async()=>{
        if(!chatRoom){
            console.error("No ChatRoom exist");
            return          
        }
        const fetchedmessage=await DataStore.query(Message,message=>message.chatroomID("eq",chatRoom?.id),{ sort:message=>message.createdAt(SortDirection.DESCENDING)})

        setMessage(fetchedmessage)
    }
     
    navigation.setOptions({title:'Elon Musk'})
    console.warn(route.params?.id)
    
    if(!chatRoom){
        return <ActivityIndicator/>
    }


    console.warn(message);
    
    return (
        <SafeAreaView style={styles.page}>
        <FlatList
           data={message}
           renderItem={({ item }) => <Messages message={item} />}
           inverted
        />
        <MessageInput chatroom={chatRoom}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        flex: 1
    }
})


export default ChatRoomScreen;