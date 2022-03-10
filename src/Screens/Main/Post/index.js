/*import React from 'react';
import { View,Text } from 'react-native';
import { Common } from '../../Styles'

const PostScreen=()=>{
    return(
        <View style={Common.container}>
            <Text>PostScreen</Text>
        </View>
    );
};

export default PostScreen; */
import { Common } from '../../Styles'
import React, { Component } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    TouchableRipple,
  } from 'react-native-paper';


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
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>John Doe</Title>
            <Caption style={styles.caption}>@j_doe </Caption>
          </View>
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
});