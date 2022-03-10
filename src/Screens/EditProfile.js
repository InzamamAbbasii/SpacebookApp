import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, Text, View, TextInput, TouchableOpacity, Button, Image } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EditProfile = ({ navigation, route }) => {

    let { first_name, last_name, email, friend_count, Profile } = route.params;

    const [base64Image, setBase64Image] = useState(Profile);
    const [firstName, setFirstName] = useState(first_name);
    const [lastName, setLastName] = useState(last_name);
    const [Email, setEmail] = useState(email);



    // This function is triggered when the "Select an image" button pressed
    const showImagePicker = async () => {
        // Ask the user for the permission to access the media library 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your photos!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync();
        // Explore the result
        // console.log(result);
        if (!result.cancelled) {
            setBase64Image(result.uri);
            console.log(result.uri);
        }
    }

    // This function is triggered when the "Open camera" button pressed
    const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        // Explore the result
        console.log(result);

        if (!result.cancelled) {
            setBase64Image(result.uri);
            console.log(result.uri);
        }
    }

  

    const save = async () => {
        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);
        await updateUserInfo(parse.id, parse.token);
        await updateUserProfile(parse.id,parse.token);
    }
    const updateUserInfo = async (id, token) => {
        console.log('update profile', firstName, lastName, Email, id, token);
        var URL = `http://localhost:3333/api/1.0.0/user/${id}`;
        var headers = {
            'X-Authorization': token,
            'Content-Type': 'application/json'
        };
        var Data = {
            first_name: firstName,
            last_name: lastName,
            email: Email,
        }
        fetch(URL, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(Data)
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                alert('Updated Successfully!')
            } else {
                throw 'Something went wrong';
            }
        }).catch((error) => {
            alert(error);
        })
    }

    const updateUserProfile = async (id, token) => {
        console.log('update profile',base64Image);
        let res = await fetch(base64Image);
        let blob = await res.blob();
        console.log('blob....',blob);
      
        var URL = `http://localhost:3333/api/1.0.0/user/${id}/photo`;
        var headers = {
            'X-Authorization': token,
            'Content-Type': 'image/jpeg'
        };
        // var Data = {
        //     first_name: firstName,
        //     last_name: lastName,
        //     email: Email,
        // }
        fetch(URL, {
            method: 'POST',
            headers: headers,
            // body: JSON.stringify(base64Image)
            body: blob
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                alert('Updated Successfully!')
            } else {
                throw 'Something went wrong';
            }
        }).catch((error) => {
            alert(error);
        })
    }

    return (
        <ScrollView  >
            <View style={styles.container}>

                <TouchableOpacity 
                // onPress={() => setIsCameraOpen(true)}
                    style={{
                        backgroundColor: 'green',
                        height: 200,
                        width: 200,
                        borderRadius: 200,
                        alignSelf: 'center',
                        marginTop: 30,
                    }}
                >
                    <Image
                        style={{
                            flex: 1,
                            borderRadius: 200,
                            backgroundColor: 'blue',
                            resizeMode: 'cover',
                        }}
                        source={{ uri: `${base64Image}` }}

                    />
                </TouchableOpacity>

                <View style={{
                    width: 400,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>
                    <Button onPress={showImagePicker} title="Select an image" />
                    <Button onPress={openCamera} title="Open camera" />
                </View>



                <TextInput
                    style={styles.textInput}
                    value={firstName}
                    onChangeText={(txt) => setFirstName(txt)}
                />
                <TextInput
                    style={styles.textInput}
                    value={lastName}
                    onChangeText={(txt) => setLastName(txt)}
                />
                <TextInput
                    style={styles.textInput}
                    value={Email}
                    onChangeText={(txt) => setEmail(txt)}
                />


                <TouchableOpacity onPress={() => save()}
                    style={{ backgroundColor: 'blue', marginVertical: 20, borderRadius: 5, width: 200, height: 50, alignSelf: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: '500', color: '#fff', textAlign: 'center' }}>Save</Text>
                </TouchableOpacity>





            </View>
        </ScrollView>
    );
}
export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end'
    },
    button: {
        // flex: 0.1,
        backgroundColor: 'red',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    textInput: {
        padding: 5, marginVertical: 10, fontSize: 18, width: '90%', height: 50, color: '#000', borderWidth: 2, borderColor: '#000'
    }
});
