import { View, Text,Image } from 'react-native'
import React from 'react'
import styles from './style'


const ChatRoomItem=({chatRoom}:any)=> {
  const user=chatRoom.users[1]
  return (
    <>
      
      <View style={styles.container}>
        <Image source={{ uri: user.imageUri }} style={styles.Image} />
        {
        chatRoom.newMessage && <View style={styles.badgeContainer}><Text style={styles.badgeText}>{chatRoom.newMessage}</Text></View>
        } 
        <View style={styles.rightcontainer}>
          <View style={styles.row}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.txt}>{chatRoom.lastMessage.createdAt}</Text>
          </View>
          <Text numberOfLines={1} style={styles.txt}>{chatRoom.lastMessage.content}</Text>
        </View>

      </View>
    </>
  )
}


export default ChatRoomItem