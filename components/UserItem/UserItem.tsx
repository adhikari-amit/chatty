import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import styles from './style'
import { useNavigation } from '@react-navigation/native'
import { Auth, DataStore } from 'aws-amplify'
import { ChatRoom, ChatRoomUser, User } from '../../src/models'


const UserItem = ({ user }: any) => {

    const navigation = useNavigation();
    const onPress = async() => {
    //  Create a ChatRoom
     const newChatRoom=await DataStore.save(new ChatRoom({newMessages:0}))

    //  Connect Authenticated User to new chatroom
    const authUser=await Auth.currentAuthenticatedUser()
    const dbUser=await DataStore.query(User,authUser.attributes.sub)
    await DataStore.save(new ChatRoomUser({
        user:dbUser,
        chatRoom:newChatRoom
    }))

    // Connect Clicked user to the chatroom
     await DataStore.save(new ChatRoomUser({
         user:user,
         chatRoom:newChatRoom
     }))

     navigation.navigate('ChatRoom',{id:newChatRoom.id})

    }
    return (
       <>
        <Pressable onPress={onPress} style={styles.container}>
            <Image source={{ uri: user.imageUri }} style={styles.Image} />
            <View style={styles.rightcontainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.status}>{user.status}</Text>
                </View>
            </View>
        </Pressable>
        </>
    )
}


export default UserItem