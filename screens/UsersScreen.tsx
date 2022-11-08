import Amplify, { Auth, DataStore } from 'aws-amplify';
import {User} from "../src/models"
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text , FlatList,Pressable} from 'react-native';
import UserItem from '../components/UserItem';

const UsersScreen = () => {

  
  const[users,setUsers]=useState<User[]>([])
  useEffect(()=>{
    // Query Users 
    const getUsers=async()=>{
      const authUser=await Auth.currentAuthenticatedUser()
       DataStore.query(User,user => user.id("ne",authUser.attributes.sub )).then(setUsers)
    }

    getUsers()


  },[])

  return (
    <View style={styles.page}>
      <FlatList 
       data={users}
       renderItem={({item})=><UserItem user={item} />}
       showsVerticalScrollIndicator={false}
       />
 
    </View>
  )
}

const styles=StyleSheet.create({
  page:{
    backgroundColor:'white',
    flex:1
  }
})
export default UsersScreen