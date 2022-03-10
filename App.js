
import { MainNavigation } from './src/Navigation/Flow';

import React from 'react';
import { AuthStack } from '../SpacebookApp/src/Navigation/Stack';
import { HomeBottomNavigation } from '../SpacebookApp/src/Navigation/Bottom';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/Screens/Login';
import SignUp from './src/Screens/SignUp';
import Profile from './src/Screens/profile';
import BottomTab from './src/Screens/BottomTab';
import EditProfile from './src/Screens/EditProfile';
import Home from './src/Screens/Home';
import CreatePost from './src/Screens/CreatePost';
import EditPost from './src/Screens/EditPost';
const Stack = createNativeStackNavigator();

export default function App() {
  global.ip = '192.168.1.102';
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true
        }}
      >
        
        <Stack.Screen name='Login' component={Login} options={{headerShown:false}}/> 
        <Stack.Screen name='BottomTab' component={BottomTab}  options={{headerShown:false}}/>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='SignUp' component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='CreatePost' component={CreatePost} />
        <Stack.Screen name='EditPost' component={EditPost} />

        <Stack.Screen name='Auth' component={AuthStack} />
        <Stack.Screen name='BottomMain' component={HomeBottomNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}