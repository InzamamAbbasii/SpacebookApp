import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SetUserInfo } from '../utils/async-storage';
import CommonStyles from './Styles/Common/CommonStyle';
import { post } from './API';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validation here...
    if (email.length === 0) {
      alert('Please Enter Your Email Address');
    } else if (password.length === 0) {
      alert('Please Enter Your Password');
    } else {
      const headers = {
        'Content-Type': 'application/json',
      };
      const Data = {
        email,
        password,
      };
      return post('login', headers, Data) // post method written in ./Api/index.js
        .then((response) => {
          if (typeof response !== 'undefined') {
            if (response.status === 200) {
              return response.json();
            }
            if (response.status === 400) {
              throw 'Invalid email or password';
            } else {
              throw 'Something went wrong';
            }
          }
        })
        .then(async (responseJson) => {
          if (typeof responseJson !== 'undefined') {
            await SetUserInfo(responseJson);
            navigation.navigate('DrawerNavigation');
          }
        })
        .catch((error) => {
          alert('error' + error);
        });
    }
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={CommonStyles.scrollView}>
        <View style={CommonStyles.header}>
          <Text style={{ fontSize: 32, color: '#ffffff', fontWeight: 'bold' }}>
            Login!
          </Text>
        </View>

        <View style={CommonStyles.textInputView}>
          <Ionicons name="person" size={30} color="#1b74e4" />
          <TextInput
            style={CommonStyles.textInput}
            placeholder="Enter Email"
            placeholderTextColor="#3228"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={CommonStyles.textInputView}>
          <Ionicons name="lock-closed" size={30} color="#1b74e4" />
          <TextInput
            style={CommonStyles.textInput}
            placeholder="Password"
            placeholderTextColor="#3228"
            secureTextEntry
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity
          style={[
            CommonStyles.btnTouchable,
            { width: '95%', borderRadius: 30 },
          ]}
          onPress={() => handleLogin()}
        >
          <Text style={CommonStyles.btnText}>Login</Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            margin: 14,
            alignSelf: 'center',
            fontWeight: 'bold',
            color: '#1b74e4',
          }}
        >
          {' '}
          OR{' '}
        </Text>
        <View style={CommonStyles.rowView}>
          <Text style={{ fontSize: 17, color: 'black' }}>
            {' '}
            Don't have an account?{' '}
          </Text>
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', color: '#1b74e4' }}
            onPress={() => navigation.navigate('SignUp')}
          >
            SignUp{' '}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;
