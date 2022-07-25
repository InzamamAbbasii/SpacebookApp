import React, { useState } from 'react';
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
import { patch } from './API';

const EditPost = ({ navigation, route }) => {
  const [postText, setPostText] = useState(route.params.text);

  const savePost = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': route.params.token,
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
            source={{ uri: `${route.params.profile}` }}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {' '}
            {route.params.first_name} {route.params.last_name}{' '}
          </Text>
        </View>
        <TextInput
          style={{ flex: 1, padding: 10, fontSize: 20, marginTop: 10 }}
          placeholder={`What's on Your Mind, ${route.params.first_name}?`}
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
            {' '}
            Save{' '}
          </Text>
        </TouchableOpacity>
      </View>
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
