import React, { Component } from 'react';
//import React from "react";
import { View, Text,  Button, TextInput,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { Common } from '../Styles'
import { Common,Auth } from '../Styles';
import { CommonActions } from '@react-navigation/native';

/*const SignupScreen =()=>{
    return(
        <View style={Common.container} >
            <Text>SignUp</Text>
        </View>
    );
}
*/

const getData = async (done) => {

  try {

    const jsonValue = await AsyncStorage.getItem('@spacebook_details')

    const data = JSON.parse(jsonValue);

    return done(data);

  } catch(e) {

    console.error(e);

  }

}

class SignupScreen extends Component{

  constructor(props){

    super(props);

    this.state = {

      first_name: "",

      last_name: "",

      email: "",

      password: ""

    }

  }

  componentDidMount(){

    getData((data) => {

      this.setState({

        login_info: data,

        isLoading: false

      });

    });

  }

  signup = () => {

    //Validation here...

    return fetch("http://localhost:3333/api/1.0.0/user", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {

      if(response.status === 201){

        return response.json()

      }else if(response.status === 400){

        throw 'Failed validation';

      }else{

        throw 'Something went wrong';

      }

    })

    .then((responseJson) => {

        console.log("User created with ID: ", responseJson);

        this.props.navigation.navigate("Login");

    })

    .catch((error) => {

      console.log(error);

    })

  }

render(){

    return (


      /*<View >

        <TextInput  style={Auth.SignUpStyle.inputContainer}

          placeholder="Enter your first name..."

          onChangeText={(first_name) => this.setState({first_name})}

          value={this.state.first_name}

         // style={{padding:5, borderWidth:1, margin:5}}

        />

        <TextInput  style={Auth.SignUpStyle.input}

          placeholder="Enter your last name..."

          onChangeText={(last_name) => this.setState({last_name})}

          value={this.state.last_name}

         // style={{padding:5, borderWidth:1, margin:5}}

        />*/
        <View
        style={Common.container}
      >
         <Image
          source={require('../../asserts/Logo/createAccountLogo.png')}
          style={Auth.SignUpStyle.logo}
        />
        <View style={Auth.SignUpStyle.inputContainer}>
          <TextInput
           placeholder="Enter your first name..."
           onChangeText={(first_name) => this.setState({first_name})}
           value={this.state.first_name}
            style={Auth.SignUpStyle.input}
          />
          <TextInput
           placeholder="Enter your Last name..."
           onChangeText={(last_name) => this.setState({last_name})}

           value={this.state.last_name}
            style={Auth.SignUpStyle.input}
          />
       

        <TextInput  style={Auth.SignUpStyle.input}

          placeholder="Enter your email..."

          onChangeText={(email) => this.setState({email})}

          value={this.state.email}

          //style={{padding:5, borderWidth:1, margin:5}}

        />

        <TextInput  style={Auth.SignUpStyle.input}

          placeholder="Enter your password..."

          onChangeText={(password) => this.setState({password})}

          value={this.state.password}

          secureTextEntry

          //style={{padding:5, borderWidth:1, margin:5}}

        />
       
        <Button style={Auth.SignUpStyle.button}

          title="Create an account"

          onPress={() => this.signup()}

        />
     </View>
      </View>

    )

  }

}


export default SignupScreen;

