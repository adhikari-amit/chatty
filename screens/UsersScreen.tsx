import { Auth } from 'aws-amplify';
import React from 'react';
import { StyleSheet, View, Image, Text , FlatList,Pressable} from 'react-native';
import Users from '../assets/dummy-data/Users';
import UserItem from '../components/UserItem';

const UsersScreen = () => {
  const logout=()=>{
    Auth.signOut()
  }
  return (
    <View style={styles.page}>
      <FlatList 
       data={Users}
       renderItem={({item})=><UserItem user={item} />}
       showsVerticalScrollIndicator={false}
       />

      <Pressable style={{backgroundColor:'red',height:50,margin:10,borderRadius:5,alignItems:'center',justifyContent:'center'}} onPress={logout}>      
        <Text>Logout</Text>
      </Pressable> 
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