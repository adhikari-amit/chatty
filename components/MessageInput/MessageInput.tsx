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




const MessageInput = () => {
    const [message, setMessage] = useState('')
    const onPress = () => {
        if (message) {
            console.warn("sending Message")
            setMessage('')
        }
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
            <Pressable onPress={onPress} style={styles.buttonContainer}>
                {
                    message ? <Ionicons name="send" size={24} color="white" />
                        : <AntDesign name="plus" size={24} color="white" />
                }
            </Pressable>
        </KeyboardAvoidingView>
    )
}

export default MessageInput