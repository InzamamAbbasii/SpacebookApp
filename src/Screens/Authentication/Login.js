import React, { Component } from 'react';
import { Button, TextInput, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Common, Auth } from '../Styles';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "qwerty1@gmail.com",
      password: "abc123"
    }
  }
  login = async () => {
    //Validation here...
    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 400) {
          throw 'Invalid email or password';
        } else {
          throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        alert(responseJson);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        this.props.navigation.navigate("BottomMain");
      })
      .catch((error) => {
        alert(error);
      })
  }
  render() {
    return (
      <View
        style={Common.container}
      >
        <Image
          source={require('../../asserts/Logo/spacelogo.png')}
          style={Auth.LoginStyle.logo}
        />
        <View style={Auth.LoginStyle.inputContainer}>
          <TextInput
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            style={Auth.LoginStyle.input}
          />
          <TextInput
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
            style={Auth.LoginStyle.input}
          />
        </View>
        <View style={Auth.LoginStyle.buttonContainer} >
          <View style={Auth.LoginStyle.button}>
            <Button
              title="Login"
              onPress={() => this.login()}

            />
          </View>
          <View style={Auth.LoginStyle.button}>
            <Button
              title="Don't have an account?"
              color="darkblue"
              onPress={() => this.props.navigation.navigate('Signup')}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default LoginScreen;