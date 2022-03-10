import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Main } from '../../Screens';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false
            }}
        >
            <Tab.Screen name='Home' component={Main.HomeScreen} />
            <Tab.Screen name='Friends' component={Main.FriendsScreen} />
            <Tab.Screen name='Post' component={Main.PostScreen} />
             <Tab.Screen name='Profile' component={Main.ProfilesScreen} />
        </Tab.Navigator>
    );
}