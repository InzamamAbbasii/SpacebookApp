import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Entypo,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  FontAwesome,
} from '@expo/vector-icons';
import Profile from './profile';
import Home from './Home';
import Friends from './Friends';
import FriendRequest from './FriendRequests';
import AddFriend from './AddFriend';
import GetUserInfo from '../utils/async-storage';
const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  const [loggedInuserId, setLoggedInuserId] = useState(0);
  useEffect(async () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let loggedInUser = await GetUserInfo();
      setLoggedInuserId(loggedInUser.id);
    });
    return () => unsubscribe;
  }, [navigation]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          title: 'Spacebook',
          headerTintColor: '#1b74e4',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                marginRight: 10,
              }}
            >
              <FontAwesome
                name="search"
                size={24}
                color="#1b74e4"
                style={{ marginHorizontal: 25 }}
                onPress={() => navigation.navigate('Search')}
              />
              <Entypo
                name="menu"
                size={24}
                color="#1b74e4"
                onPress={() => {
                  navigation.toggleDrawer(),
                    navigation.navigate('DrawerNavigation', {
                      userName: 'userName',
                    });
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={Friends}
        options={{
          // unmountOnBlur: true,
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-friends" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddFriend"
        component={AddFriend}
        options={{
          // unmountOnBlur: true,
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="add-user" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FriendRequest"
        component={FriendRequest}
        options={{
          // unmountOnBlur: true, //to re-render screen on tab change
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="notifications-active"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          // unmountOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person"
              size={size}
              color={color}
              onPress={() =>
                navigation.navigate('Profile', { user_id: loggedInuserId })
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
