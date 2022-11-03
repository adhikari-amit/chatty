import { Auth } from 'aws-amplify';
import { StyleSheet, View, Image, Text , FlatList,Pressable} from 'react-native';
import ChatRooms from '../assets/dummy-data/ChatRooms';
import ChatRoomItem from '../components/ChatRoomItem';

const HomeScreen = () => {
  const logout=()=>{
    Auth.signOut()
  }
  return (
    <View style={styles.page}>
      <FlatList 
       data={ChatRooms}
       renderItem={({item})=><ChatRoomItem chatRoom={item} />}
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
export default HomeScreen