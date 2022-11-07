import React, {useState, useEffect} from 'react';
import { Text, Image, View, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { DataStore } from '@aws-amplify/datastore';
import { ChatRoomUser, User, Message } from '../../src/models';
import styles from './style';
import {Auth} from '@aws-amplify/auth';

export default function ChatRoomItem({ chatRoom }:any) {
  // const [users, setUsers] = useState<User[]>([]); // all users in this chatroom
  const [user, setUser] = useState<User|null>(null); // the display user
  //const [lastMessage, setLastMessage] = useState<Message|undefined>();

  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter(chatRoomUser => chatRoomUser.chatRoom.id === chatRoom.id)
        .map(chatRoomUser => chatRoomUser.user);


      const authUser = await Auth.currentAuthenticatedUser();
      setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null);

    };
    fetchUsers();
  }, []);

/*  useEffect(() => {
    if (!chatRoom.chatRoomLastMessageId) { return }
    DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(setLastMessage);
  }, [])
*/
  const onPress = () => {
    navigation.navigate('ChatRoom', { id: chatRoom.id });
  }

  if (!user) {
    return <ActivityIndicator />
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: user.imageUri}} style={styles.image} />

      {!!chatRoom.newMessages && <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
      </View>}

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
         
        </View>
    
      </View>
    </Pressable>
  );
}
