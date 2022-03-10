import React from 'react';
import { AuthStack } from '../Stack';
import { HomeBottomNavigation } from '../Bottom';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function MainNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name='Auth' component={AuthStack} />
                <Stack.Screen name='BottomMain' component={HomeBottomNavigation} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default MainNavigation;