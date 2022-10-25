import { View, Text } from 'react-native'
import React from 'react'
import styles from './style'

const myID = 'u1'

const Message = ({ message }: any) => {
    const isMe = message.user.id === myID
    return (
        <View style={[
            styles.container, isMe ? styles.rightcontainer : styles.leftcontainer
        ]}>
        <Text style={{ color: isMe ? 'black' : 'white' }}>{message.content}</Text>
        </View>
    )
}

export default Message