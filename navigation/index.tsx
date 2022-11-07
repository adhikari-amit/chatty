import { Text,View ,Image, useWindowDimensions } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { Feather } from '@expo/vector-icons';
import UsersScreen from '../screens/UsersScreen';
import ChatRoomHeader from './ChatRoomHeader';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home"
        component={HomeScreen} 
        options={{headerTitle:HomeHeader}}
      />
      <Stack.Screen 
          name="ChatRoom" 
          component={ChatRoomScreen} 
          options={({route})=>({
            headerTitle:()=><ChatRoomHeader id={route.params?.id}/>,
            headerBackTitleVisible:false 
          })}

      />    
      <Stack.Screen 
          name="UsersScreen" 
          component={UsersScreen}         
          options={{title:'Users'}}
      />

      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}


const HomeHeader=()=>{
  const {width}=useWindowDimensions()
    const navigation= useNavigation()
    const Pressed=()=>{
      navigation.navigate('UsersScreen')
    }
  return (
    <View style={{
      flexDirection:'row',
      justifyContent:'space-between',
      width:width-15,
      padding:10,
      alignItems:'center'
    }}>
     <Image source={{uri:'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.jpg'}} style={{width:30,height:30,borderRadius:30}}/>
      <Text style={{flex:1,textAlign:'center', marginLeft:50,fontWeight:'bold'}}>Chatty</Text>     
        <Feather name="camera" size={24} color="black"  style={{marginHorizontal:10}}/>
        <Pressable onPress={Pressed}>
          <Feather name="edit-2" size={24} color="black" style={{marginHorizontal:10}}/>
        </Pressable> 
    </View>
  )
}



