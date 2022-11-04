import { Auth, DataStore } from 'aws-amplify';
import {User} from "../src/models"
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text , FlatList,Pressable} from 'react-native';
import UserItem from '../components/UserItem';

const UsersScreen = () => {

  
  const[users,setUsers]=useState<User[]>([])
  useEffect(()=>{
    // Query Users 
    DataStore.query(User).then(setUsers)
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