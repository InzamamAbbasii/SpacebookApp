import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ImagePropTypes } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        //Validation here...
        if (email.length == 0) {
            alert('Please Enter Your Email Address');
        } else if (password.length == 0) {
            alert('Please Enter Your Password');
        } else {
            var InsertApiURL = `http://${ip}:3333/api/1.0.0/login`;
            var headers = {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                email: email,
                password: password
            }
            fetch(InsertApiURL,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(Data)
                }
            )
                // .then((response) => response.json())
                .then((response) => {
                    console.log(response);
                    console.log(response.status);
                    if (response.status === 200) {
                        return response.json()
                    } else if (response.status === 400) {
                        throw 'Invalid email or password';
                    } else {
                        throw 'Something went wrong';
                    }
                }).then(async (responseJson) => {
                    // alert(responseJson.token);
                    await AsyncStorage.setItem('@session_token',JSON.stringify(responseJson));
                    navigation.navigate("BottomTab");
                }).catch((error) => {
                    alert(error);
                })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 32, color: '#ffffff', fontWeight: 'bold' }}>Login!</Text>
            </View>
            <View style={styles.form}>
                <View style={styles.textInput}>
                    <Icon name='person' size={30} color='#000' />
                    <TextInput
                        style={{ padding: 5, fontSize: 18, width: '85%', color: '#000' }}
                        placeholder="Enter Email"
                        placeholderTextColor="#3228"
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
                <View style={styles.textInput}>
                    <Icon name='lock' size={30} color='#000' />
                    <TextInput
                        style={{ padding: 5, fontSize: 18, width: '85%', color: '#000' }}
                        placeholder="Password"
                        placeholderTextColor="#3228"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>

                {/* <View style={styles.textInput}> */}
                <TouchableOpacity
                    style={styles.btnLogin}
                    onPress={() => handleLogin()}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Login</Text>
                </TouchableOpacity>
                {/* </View> */}

                <Text style={{ fontSize: 20, margin: 14, alignSelf: 'center', fontWeight: 'bold', color: '#000' }}> OR </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, color: 'black' }} >  Don't have an account? </Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }} onPress={() => navigation.navigate("SignUp")}>SignUp </Text>
                </View>
            </View>

        </View>
    );
}
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderBottomRightRadius: 130,
        marginBottom: 40,
    },
    textInput: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#000',
        borderRadius: 40,
        padding: 5,
        paddingLeft: 15,
        shadowColor: 'blue',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    btnSignUp: {
        width: "100%",
        borderRadius: 10,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        borderWidth: 1
    },
    btnLogin: {
        width: "95%",
        borderRadius: 30,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#000',
    },
})
