import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { get, patch } from './API';
import GetUserInfo from '../utils/async-storage';
import CommonStyles from './Styles/Common/CommonStyle';
import Loader2 from '../Components/Loader2';

const EditPost = ({ navigation, route }) => {
  const [user_id, setUser_id] = useState(route.params.user_id);
  const [token, setToken] = useState(route.params.token);
  const [post_id, setPost_id] = useState(route.params.post_id);
  const [profile, setProfile] = useState(route.params.profile);

  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [postText, setPostText] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    setLoading(true);
    await getSinglePost();
    setLoading(false);
  }, []);

  const getSinglePost = async () => {
    await get(`user/${user_id}/post/${post_id}`, token)
      .then((response) => {
        if (typeof response !== 'undefined') {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) throw 'Unauthorized';
          else throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        setFirst_name(responseJson.author.first_name);
        setLast_name(responseJson.author.last_name);
        setEmail(responseJson.author.email);
        setPostText(responseJson.text);
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  const savePost = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': token,
    };
    const data = {
      text: postText,
    };
    return patch(
      `user/${route.params.user_id}/post/${route.params.post_id}`,
      headers,
      data
    )
      .then((response) => {
        if (response.status === 200) {
          if (Platform.OS == 'android') {
            navigation.navigate('BottomTab');
            ToastAndroid.show('Edited Successfully!', ToastAndroid.SHORT);
          } else {
            navigation.navigate('Home');
            alert('Post edited successfully!');
          }
        } else if (response.status === 403) {
          throw 'you can only update your own posts';
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: 'red' }}>
      {loading ? (
        <Loader2 />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}
          >
            <Image
              style={{
                height: 50,
                width: 50,
                borderRadius: 50,
                backgroundColor: 'red',
                marginRight: 10,
              }}
              source={{ uri: `${profile}` }}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {first_name} {last_name}
            </Text>
          </View>
          <TextInput
            style={{ flex: 1, padding: 10, fontSize: 20, marginTop: 10 }}
            placeholder={`What's on Your Mind, ${first_name}?`}
            placeholderTextColor="#828282"
            multiline
            textAlignVertical="top"
            value={postText}
            onChangeText={(txt) => setPostText(txt)}
          />

          <TouchableOpacity
            disabled={postText.length === 0}
            onPress={() => savePost()}
            style={{
              backgroundColor: postText.length === 0 ? '#CCCCCC' : '#1b74e4',
              marginVertical: 10,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
            }}
          >
            <Text
              style={{
                color: postText.length === 0 ? '#828282' : '#fff',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};
export default EditPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
});
