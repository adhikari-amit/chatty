import { StyleSheet, View, Image, Text , FlatList} from 'react-native';
import ChatRooms from '../assets/dummy-data/ChatRooms';
import ChatRoomItem from '../components/ChatRoomItem';

const HomeScreen = () => {
  return (
    <View style={styles.page}>
      <FlatList 
       data={ChatRooms}
       renderItem={({item})=><ChatRoomItem chatRoom={item} />}
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
export default HomeScreen