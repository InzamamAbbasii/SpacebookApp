import React from 'react';
import { Auth } from '../../Screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false
              }}
        >
            <Stack.Screen name='Login' component={Auth.LoginScreen} />
            <Stack.Screen name='Signup' component={Auth.SignupScreen} />
        </Stack.Navigator>
    );
};