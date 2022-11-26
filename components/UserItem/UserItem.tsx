import React from 'react';
import { Text, Image, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styles from './style';
import { Auth, DataStore } from 'aws-amplify';
import { ChatRoom, User, ChatRoomUser } from '../../src/models';

export default function UserItem( props:any) {
  const navigation = useNavigation();

  const onPress = async () => {

    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    const authUserChatRooms= (await DataStore.query(ChatRoomUser)).filter(chatRoomUser => chatRoomUser.user.id === dbUser?.id).map(chatRoomUser => chatRoomUser.chatRoom);
    const propsUserChatRooms=(await DataStore.query(ChatRoomUser)).filter((ChatRoomUser)=>ChatRoomUser.user.id===props.user.id).map(chatRoomUser => chatRoomUser.chatRoom)

    const commonChatRoom=authUserChatRooms.filter((chatroom)=>{
      return propsUserChatRooms.find((propchatroom)=>propchatroom.id===chatroom.id)
    })
    if(commonChatRoom.length===0){
    //  Create a chat room
    const newChatRoom = await DataStore.save(new ChatRoom({newMessages: 0}));
    
    // connect authenticated user with the chat room
    await DataStore.save(new ChatRoomUser({
      user:dbUser,
      chatRoom: newChatRoom
    }))

    // connect clicked user with the chat room
    await DataStore.save(new ChatRoomUser({
      user:props.user,
      chatRoom: newChatRoom
    }));

    navigation.navigate('ChatRoom', { id: newChatRoom.id });
      
    }
    else{
      navigation.navigate('ChatRoom', { id: commonChatRoom[0].id });
    }
    
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri:props.user.imageUri}} style={styles.image} />
      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{props.user.name}</Text>
          <Text style={styles.status}>{props.user.status}</Text>
        </View>
      </View>
    </Pressable>
  );
}