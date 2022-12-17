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
import HomeHeader from './HomeHeader';
import SettingsScreen from '../screens/SettingsScreen';


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
      <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}         
          options={{title:'Setting'}}
      />

      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}





