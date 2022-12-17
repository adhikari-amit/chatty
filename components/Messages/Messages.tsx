import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import { User } from "../../src/models";
import { Auth, Storage } from "aws-amplify";
import { S3Image } from "aws-amplify-react-native";
import { useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AudioPlayer from "../AudioPlayer";
import { Message as MessageModel } from "../../src/models";
import styles from "./style";
import MessageReply from "../MessageReply";
import { useActionSheet } from '@expo/react-native-action-sheet';

import { box } from "tweetnacl";
import { decrypt, stringToUint8Array } from '../../utils/crypto'
// import { SECRET_KEY } from '../../screens/SettingsScreen'
import { useNavigation } from '@react-navigation/native'

import AsyncStorage from "@react-native-async-storage/async-storage";
export const PRIVATE_KEY = "PRIVATE_KEY";

const Messages = (props: any) => {
  const { setAsMessageReply, message: propMessage } = props
  const [message, setMessage] = useState<MessageModel>(propMessage)
  const [decryptedmessage, setDecryptedmessage] = useState("")
  const [isDeleted, setIsDeleted] = useState(false)
  const [repliedTo, setRepliedTo] = useState<MessageModel | undefined>(undefined)
  const [user, setUser] = useState<User | undefined>()
  const [isMe, setIsMe] = useState<boolean | null>(null)
  const [soundURI, setSoundURI] = useState<any>(null)

  const { showActionSheetWithOptions } = useActionSheet();
  const { width } = useWindowDimensions()
  const navigation = useNavigation()

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser)
  }, [])

  useEffect(() => {

    setMessage(propMessage);
    
  }, [propMessage]);

  useEffect(() => {
    if (message?.replyToMessageID) {
      DataStore.query(MessageModel, message.replyToMessageID).then(setRepliedTo);
    }
  }, [message]);


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

    return stringToUint8Array(keyString);
  };

  useEffect(() => {
    if (!message?.content || message.image || message.audio || !user?.publicKey) {
      return;
    }  
    const decryptMessage = async () => {
      const myKey = await getMySecretKey();
      if (!myKey) {
        return;
      }     
      const User= await Auth.currentAuthenticatedUser()

      // decrypt message.content
      const sharedKey = box.before(stringToUint8Array(user.publicKey), myKey);
      if(message.forUserID===User.attributes.sub){
        try{
          const decrypted = decrypt(sharedKey, message.content);
          setDecryptedmessage(decrypted.message);
        }catch(err){
          console.log(err)
        }
        
      }
    };

    decryptMessage();
  }, [message, user]);


  useEffect(() => {
    const subscription = DataStore.observe(MessageModel, message.id).subscribe(
      (msg) => {
        if (msg.model === MessageModel) {
          if (msg.opType === "UPDATE") { 
            setMessage((message) => ({ ...message, ...msg.element }));
          }
          else if (msg.opType === "DELETE") {
            setIsDeleted(true)
          }
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);


  useEffect(() => {
    setAsRead();
  }, [isMe, message]);

  useEffect(() => {
    if (message.audio) {
      Storage.get(message.audio).then(setSoundURI);
    }
  }, [message]);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!user) {
        return;
      }
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub);
    };
    checkIfMe();
  }, [user]);

  const setAsRead = async () => {
   

    if (isMe === false && message.status !== "READ") {
      const authUser=await Auth.currentAuthenticatedUser()
      if(message.forUserID===authUser.attributes.sub){
        return
      }
      try{
        await DataStore.save(
          MessageModel.copyOf(message, (updated) => {
            updated.status = "READ";
          })
        );
        console.log("READ:",message);
        
      }catch(err){
         console.log(err);  
      }
    }
  };

  const deleteMessage = async () => {
    await DataStore.delete(message)
  }
  const confirmDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this message?", [
      {
        text: "Delete",
        onPress: deleteMessage,
        style: "destructive"
      },
      {
        text: "Cancel",
        style: "cancel"
      }
    ])
  }
  const onActionPress = (index: any) => {
    if (index === 0) {
      setAsMessageReply()
    }
    else if (index === 1) {
      confirmDelete()
    }

  }

  const openActionMenu = () => {
    const options = ['Reply', 'Delete', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, onActionPress)
  }

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <Pressable
      onLongPress={openActionMenu}

      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        { width: soundURI ? "75%" : "auto" },
      ]}
    >
      {repliedTo && <MessageReply message={repliedTo} />}
      {message.image && (
        <View style={{ marginBottom: message.content ? 10 : 0 }}>
          <S3Image
            imgKey={message.image}
            style={{ width: width * 0.65, aspectRatio: 4 / 3 }}
            resizeMode="contain"
          />
        </View>
      )}
      {soundURI && <AudioPlayer soundURI={soundURI} />}
      <View style={styles.row}>
        {!!decryptedmessage && (
          <Text style={{ color: isMe ? "black" : "white" }}>
            {isDeleted ? "Message Deleted" : decryptedmessage}
          </Text>
        )}
        
        {isMe && !!message.status && message.status !== "SENT" && (
          <Ionicons
            name={
              message.status === "DELIVERED" ? "checkmark" : "checkmark-done"
            }
            size={16}
            color="gray"
            style={{ marginHorizontal: 5 }}
          />
        )}
      </View>
    </Pressable>
  );
};



export default Messages;