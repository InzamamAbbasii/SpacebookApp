import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
  }

  async componentDidMount(){
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

  sendToServer = async (data) => {
      // Get these from AsyncStorage
      let id = 17;
      let token = "b634f8af0adb3261340c394b44aa3ea7"

      let res = await fetch(data.base64);
      let blob = await res.blob();

      return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
          method: "POST",
          headers: {
              "Content-Type": "image/png",
              "X-Authorization": token
          },
          body: blob
      })
      .then((response) => {
          console.log("Picture added", response);
      })
      .catch((err) => {
          console.log(err);
      })
  }

    takePicture = async () => {
        if(this.camera){
            const options = {
                quality: 0.5, 
                base64: true,
                onPictureSaved: (data) => this.sendToServer(data)
            };
            await this.camera.takePictureAsync(options); 
        } 
    }

  render(){
    if(this.state.hasPermission){
      return(
        <View style={styles.container}>
          <Camera 
            style={styles.camera} 
            type={this.state.type}
            ref={ref => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}>
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }else{
      return(
        <Text>No access to camera</Text>
      );
    }
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    // flex: 0.1,
    backgroundColor:'red',
    width:'100%',
    height:50,
    justifyContent:'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
















/*import React from 'react';
import { View,Text } from 'react-native';
import { Common } from '../../Styles'

const ProfilesScreen=()=>{
    return(
        <View style={Common.container}>
            <Text>ProfilesScreen</Text>
        </View>
    );
};*/

//export default ProfilesScreen;
/*import { Common } from '../../Styles'
import React, { Component } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';


export default class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      photo: null,
      isLoading: true
    }
  }

  get_profile_image = () => {
    fetch("http://localhost:3333/api/1.0.0/user/17/photo", {
      method: 'GET',
      headers: {
        'X-Authorization': 'b634f8af0adb3261340c394b44aa3ea7'
      }
    })
    .then((res) => {
      return res.blob();
    })
    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      this.setState({
        photo: data,
        isLoading: false
      });
    })
    .catch((err) => {
      console.log("error", err)
    });
  }

  componentDidMount(){
    this.get_profile_image();
  }

  render(){
    if(!this.state.isLoading){
      return (
        <View style={styles.container}>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={{
              width: 400,
              height: 400,
              borderWidth: 5 
            }}
          />
        </View>
      );
    }else{
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }
    
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/