import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native'
import styles from './style'
import { SimpleLineIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons'
import { Auth, DataStore, Storage } from 'aws-amplify'
import { ChatRoom, Message } from '../../src/models'
import EmojiSelector, { Categories } from "react-native-emoji-selector"
import * as ImagePicker from 'expo-image-picker'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'



const MessageInput = ({ chatroom }: any) => {
    const [message, setMessage] = useState('')
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
    const [image, setImage] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)


    const resetFields = () => {
        setMessage('')
        setIsEmojiPickerOpen(false)
        setImage(null)
        setProgress(0)
    }
    
    useEffect(() => {
        (async () => {
          if (Platform.OS !== "web") {
            const libraryResponse =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
            if (
              libraryResponse.status !== "granted" ||
              photoResponse.status !== "granted"
            ) {
              alert("Sorry, we need camera roll permissions to make this work!");
            }
          }
        })();
      }, []);

    const sendContent = () => {
        if (image) {
            sendImage()
        }
        else if (message) {
            sendMessage()
        }
        else {
            onePlusCLicked()
        }
    }
    const onePlusCLicked = () => {
        console.log("clicked")
    }

    const sendMessage = async () => {
        const user = await Auth.currentAuthenticatedUser()

        if (message) {
            const newMessage = await DataStore.save(new Message({
                content: message,
                userID: user.attributes.sub,
                chatroomID: chatroom.id,
            }))
            UpdateLastMessage(newMessage)
            resetFields()
        }

    }
    const UpdateLastMessage = async (newMessage: any) => {
        DataStore.save(ChatRoom.copyOf(chatroom, updatedChatRoom => {
            updatedChatRoom.LastMessage = newMessage
        }))
    }


    const sendImage = async () => {
        if (!image) {
            return
        }
        const blob = await getImageBlob(image)
        const { key } = await Storage.put(`${uuidv4()}.png`, blob, {
            progressCallback(progress) {
                setProgress(progress.loaded / progress.total)
            }
        }
        )
        const user = await Auth.currentAuthenticatedUser()

        const newMessage = await DataStore.save(new Message({
            content: message,
            image: key,
            userID: user.attributes.sub,
            chatroomID: chatroom.id,
        }))
        UpdateLastMessage(newMessage)
        resetFields()

    }

    const getImageBlob = async (uri: string) => {
        if (!image) {
            return null
        }

        const response = await fetch(uri)
        const blob = await response.blob()
        return blob

    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }

    }
    return (
        
        <KeyboardAvoidingView style={[styles.root, { height: isEmojiPickerOpen ? "50%" : "auto" }]} behavior={Platform.OS === 'ios' ? 'padding' : "height"}
            keyboardVerticalOffset={50}
        >
            {image && (<View style={styles.sendImageContainer}>
                <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />

                <View style={{flex:1,justifyContent:"flex-start", alignSelf: "flex-end"}}>
                    <View style={{
                            height: 5,
                            borderRadius: 5,
                            backgroundColor: "#3777f0",
                            width: `${progress*100}%`,
                            // width:"50%"
                        }}>

                    </View>
                </View>
                <Pressable onPress={() => setImage(null)}>
                    <AntDesign name="close" size={24} color="black" style={{ margin: 5 }} />
                </Pressable>


            </View>)
            }

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Pressable onPress={() => setIsEmojiPickerOpen((currentValue) => !currentValue)}>
                        <SimpleLineIcons name="emotsmile" size={24} color="#595959" style={styles.icon} />
                    </Pressable>

                    <TextInput
                        style={styles.input}
                        placeholder='Chatty Message'
                        value={message}
                        onChangeText={setMessage}
                    />
                    <Pressable onPress={pickImage}>
                        <Feather name="image" size={24} color="#595959" style={styles.icon} />
                    </Pressable>
                    
                    <Pressable onPress={takePhoto}>
                        <Feather name="camera" size={24} color="#595959" style={styles.icon} />
                    </Pressable>

                    <Feather name="mic" size={24} color="#595959" style={styles.icon} />
                </View>
                <Pressable onPress={sendContent} style={styles.buttonContainer}>
                    {
                        message || image ? <Ionicons name="send" size={24} color="white" />
                            : <AntDesign name="plus" size={24} color="white" />
                    }
                </Pressable>
            </View>
            {
                isEmojiPickerOpen && <EmojiSelector
                    category={Categories.symbols}
                    onEmojiSelected={emoji => setMessage((currentMessage) => currentMessage + emoji)}
                    columns={8}
                    showSearchBar={false}
                    showSectionTitles={false}
                    showHistory={true}

                />
            }
        </KeyboardAvoidingView>
    )
}

export default MessageInput