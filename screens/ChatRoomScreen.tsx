import { View, Text, StyleSheet, FlatList,SafeAreaView } from 'react-native'
import React from 'react'
import Message from '../components/Message';
import Chats from '../assets/dummy-data/Chats';
import MessageInput from '../components/MessageInput';


const ChatRoomScreen = () => {
    return (
        <SafeAreaView style={styles.page}>
        <FlatList
           data={Chats.messages}
           renderItem={({ item }) => <Message message={item} />}
           inverted
        />
        <MessageInput/>
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