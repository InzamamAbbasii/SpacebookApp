import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import GetUserInfo, {
  RemoveUserInfo,
  RemoveAll_UserInfo,
} from '../utils/async-storage';
import CommonStyles from './Styles/Common/CommonStyle';
import { get, post, getProfilePhoto1 } from './API';
import Loader1 from '../Components/Loader1';
const FriendProfile = ({ navigation, route }) => {
  const [base64Image, setBase64Image] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [friends_count, setFriends_count] = useState(0);
  const isFocused = useIsFocused();

  useEffect(async () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //TODO: The screen is focused
      const loggedInUser = await GetUserInfo();
      console.log('route.params : ', route.params);

      let id =
        typeof route.params.user_id === 'undefined'
          ? loggedInUser.id
          : route.params.user_id;
      await getUserInfo(id, loggedInUser.token);
      // await getUserInfo(loggedInUser.id, loggedInUser.token);
      const profile = await getProfilePhoto1(
        id,
        // loggedInUser.id,
        loggedInUser.token
      );
      setBase64Image(profile);
      loggedInUser.id === id
        ? setIsLoggedInUser(true)
        : setIsLoggedInUser(false); //TODO: to haldle edit button
    });
    return () => unsubscribe;
  }, [navigation]);

  const getUserInfo = async (id, token) => {
    setLoading(true);

    return get(`user/${id}`, token)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw 'Something went wrong';
      })
      .then((JsonResponse) => {
        setFirst_name(JsonResponse.first_name);
        setLast_name(JsonResponse.last_name);
        setEmail(JsonResponse.email);
        setFriends_count(JsonResponse.friend_count);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => setLoading(false));
  };
  const logout = async () => {
    const loggedInUser = await GetUserInfo();
    const headers = {
      'X-Authorization': loggedInUser.token,
    };
    return post('logout', headers)
      .then(async (res) => {
        if (res.status === 200) {
          await RemoveUserInfo();
          navigation.navigate('Login');
        }
      })
      .catch((err) => alert(`err${err}`));
  };
  return (
    <View style={CommonStyles.container}>
      {loading ? (
        <Loader1 />
      ) : (
        <View
          style={[
            CommonStyles.container,
            { width: '100%', justifyContent: 'flex-start', marginTop: '20%' },
          ]}
        >
          <Image
            style={CommonStyles.largeImage}
            source={{ uri: `${base64Image}` }}
          />

          <Text style={CommonStyles.textBold}>
            {first_name} {last_name}
          </Text>
          <Text style={CommonStyles.textBold}>{email}</Text>
          <Text style={CommonStyles.textBold}>Friends : {friends_count}</Text>
        </View>
      )}
    </View>
  );
};
export default FriendProfile;
