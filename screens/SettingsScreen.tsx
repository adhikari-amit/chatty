import { View, Text, Pressable, Alert } from 'react-native'
import React from 'react'
import { generateKeyPair } from '../utils/crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth, DataStore } from 'aws-amplify';
import { User } from '../src/models';

export const PRIVATE_KEY = "PRIVATE_KEY";

const SettingsScreen = () => {
    const updateKeyPair=async()=>{
        // generate private and public key
        const {publicKey,secretKey} = generateKeyPair();
        
        // Save private key to Async storage
        try {
            await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString())
            
          } catch (e) {
            // saving error
            alert("Unintended Error Occurred!")
          } 

        // Save public key to table
        const userData=await Auth.currentAuthenticatedUser()
        const dbUser=await DataStore.query(User,userData.attributes.sub)
        if(!dbUser){
            Alert.alert("User Not Found!")
            return
        }
        await DataStore.save(User.copyOf(dbUser,(updateduser)=>{
            updateduser.publicKey=publicKey.toString()
        }))
    }

    const logout= async()=>{
      try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
    }
  return (
    <View>
     <Pressable onPress={updateKeyPair} style={{backgroundColor:"white",height:50,margin:10,alignItems:"center",justifyContent:"center"}}><Text>Update Key</Text></Pressable>
     <Pressable onPress={logout} style={{backgroundColor:"red",height:50,margin:10,alignItems:"center",justifyContent:"center"}}><Text>Log Out</Text></Pressable>

    </View>
  )
}

export default SettingsScreen