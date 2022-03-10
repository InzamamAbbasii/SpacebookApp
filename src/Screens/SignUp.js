import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
//SignUp Screen Code-------
const SignUp = ({ navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignup = async () => {
        //Validation here...
        if (firstName.length == 0 || lastName.length == 0 || email.length == 0 || password.length == 0 || confirmPassword.length == 0) {
            alert('All fileds are required.Please Enter data.')
        } else if (password !== confirmPassword) {
            alert('Password and confirm password not match')
        } else {
            var InsertApiURL = `http://localhost:3333/api/1.0.0/user`;
            var headers = {
  
                'Content-Type': 'application/json'
            };
            var Data = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
            }
            fetch(InsertApiURL,{
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(Data)
                }).then((response) => {
                    console.log(response);
                    if (response.status === 201) {
                        return response.json()
                    } else if (response.status === 400) {
                        throw 'Failed validation';
                    } else {
                        throw 'Something went wrong';
                    }
                })
                .then((responseJson) => {
                    console.log("User created with ID: ", responseJson);
                    navigation.navigate("Login");
                })
                .catch((error) => {
                    alert(error);
                })
        }

    }



    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 32, color: '#ffffff', fontWeight: 'bold' }}>Sign Up !</Text>
            </View>

            <View style={styles.textInput}>
                <Icon name='person' size={30} color='#000' />
                <TextInput
                    style={{ padding: 5, fontSize: 18, width: '85%', color: '#000' }}
                    placeholder="Enter FirstName"
                    placeholderTextColor="#3228"
                    onChangeText={(name) => setFirstName(name)}
                />
            </View>
            <View style={styles.textInput}>
                <Icon name='email' size={30} color='#000' />
                <TextInput
                    style={{ padding: 5, fontSize: 18, width: '85%', color: '#000' }}
                    placeholder="Enter LastName"
                    placeholderTextColor="#3228"
                    onChangeText={(txt) => setLastName(txt)}
                />
            </View>

            <View style={styles.textInput}>
                <Icon name='email' size={30} color='#000' />
                <TextInput
                    style={{ padding: 5, fontSize: 18, width: '85%', color: '#000' }}
                    placeholder="Enter Email"
                    placeholderTextColor="#3228"
                    onChangeText={(txt) => setEmail(txt)}
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
            <View style={styles.textInput}>
                <Icon name='lock' size={30} color='#000' />
                <TextInput
                    style={{ padding: 5, fontSize: 18, width: '85%' }}
                    placeholder="ConfirmPassword"
                    placeholderTextColor="#3228"
                    secureTextEntry={true}
                    onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                />
            </View>

            <TouchableOpacity style={styles.btnSignUp} onPress={() => handleSignup()}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>SignUp</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 20, margin: 7, alignSelf: 'center', fontWeight: 'bold', color: '#000' }}> OR </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 17, color: 'black' }} >  Already have an account? </Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }} onPress={() => navigation.navigate("Login")}>Login </Text>
            </View>
        </ScrollView>
    );
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderBottomRightRadius: 130,
        marginBottom: 40,
    },
    textInput: {
        margin: 7,
        // marginBottom:5,
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
            height: 2,
        },
        shadowOpacity: 0.30,
        shadowRadius: 40,
        elevation: 6,
    },
    btnSignUp: {
        width: "95%",
        borderRadius: 30,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#000',
    },
    btnLogin: {
        width: "100%",
        borderRadius: 10,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        borderWidth: 1
    },
})