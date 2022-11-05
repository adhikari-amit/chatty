import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform
} from 'react-native'
import styles from './style'
import { SimpleLineIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import  {Auth,DataStore } from 'aws-amplify';
import { ChatRoom, Message } from '../../src/models';
 

const MessageInput = ({chatroom}:any) => {
    const [message, setMessage] = useState('')
    const sendMessage =async () => {
        const user=await Auth.currentAuthenticatedUser()

        if (message) {
           const newMessage= await DataStore.save(new Message({
                content:message,
                userID:user.attributes.sub,
                chatroomID:chatroom.id,
            }))
            UpdateLastMessage(newMessage)
            setMessage('')
           
        }

    }
    const UpdateLastMessage=async (newMessage:any)=>{
        DataStore.save(ChatRoom.copyOf(chatroom,updatedChatRoom=>{
            updatedChatRoom.LastMessage=newMessage
        }))  
    } 
    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS==='ios'?'padding':"height"}
         keyboardVerticalOffset={100}
        >
            <View style={styles.inputContainer}>
                <SimpleLineIcons name="emotsmile" size={24} color="#595959" style={styles.icon} />

                <TextInput
                    style={styles.input}
                    placeholder='Chatty Message'
                    value={message}
                    onChangeText={setMessage}
                />

                <Feather name="camera" size={24} color="#595959" style={styles.icon} />
                <Feather name="mic" size={24} color="#595959" style={styles.icon} />
            </View>
            <Pressable onPress={sendMessage} style={styles.buttonContainer}>
                {
                    message ? <Ionicons name="send" size={24} color="white" />
                        : <AntDesign name="plus" size={24} color="white" />
                }
            </Pressable>
        </KeyboardAvoidingView>
    )
}

export default MessageInput