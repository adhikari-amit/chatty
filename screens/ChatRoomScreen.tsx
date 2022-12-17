import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Messages from '../components/Messages';
import MessageInput from '../components/MessageInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChatRoom, Message } from '../src/models';
import { Auth, DataStore, SortDirection } from 'aws-amplify';


const ChatRoomScreen = () => {
    const route = useRoute()
    const navigation = useNavigation()

    const [message, setMessage] = useState<Message[]>([])
    const [messageReplyTo,setMessageReplyTo]=useState<Message|null>(null)
    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)

    useEffect(() => {
        const fetchChatRoom = async () => {
            if (!route.params?.id) {
                console.warn("No ChatRoom Id Provided")
                return
            }
            const chatroom = await DataStore.query(ChatRoom, route.params.id)
            if (!chatroom) {
                console.log("Couldn't find ChatRoom")
            }
            else {
                setChatRoom(chatroom)
            }
    
        }
    
        fetchChatRoom()
    }, [])
  
    useEffect(() => {
        const fetchMessages = async () => {
            const authUser=await Auth.currentAuthenticatedUser()
            const myID=authUser.attributes.sub
            if (!chatRoom) {
                return
            }
            const fetchedmessage = await DataStore.query(Message, message => message.chatroomID("eq", chatRoom?.id).forUserID("eq",myID), { sort: message => message.createdAt(SortDirection.DESCENDING) })
        
            
            setMessage(fetchedmessage)
        }
        fetchMessages()
        
    }, [chatRoom])

    useEffect(() => {
     
        const subscription = DataStore.observe(Message).subscribe(msg => {
            if (!route.params?.id) {
                console.warn("No ChatRoom Id Provided")
                return
            }
            if (msg.model === Message && msg.opType === "INSERT" && msg.element.chatroomID===route.params.id) {

                setMessage(existingMessage => [msg.element, ...existingMessage])
            }
        })
        return () => subscription.unsubscribe()
    }, [])




    if (!chatRoom) {
        return <ActivityIndicator />
    }

    return (
        <SafeAreaView style={styles.page}>
            <FlatList
                data={message}
                renderItem={({ item }) => <Messages message={item} setAsMessageReply={()=>setMessageReplyTo(item)}/>}
                inverted
            />
            <MessageInput chatroom={chatRoom} messageReplyTo={messageReplyTo} removeMessageReplyTo={()=>setMessageReplyTo(null)}/>
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
