import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTab from './src/Screens/BottomTab';
import DrawerNavigation from './src/Navigation/DrawerNavigation';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/Screens/Login';
import SignUp from './src/Screens/SignUp';
import Profile from './src/Screens/profile';
import FriendProfile from './src/Screens/FriendProfile';
import EditProfile from './src/Screens/EditProfile';
import Home from './src/Screens/Home';
import CreatePost from './src/Screens/CreatePost';
import EditPost from './src/Screens/EditPost';
import SplashScreen from './src/Screens/SplashScreen';
import Search from './src/Screens/Search';
import Draft from './src/Screens/Draft';
import EditDraft from './src/Screens/EditDraft';
import Schedule from './src/Screens/Schedule';

import { postSchedules_Posts } from './src/Screens/API';
import {
  registerBackgroundFetchAsync,
  checkStatusAsync,
} from './src/Screens/BackgroundTask';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    if (Platform.OS === 'android') {
      const taskInfo = await checkStatusAsync();
      await registerBackgroundFetchAsync();
    } else if (Platform.OS === 'web') {
      console.log('Background Task is not available in web');
    }

    setTimeout(async () => {
      const userInfo = await AsyncStorage.getItem('@session_token');
      if (userInfo != null) {
        const parse = JSON.parse(userInfo);
        setUserToken(parse.token);
      }
      setLoading(false);
    }, 5000);

    // for schedule posts
    const interval = setInterval(async () => {
      console.log('Start-->' + new Date().toLocaleTimeString());
      await postSchedules_Posts()
        .then((res) => console.log(res.toString()))
        .catch((err) => console.log('Error in Schedule posting', err));
      console.log('End---->' + new Date().toLocaleTimeString());
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#1b74e4'} />
      {userToken == null ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BottomTab"
            component={BottomTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DrawerNavigation"
            component={DrawerNavigation}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName="BottomTab"
          screenOptions={{
            headerShown: true,
          }}
        >
          {/* <Stack.Screen
            name="BottomTab"
            component={BottomTab}
            options={{ headerShown: false }}
          /> */}

          <Stack.Screen
            name="DrawerNavigation"
            component={DrawerNavigation}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="Schedule" component={Schedule} />
          <Stack.Screen name="CreatePost" component={CreatePost} />
          <Stack.Screen name="Draft" component={Draft} />
          <Stack.Screen name="EditDraft" component={EditDraft} />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ title: '' }}
          />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen
            name="FriendProfile"
            component={FriendProfile}
            options={{ title: 'Profile' }}
          />
          <Stack.Screen name="EditPost" component={EditPost} />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
