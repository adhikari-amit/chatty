import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native'
import styles from './style'
import { SimpleLineIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons'
import { Auth, DataStore, Storage } from 'aws-amplify'
import { ChatRoom, ChatRoomUser, EagerUser, Message } from '../../src/models'
import EmojiSelector, { Categories } from "react-native-emoji-selector"
import * as ImagePicker from 'expo-image-picker'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { Audio, AVPlaybackStatus } from 'expo-av'
import AudioPlayer from '../AudioPlayer'
import Messages from '../Messages'
import MessageReply from '../MessageReply'
import { useNavigation } from '@react-navigation/native'


import { box } from "tweetnacl";
import { encrypt, stringToUint8Array } from '../../utils/crypto'
import AsyncStorage from "@react-native-async-storage/async-storage";
export const PRIVATE_KEY = "PRIVATE_KEY";

const MessageInput = ({ chatroom, messageReplyTo, removeMessageReplyTo }: any) => {
    const [message, setMessage] = useState('')
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
    const [image, setImage] = useState<string | null>(null)
    const [recording, setRecording] = useState<Audio.Recording | null>(null)
    const [soundURI, setSoundURI] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)

    //  Reset StateValue of all once data send.
    const resetFields = () => {
        setMessage('')
        setIsEmojiPickerOpen(false)
        setImage(null)
        setProgress(0)
        setSoundURI(null)
        removeMessageReplyTo()

    }

    // Permission ask fro audio,camera,image
    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const libraryResponse = await ImagePicker.requestMediaLibraryPermissionsAsync()
                const photoResponse = await ImagePicker.requestCameraPermissionsAsync()
                const audioResponse = await Audio.requestPermissionsAsync()
                if (
                    libraryResponse.status !== "granted" ||
                    photoResponse.status !== "granted" 
                ) {
                    alert("Sorry, we need camera roll permissions to make this work!")
                }
            }
        })
            ()
    }, [])

    // Send the content on press button click.  
    const sendContent = async () => {
        if (image) {
            sendImage()
        }
        else if (soundURI) {
            sendAudio()
        }
        else if (message) {
            sendMessage()
        }
        else {
            onePlusCLicked()
        }

        const authUser = await Auth.currentAuthenticatedUser()

    }

    // Update the Last Message.
    const UpdateLastMessage = async (newMessage: any) => {
        DataStore.save(ChatRoom.copyOf(chatroom, updatedChatRoom => {
            updatedChatRoom.LastMessage = newMessage
        }))
    }

    // Just a Default task if nothing is selected but send button is pressed.
    const onePlusCLicked = () => {
        console.log("clicked")
    }

    const navigation = useNavigation()

    const getMySecretKey = async () => {
        const keyString = await AsyncStorage.getItem(PRIVATE_KEY);

        if (!keyString) {
            Alert.alert(
                "You haven't set your keypair yet",
                "Go to settings, and generate a new keypair",
                [
                    {
                        text: "Open setting",
                        onPress: () => navigation.navigate("Settings"),
                    },
                ]
            );
            return;
        }
        // return stringToUint8Array(keyString);
        return Uint8Array.from(keyString.split(",").map((str) => parseInt(str)))
    };

    // Send Encrypted Message to Users
    const sendMessageToUser = async (user: any, fromUserID: string) => {
        const mySecretkey = await getMySecretKey()

        if (!mySecretkey) {
            Alert.alert("You HAVEN'T SET KEYPAIR")
            return;
        }
        if (!user.publicKey) {
            Alert.alert("OTHER USER HAVEN'T SET KEYPAIR")
            return;
        }
        const sharedkey = box.before(stringToUint8Array(user.publicKey), mySecretkey);
        const encryptedMessage = encrypt(sharedkey, { message })
        if (message) {
            const newMessage = await DataStore.save(new Message({
                content: encryptedMessage,
                userID: fromUserID,
                forUserID: user.id,
                chatroomID: chatroom.id,
                status: "SENT",
                replyToMessageID: messageReplyTo?.id
            }))

            // UpdateLastMessage(newMessage)
        }
        else {
            console.warn("No message");
        }

    }

    // Function for sending the text Message
    const sendMessage = async () => {
        const users = (await DataStore.query(ChatRoomUser)).filter((cru) => cru.chatRoom.id === chatroom.id).map((chatroomuser) => chatroomuser.user)
        const authUser = await Auth.currentAuthenticatedUser()
        await Promise.all(users.map(user => sendMessageToUser(user, authUser.attributes.sub)))
        resetFields()
    }

    // Function for sending the Image
    const sendImage = async () => {
        if (!image) {
            return
        }
        const blob = await getBlob(image)
        const { key } = await Storage.put(`${uuidv4()}.png`, blob, {
            progressCallback(progress) {
                setProgress(progress.loaded / progress.total)
            }
        }
        )
        const authUser = await Auth.currentAuthenticatedUser()
     
        const newMessage = await DataStore.save(new Message({
            content: message,
            image: key,
            userID: authUser.attributes.sub,
            chatroomID: chatroom.id,
            replyToMessageID: messageReplyTo?.id,
            forUserID:authUser.attributes.sub

        }))
        UpdateLastMessage(newMessage)
        resetFields()

    }

    // Image processing before sending the image/audio
    const getBlob = async (uri: string) => {

        const response = await fetch(uri)
        const blob = await response.blob()
        return blob

    }

    const pickImage = async () => {
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

        if (!result.cancelled) {
            setImage(result.uri);
        }

    }


    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync()
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            })
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
            )
            setRecording(recording)
        } catch (err) {
            console.error('Failed to start recording', err)
        }
    }

    const stopRecording = async () => {
        if (!recording) {
            return
        }
        setRecording(null)

        await recording.stopAndUnloadAsync()

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false
        })
        const uri = recording.getURI()
        if (!uri) {
            return
        }
        setSoundURI(uri)

    }


    const sendAudio = async () => {
        if (!soundURI) {
            return
        }
        const blob = await getBlob(soundURI)
        const uriParts = soundURI.split(".")
        const extension = uriParts[uriParts.length - 1]
        const { key } = await Storage.put(`${uuidv4()}.${extension}`, blob)
        const user = await Auth.currentAuthenticatedUser()

        const newMessage = await DataStore.save(new Message({
            content: message,
            audio: key,
            userID: user.attributes.sub,
            chatroomID: chatroom.id,
            replyToMessageID: messageReplyTo?.id,
            forUserID: null,

        }))
        UpdateLastMessage(newMessage)
        resetFields()

    }


    return (

        <KeyboardAvoidingView style={[styles.root, { height: isEmojiPickerOpen ? "50%" : "auto" }]} behavior={Platform.OS === 'ios' ? 'padding' : "height"}
            keyboardVerticalOffset={80}
        >
            {messageReplyTo &&
                <View style={{ backgroundColor: "#f2f2f2", padding: 5, flexDirection: "row", alignItems: "stretch", justifyContent: "space-between" }}>
                    <View style={{ flex: 1 }}>
                        <Text>Reply To</Text>
                        <MessageReply message={messageReplyTo} />
                    </View>
                    <Pressable onPress={() => removeMessageReplyTo()}>
                        <AntDesign name="close" size={24} color="black" style={{ margin: 5 }} />
                    </Pressable>

                </View>
            }
            {image && (<View style={styles.sendImageContainer}>
                <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />

                <View style={{ flex: 1, justifyContent: "flex-start", alignSelf: "flex-end" }}>
                    <View style={{
                        height: 5,
                        borderRadius: 5,
                        backgroundColor: "#3777f0",
                        width: `${progress * 100}%`,
                    }}>

                    </View>
                </View>
                <Pressable onPress={() => setImage(null)}>
                    <AntDesign name="close" size={24} color="black" style={{ margin: 5 }} />
                </Pressable>
            </View>)
            }

            {soundURI && <AudioPlayer soundURI={soundURI} />
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

                    <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
                        <Feather name="mic" size={24} color={recording ? "red" : "#595959"} style={styles.icon} />
                    </Pressable>
                </View>
                <Pressable onPress={sendContent} style={styles.buttonContainer}>
                    {
                        message || image || soundURI ? <Ionicons name="send" size={24} color="white" />
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