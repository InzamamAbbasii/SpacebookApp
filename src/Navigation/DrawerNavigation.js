import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Avatar, Caption } from 'react-native-paper';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { get, post, GetUserData, getProfilePhoto1 } from '../Screens/API';
import GetUserInfo, { RemoveUserInfo } from '../utils/async-storage';

import BottomTab from '../Screens/BottomTab';
import CreatePost from '../Screens/CreatePost';
import Draft from '../Screens/Draft';
import Schedule from '../Screens/Schedule';
import Profile from '../Screens/profile';
import Search from '../Screens/Search';

const CustomDrawerContent = (props, { navigation }) => {
  const [user, setUser] = useState({
    user_id: 0,
    token: '',
    first_name: '',
    last_name: '',
    email: '',
    friend_count: 0,
  });
  const [profile, setProfile] = useState(null);

  useEffect(async () => {
    const loggedInUser = await GetUserInfo();
    await getUserInfo(loggedInUser.id, loggedInUser.token);

    await getProfilePhoto1(loggedInUser.id, loggedInUser.token)
      .then((res) => setProfile(res))
      .catch(() => console.log('Error in getting profile'));
    // await GetUserData.then((res) => {
    //   console.log(res.friend_count);
    //   setUser({
    //     user_id: res.user_id,
    //     token: loggedInUser.token,
    //     first_name: res.first_name,
    //     last_name: res.last_name,
    //     email: res.email,
    //     friend_count: res.friend_count,
    //     profile: res.profile,
    //   });
    // }).catch((err) => {
    //   alert(err), props.navigation.navigate('Login');
    // });
  }, []);
  const getUserInfo = async (id, token) => {
    return get(`user/${id}`, token)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw 'Something went wrong';
      })
      .then((JsonResponse) => {
        // setToken(token);
        // setUser_id(JsonResponse.user_id);
        // setFirst_name(JsonResponse.first_name);
        // setLast_name(JsonResponse.last_name);
        // setEmail(JsonResponse.email);
        setUser({
          user_id: JsonResponse.user_id,
          token: token,
          first_name: JsonResponse.first_name,
          last_name: JsonResponse.last_name,
          email: JsonResponse.email,
          friend_count: JsonResponse.friend_count,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const logout = async () => {
    const loggedInUser = await GetUserInfo();
    const headers = {
      'X-Authorization': loggedInUser.token,
    };
    return post('logout', headers)
      .then(async (res) => {
        props.navigation.navigate('Login');
        if (res.status === 200) {
          await RemoveUserInfo();
        }
      })
      .catch((err) => alert(`err${err}`));
  };

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          paddingVertical: 35,
          paddingHorizontal: 10,
          marginTop: -5,
          backgroundColor: '#1b74e4',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Avatar.Image source={{ uri: `${profile}` }} size={60} />
          <View style={{ flexDirection: 'column', marginLeft: 10, flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              {user.first_name} {user.last_name}
            </Text>
            <Caption style={{ color: '#eee', fontSize: 15, flexWrap: 'wrap' }}>
              {user.email}
            </Caption>
          </View>
        </View>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity
        style={{ flexDirection: 'row', marginTop: '10%', marginLeft: 18 }}
        onPress={() => {
          props.navigation.navigate('CreatePost', {
            user_id: user.user_id,
            token: user.token,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profile: user.profile,
          });
        }}
      >
        <Ionicons name="create" size={24} color="black" />
        <Text style={{ color: '#444', marginLeft: 35 }}>Create Post</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => logout()}
        style={{ flexDirection: 'row', marginTop: '10%', marginLeft: 18 }}
      >
        <MaterialIcons name="logout" size={24} color={'black'} />
        <Text style={{ color: '#444', marginLeft: 35 }}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};
const Drawer = createDrawerNavigator();

const DrawerNavigation = ({ navigation, ScreenName }) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      console.log('feed is focused');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        title: ScreenName,
        headerShown: true,
      }}
    >
      <Drawer.Screen
        name="BottomTab"
        component={BottomTab}
        options={({ route }) => ({
          title: 'Home',
          headerShown: false,
          drawerIcon: (config) => (
            <Entypo name="home" size={20} color={config.color} />
          ),
        })}
      />
      <Drawer.Screen
        name="Draft"
        component={Draft}
        options={{
          drawerIcon: (config) => (
            <MaterialIcons name="drafts" size={24} color={config.color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Schedule"
        component={Schedule}
        options={{
          drawerIcon: (config) => (
            <MaterialIcons
              name="schedule-send"
              size={24}
              c
              color={config.color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Search"
        component={Search}
        options={{
          drawerIcon: (config) => (
            <MaterialIcons
              name="person-search"
              size={24}
              color={config.color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
