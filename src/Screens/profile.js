import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Base64ArrayBuffer } from 'base64-arraybuffer';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = ({ navigation }) => {
    const [base64Image, setBase64Image] = useState(null);
    
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [friend_count, setFriend_count] = useState(0);

    useEffect(async () => {
        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);

        getUserPhoto(parse.id,parse.token);
        getUserInfo(parse.id,parse.token);
    }, []);

    const getUserPhoto = async (id,token) => {
        fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
            method: 'GET',
            headers: {
                'X-Authorization': token,
            }
        })
            .then((res) => {

                if (res.status === 200) {
                    return res.blob();
                } else {
                    throw 'Something went wrong';
                }
            })
            .then((resBlob) => {
                let data = URL.createObjectURL(resBlob);
                console.log('nmn',data);
                setBase64Image(data);

                // this.setState({
                //     photo: data,
                //     isLoading: false
                // });
            })
            .catch((err) => {
                alert(err)
            });
    }
    const getUserInfo = async (id,token) => {

        fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
            method: 'GET',
            headers: {
                'X-Authorization': token,
            }
        })
            .then((res) => {

                if (res.status === 200) {
                    return res.json();
                } else {
                    throw 'Something went wrong';
                }
            })
            .then((JsonResponse) => {

                setFirst_name(JsonResponse.first_name);
                setLast_name(JsonResponse.last_name);
                setEmail(JsonResponse.email);
                setFriend_count(JsonResponse.friend_count);
            })
            .catch((err) => {
                alert(err)
            });
    }

    return (
        <View style={styles.container}>
            <View>

                <TouchableOpacity
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

                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center', marginTop: 30 }}>{first_name} {last_name}</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center', marginTop: 30 }}>{email}</Text>
               
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile',{
                    first_name:first_name,
                    last_name:last_name,
                    email:email,
                    Profile:base64Image,
                })}
                    style={{ backgroundColor: 'blue', marginVertical: 20, borderRadius: 5, width: 200, height: 50, alignSelf: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: '500', color: '#fff', textAlign: 'center' }}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default Profile;

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
});
