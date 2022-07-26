import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {
  Entypo,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  FontAwesome,
} from '@expo/vector-icons';
//import basic react native components
import { BottomSheet } from 'react-native-btr';

//import to show social icons
import { SocialIcon } from 'react-native-elements';

import { Avatar } from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';
import GetUserInfo from '../utils/async-storage';
import CommonStyles from './Styles/Common/CommonStyle';
import { patch, saveProfilePhoto, convertImageToBase64 } from './API';
import Loader3 from '../Components/Loader3';

const EditProfile = ({ route }) => {
  const { first_name, last_name, email, Profile } = route.params;
  const [visible, setVisible] = useState(false);

  const [base64Image, setBase64Image] = useState(Profile);
  const [firstName, setFirstName] = useState(first_name);
  const [lastName, setLastName] = useState(last_name);
  const [Email, setEmail] = useState(email);
  const [isSavingData, setIsSavingData] = useState(false); //TODO: true when save button click to start loading
  const save = async () => {
    const loggedInUser = await GetUserInfo();
    await updateUserInfo(loggedInUser.id, loggedInUser.token);
    await updateUserProfile(loggedInUser.id, loggedInUser.token);
  };

  const updateUserInfo = async (id, token) => {
    const headers = {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    };
    const Data = {
      first_name: firstName,
      last_name: lastName,
      email: Email,
    };
    return patch(`user/${id}`, headers, Data)
      .then((response) => {
        if (response.status === 200) {
          /* eslint-disable no-console */
          console.log('Updated Successfully!');
        } else throw 'Something went wrong';
      })
      .catch((error) => {
        alert(error);
      });
  };

  const updateUserProfile = async (id, token) => {
    if (base64Image === route.params.Profile) {
      alert('Updated');
      setIsSavingData(false);
    } else {
      const res = await fetch(base64Image);
      const blob = await res.blob();

      await saveProfilePhoto(id, token, blob)
        .catch((err) => alert(err))
        .finally(() => setIsSavingData(false));
    }
  };

  //TODO: This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      setBase64Image(result.uri);
    }
  };

  //TODO: This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setBase64Image(result.uri);
    }
  };
  const toggleBottomNavigationView = () => {
    //TODO:Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  const BottomSheetView = () => {
    return (
      <View style={CommonStyles.container}>
        <BottomSheet
          visible={visible}
          //setting the visibility state of the bottom shee
          onBackButtonPress={toggleBottomNavigationView}
          //Toggling the visibility state on the click of the back botton
          onBackdropPress={toggleBottomNavigationView}
          //Toggling the visibility state on the clicking out side of the sheet
        >
          {/*Bottom Sheet inner View*/}
          <View style={CommonStyles.bottomNavigationView}>
            <Text style={CommonStyles.textBold}>Profile</Text>

            <TouchableOpacity
              onPress={() => {
                openCamera(), setVisible(false);
              }}
              style={[CommonStyles.btnTouchable, { marginBottom: 5 }]}
            >
              <Text style={CommonStyles.btnText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                showImagePicker(), setVisible(false);
              }}
              style={CommonStyles.btnTouchable}
            >
              <Text style={CommonStyles.btnText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </View>
    );
  };
  return (
    <View style={CommonStyles.container}>
      <ScrollView style={CommonStyles.scrollView}>
        <BottomSheetView />
        <View>
          <Image
            style={CommonStyles.largeImage}
            source={{ uri: `${base64Image}` }}
          />
          <Entypo
            name="camera"
            size={24}
            color={'#000'}
            style={{
              position: 'absolute',
              top: '70%',
              left: '62%',
              backgroundColor: '#ced0d4',
              borderRadius: 20,
              padding: 7,
            }}
            onPress={() => toggleBottomNavigationView()}
          />
        </View>

        <View style={CommonStyles.textInputView}>
          <TextInput
            style={CommonStyles.textInput}
            value={firstName}
            onChangeText={(txt) => setFirstName(txt)}
          />
        </View>
        <View style={CommonStyles.textInputView}>
          <TextInput
            style={CommonStyles.textInput}
            value={lastName}
            onChangeText={(txt) => setLastName(txt)}
          />
        </View>
        <View style={CommonStyles.textInputView}>
          <TextInput
            style={CommonStyles.textInput}
            value={Email}
            onChangeText={(txt) => setEmail(txt)}
          />
        </View>
        <TouchableOpacity
          disabled={isSavingData}
          onPress={() => {
            save();
            setIsSavingData(true);
          }}
          style={[CommonStyles.btnTouchable, { width: '85%' }]}
        >
          {isSavingData ? (
            <Loader3 />
          ) : (
            <Text style={CommonStyles.btnText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
export default EditProfile;
