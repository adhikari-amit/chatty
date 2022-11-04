import { View, Text,Image ,Pressable} from 'react-native'
import React from 'react'
import styles from './style'
import { useNavigation } from '@react-navigation/native'


const UserItem=({user}:any)=> {

  
  const navigation = useNavigation();
  const onPress=()=>{

  }
  return (
    <>
      
      <Pressable onPress={onPress} style={styles.container}>
        <Image source={{ uri: user.imageUri }} style={styles.Image} />
        
        <View style={styles.rightcontainer}>
          <View style={styles.row}>
            <Text style={styles.name}>{user.name}</Text>
            
          </View>
         
        </View>

      </Pressable>
    </>
  )
}


export default UserItem