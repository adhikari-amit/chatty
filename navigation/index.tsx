import { Text,View ,Image, useWindowDimensions } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { Feather } from '@expo/vector-icons';


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
          options={{headerTitle:ChatRoomHeader,headerBackTitleVisible:false}}

      />

      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}


const HomeHeader=()=>{
  const {width}=useWindowDimensions()
  return (
    <View style={{
      flexDirection:'row',
      justifyContent:'space-between',
      width,
      padding:10,
      alignItems:'center'
    }}>
     <Image source={{uri:'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.jpg'}} style={{width:30,height:30,borderRadius:30}}/>
      <Text style={{flex:1,textAlign:'center', marginLeft:50,fontWeight:'bold'}}>Chatty</Text>
      
        <Feather name="camera" size={24} color="black"  style={{marginHorizontal:10}}/>
        <Feather name="edit-2" size={24} color="black" style={{marginHorizontal:10}}/>
    </View>
  )
}



const ChatRoomHeader=(props:any)=>{
  const {width}=useWindowDimensions()
  return (
    <View style={{
      flexDirection:'row',
      justifyContent:'space-between',
      width:width-20,
      padding:10,
      alignItems:'center'
    }}>
     <Image source={{uri:'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.jpg'}} style={{width:30,height:30,borderRadius:30}}/>
      <Text style={{flex:1, marginLeft:10,fontWeight:'bold'}}>{props.children}</Text>
      
        <Feather name="camera" size={24} color="black"  style={{marginHorizontal:10}}/>
        <Feather name="edit-2" size={24} color="black" style={{marginHorizontal:10}}/>
    </View>
  )
}