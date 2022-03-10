import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './profile';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import Friends from './Friends';
import FriendRequest from './FriendRequests';
import AddFriend from './AddFriend';
import { HomeScreen } from './Main';


import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false
            }}
        >
            {/* <Tab.Screen name='HomeScreen' component={HomeScreen} /> */}
            {/* <Tab.Screen name='Friends' component={Main.FriendsScreen} />
            <Tab.Screen name='Post' component={Main.PostScreen} /> */}
            {/* <Tab.Screen name='Profile' component={Profile} /> */}
            <Tab.Screen name='Home' component={Home} options={{ headerShown:true,
                tabBarIcon: ({ focused, color, size }) => {
                    return <Entypo name="home" size={size} color={color} />
                },
            }}
            />
            <Tab.Screen name='Friends' component={Friends} options={{
                tabBarIcon: ({ focused, color, size }) => {
                    return <FontAwesome5 name="user-friends" size={size} color={color} />
                },
            }} />
            <Tab.Screen name='AddFriend' component={AddFriend} options={{
                tabBarIcon: ({ focused, color, size }) => {
                    return <Entypo name="add-user" size={size} color={color} />
                },
            }} />
            <Tab.Screen name='FriendRequest' component={FriendRequest} options={{title:'',
                tabBarIcon: ({ focused, color, size }) => {
                    return <MaterialIcons name="notifications-active" size={size} color={color} />
                },
            }}
            />
            <Tab.Screen name='Profile' component={Profile} options={{
                tabBarIcon: ({ focused, color, size }) => {
                    return <Ionicons name="person" size={size} color={color} />
                },
            }} />
            {/* <Tab.Screen name='Login' component={Login} /> */}
        </Tab.Navigator>
    );
}