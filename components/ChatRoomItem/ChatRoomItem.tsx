import React, { useState, useEffect } from 'react'
import { Text, Image, View, Pressable, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { DataStore } from '@aws-amplify/datastore'
import { ChatRoomUser, User, Message } from '../../src/models'
import styles from './style'
import { Auth } from '@aws-amplify/auth'
import moment from 'moment'


export default function ChatRoomItem({ chatRoom }: any) {

  const [user, setUser] = useState<User | null>(null);
  const [lastMessage, setLastMessage] = useState<Message | undefined>();
  const [isLoading,setIsLoading]=useState(true)
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter(chatRoomUser => chatRoomUser.chatRoom.id === chatRoom.id)
        .map(chatRoomUser => chatRoomUser.user)
      const authUser = await Auth.currentAuthenticatedUser();
      setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null)
      setIsLoading(false)
    };
    fetchUsers();
  }, []);

  
  useEffect(() => {
    if (!chatRoom.chatRoomLastMessageId) { return }
    DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(setLastMessage);
  }, [])

  const onPress = () => {
    navigation.navigate('ChatRoom', { id: chatRoom.id });
  }

  if (isLoading) {
    return <ActivityIndicator />
  }
  const lastmessagecreateat = moment(lastMessage?.createdAt).from(moment())
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: user?.imageUri }} style={styles.image} />

      {!!chatRoom.newMessages && <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
      </View>}

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>{user?.name}</Text>
          <Text style={styles.text}>{lastmessagecreateat}</Text>
        </View>
        {/* <Text numberOfLines={1} style={styles.text}>{lastMessage?.content}</Text> */}
      </View>
    </Pressable>
  );
}
