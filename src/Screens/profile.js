import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native';

import GetUserInfo, {
  RemoveUserInfo,
  RemoveAll_UserInfo,
} from '../utils/async-storage';
import CommonStyles from './Styles/Common/CommonStyle';
import {
  get,
  post,
  remove,
  getProfilePhoto1,
  Get_SingleUser_Posts,
} from './API';
import Loader1 from '../Components/Loader1';
import NoRecordFound from '../Components/NoRecordFound';
import { AntDesign } from '@expo/vector-icons';

const Profile = ({ navigation, route }) => {
  const [base64Image, setBase64Image] = useState(null);
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [friends_count, setFriends_count] = useState(0);
  const [postsList, setPostsList] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(async () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      //TODO: The screen is focused
      const loggedInUser = await GetUserInfo();

      await getUserInfo(loggedInUser.id, loggedInUser.token);
      const profile = await getProfilePhoto1(
        loggedInUser.id,
        loggedInUser.token
      );
      setBase64Image(profile);

      await getAllPost(loggedInUser.id, loggedInUser.token);
      setLoading(false);
    });
    return () => unsubscribe;
  }, [navigation]);

  const getAllPost = async (id, token) => {
    await Get_SingleUser_Posts(id, token)
      .then((res) => {
        if (typeof res !== 'undefined') {
          setPostsList([]);
          if (res.length === 0) setNotFound(true);
          else setPostsList(res);
        }
      })
      .catch((err) => console.log(err));
  };

  const getUserInfo = async (id, token) => {
    return get(`user/${id}`, token)
      .then((res) => {
        if (typeof res === 'undefined') {
          throw 'undefined';
        } else {
          if (res.status === 200) {
            return res.json();
          }
          throw 'Something went wrong';
        }
      })
      .then((JsonResponse) => {
        setFirst_name(JsonResponse.first_name);
        setLast_name(JsonResponse.last_name);
        setEmail(JsonResponse.email);
        setFriends_count(JsonResponse.friend_count);
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
        if (res.status === 200) {
          await RemoveUserInfo();
          console.log('logout');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
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
            { width: '100%', backgroundColor: '#ced0d4' },
          ]}
        >
          <FlatList
            style={{ width: '100%' }}
            data={postsList}
            ListHeaderComponent={
              <View style={{ backgroundColor: '#ced0d4' }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    paddingBottom: 20,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    style={CommonStyles.largeImage}
                    source={{ uri: `${base64Image}` }}
                  />

                  <Text style={CommonStyles.textBold}>
                    {first_name} {last_name}
                  </Text>
                  <Text style={CommonStyles.text}>{email}</Text>
                  <Text style={CommonStyles.text}>
                    Friends : {friends_count}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('EditProfile', {
                        first_name,
                        last_name,
                        email,
                        Profile: base64Image,
                      })
                    }
                    style={[CommonStyles.btnTouchable, { width: '80%' }]}
                  >
                    <Text style={CommonStyles.btnText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => logout()}
                    style={[
                      CommonStyles.btnTouchable,
                      { width: '80%', backgroundColor: '#f0f0f0' },
                    ]}
                  >
                    <Text style={[CommonStyles.btnText, { color: '#000' }]}>
                      Logout
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    padding: 10,
                    paddingLeft: 15,
                    marginTop: 5,
                  }}
                >
                  <Text style={[CommonStyles.textBold]}>POSTS : </Text>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <View style={CommonStyles.postCard}>
                <View style={CommonStyles.rowView}>
                  <Image
                    style={CommonStyles.smallImage}
                    source={{ uri: `${base64Image}` }}
                  />

                  <Text style={[CommonStyles.txtAuthorName, { fontSize: 18 }]}>
                    {item.author.first_name} {item.author.last_name}
                  </Text>
                </View>

                <Text style={CommonStyles.postText}>{item.text}</Text>
              </View>
            )}
            ListFooterComponent={notFound == true ? <NoRecordFound /> : null}
            keyExtractor={(item) => item.post_id.toString()}
          />
        </View>
      )}
    </View>
  );
};
export default Profile;
