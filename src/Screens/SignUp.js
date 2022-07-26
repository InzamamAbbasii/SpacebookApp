import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import CommonStyles from './Styles/Common/CommonStyle';
import { post } from './API';

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    // Validation here...
    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0
    ) {
      alert('All fileds are required.Please Enter data.');
    } else if (password !== confirmPassword) {
      alert('Password and confirm password not match');
    } else {
      const headers = {
        'Content-Type': 'application/json',
      };
      const Data = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      };
      return post('user', headers, Data) // post method written in ./Api/index.js
        .then((response) => {
          if (typeof response !== 'undefined') {
            if (response.status === 201) return response.json();
            if (response.status === 400) throw 'Failed validation';
            else throw 'Something went wrong';
          }
        })
        .then((JsonResponse) => {
          if (typeof JsonResponse != 'undefined') navigation.navigate('Login');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={CommonStyles.scrollView}>
        <View style={CommonStyles.header}>
          <Text style={{ fontSize: 32, color: '#ffffff', fontWeight: 'bold' }}>
            Sign Up !
          </Text>
        </View>
        <View style={CommonStyles.textInputView}>
          <Ionicons name="person" size={30} color="#1b74e4" />
          <TextInput
            style={CommonStyles.textInput}
            placeholder="Enter FirstName"
            placeholderTextColor="#3228"
            onChangeText={(name) => setFirstName(name)}
          />
        </View>
        <View style={CommonStyles.textInputView}>
          <MaterialIcons name="person" size={30} color="#1b74e4" />
          <TextInput
            style={CommonStyles.textInput}
            placeholder="Enter LastName"
            placeholderTextColor="#3228"
            onChangeText={(txt) => setLastName(txt)}
          />
        </View>

        <View style={CommonStyles.textInputView}>
          <MaterialIcons name="email" size={30} color="#1b74e4" />
          <TextInput
            style={CommonStyles.textInput}
            placeholder="Enter Email"
            keyboardType="email-address"
            placeholderTextColor="#3228"
            onChangeText={(txt) => setEmail(txt)}
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
        <View style={CommonStyles.textInputView}>
          <Ionicons name="lock-closed" size={30} color="#1b74e4" />
          <TextInput
            style={CommonStyles.textInput}
            placeholder="ConfirmPassword"
            placeholderTextColor="#3228"
            secureTextEntry
            onChangeText={(confirmPassword) =>
              setConfirmPassword(confirmPassword)
            }
          />
        </View>

        <TouchableOpacity
          style={[
            CommonStyles.btnTouchable,
            { width: '95%', borderRadius: 30 },
          ]}
          onPress={() => handleSignup()}
        >
          <Text style={CommonStyles.btnText}>SignUp</Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            margin: 7,
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
            Already have an account?{' '}
          </Text>
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', color: '#1b74e4' }}
            onPress={() => navigation.navigate('Login')}
          >
            Login{' '}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
