import { useNavigation } from "@react-navigation/native"
import { useWindowDimensions, View,Text,Pressable,Image } from "react-native"
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useEffect, useState } from "react";
import { Auth, DataStore } from "aws-amplify";
import { User } from "../src/models";

const HomeHeader=()=>{
    const [user, setUser] = useState<User|null>(null)
    const {width}=useWindowDimensions()
      const navigation= useNavigation()
      const Pressed=()=>{
        navigation.navigate('UsersScreen')
      }

  
   useEffect(()=>{
   
    const userdetils= async ()=>{
       const authUser=await Auth.currentAuthenticatedUser()  
       const fetchedUsers=await DataStore.query(User,authUser.attributes.sub)
       setUser(fetchedUsers)
    } 
    userdetils()
   },[])
   
 
   const logOut = () => {
    Auth.signOut();
  }
  
      
    return (
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        width:width-15,
        padding:10,
        alignItems:'center'
      }}>
       <Image source={{uri:user?.imageUri}} style={{width:30,height:30,borderRadius:30}}/>
        <Text style={{flex:1,textAlign:'center', marginLeft:50,fontWeight:'bold',fontSize:15}}>Chatty</Text>     
          <Pressable onPress={Pressed}>
            <Feather name="edit-2" size={24} color="black" style={{marginHorizontal:10}}/>
          </Pressable> 
          <Pressable onPress={logOut} >
            <MaterialIcons name="logout" size={24} color="black" style={{marginHorizontal:10}}/>
          </Pressable>
      </View>
    )
  }
  
export default HomeHeader  