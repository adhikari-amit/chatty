import React, { useState, useEffect } from 'react';

import { Text, Image, Pressable, View, StyleSheet, FlatList } from 'react-native';
import { Auth, DataStore } from 'aws-amplify';
import { ChatRoom, ChatRoomUser } from '../src/models';
import ChatRoomItem from '../components/ChatRoomItem';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { NavigationContainer, useIsFocused } from '@react-navigation/native';
 

export default function HomeScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  // const isFocused = useIsFocused();
  useEffect(() => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser()
      const chatRooms = (await DataStore.query(ChatRoomUser))
        .filter(chatRoomUser => chatRoomUser.user.id === userData.attributes.sub)
        .map(chatRoomUser => chatRoomUser.chatRoom);

      setChatRooms(chatRooms);
      
    };
    fetchChatRooms();
  },[]);

  // useEffect(() => {
  //   const subscription = DataStore.observe(ChatRoom).subscribe(
  //     (chatroom) => {
  //       if (chatroom.model === ChatRoom) {
  //         chatroom.opType==="UPDATE"
  //           setChatRooms((chatroom) => ({ ...chatRooms, ...chatroom }))    
  //       }
  //     }
  //   );

  //   return () => subscription.unsubscribe();
  // }, []);
  
  return (
    <View style={styles.page}>
       <FlatList 
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1
  }
});