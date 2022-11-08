import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../../src/models';
import { Auth } from 'aws-amplify';
import styles from './style';
import { S3Image } from 'aws-amplify-react-native'

const Messages = ({ message }: any) => {
  const [user, setUser] = useState<User | undefined>();
  const [isMe, setIsMe] = useState<boolean>(false);

  const { width } = useWindowDimensions()

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!user) {
        return;
      }
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub);
    }
    checkIfMe();
  }, [user])

  if (!user) {
    return <ActivityIndicator />
  }

  return (
    <View style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer]}>
     
          {message.image && (
             <View style={{marginBottom: message.content?10:0}}>
              <S3Image imgKey={message.image} style={{ width: width * 0.7, aspectRatio: 4 / 3 }} resizeMode="contain" />
             </View>
            )
          }
       {message.content && (<Text style={{ color: isMe ? 'black' : 'white' }}>{message.content}</Text>)}
    </View>
  )
}

export default Messages;