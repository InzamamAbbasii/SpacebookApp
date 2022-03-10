import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar } from 'react-native-elements';

const FriendRequest = ({ navigation }) => {
    const [dataList, setDataList] = useState([]);

    useEffect(async () => {
        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);
        getFriendRequests(parse.token)
    }, [])

    const getFriendRequests = async (token) => {
        console.log(token);
        return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
            'headers': {
                'X-Authorization': token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 401) {
                    navigation.navigate("Login");
                } else {
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.length == 0) {
                    alert('No request found...')
                } else {
                    responseJson.forEach(element => {
                        console.log(element);
                        setDataList(data => [...data, {
                            user_id: element.user_id,
                            first_name: element.first_name,
                            last_name: element.last_name,
                            email: element.email
                        }])
                    });
                }
            })
            .catch((error) => {
                alert(error);
            })
    }

    const confirmRequest = async (friendId) => {
        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);
        console.log(parse.token);
        var URL = `http://localhost:3333/api/1.0.0/friendrequests/${friendId}`;
        var headers = {
            'X-Authorization': parse.token,
            'Content-Type': 'application/json'
        };
        fetch(URL, {
            method: 'POST',
            headers: headers,
            // body: JSON.stringify(Data)
        }).then((response) => {
            if (response.status === 200) {
                alert('Confirm')
            } else if (response.status === 401) {
                throw 'Unauthorized';
            } else {
                throw 'Something went wrong';
            }
        }).catch((error) => {
            alert(error);
        })
    }
    const deleteRequest = async (friendId) => {
        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);
        console.log(parse.token);
        var URL = `http://localhost:3333/api/1.0.0/friendrequests/${friendId}`;
        var headers = {
            'X-Authorization': parse.token,
            'Content-Type': 'application/json'
        };
        fetch(URL, {
            method: 'DELETE',
            headers: headers,
            // body: JSON.stringify(Data)
        }).then((response) => {
            if (response.status === 200) {
                alert('Deleted')
            } else if (response.status === 401) {
                throw 'Unauthorized';
            } else {
                throw 'Something went wrong';
            }
        }).catch((error) => {
            alert(error);
        })
    }

    return (
        <View style={styles.container}>

            <FlatList
                data={dataList}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={{ fontSize: 24, fontWeight: '600' }}>{item.first_name} {item.last_name}</Text>
                        <Text style={{ fontSize: 24, fontWeight: '600' }}> {item.email} </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => confirmRequest(item.user_id)} style={styles.btnTouchable}>
                                <Text style={styles.btnText}>Confirm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => deleteRequest(item.user_id)} style={styles.btnTouchable}>
                                <Text style={styles.btnText}> Delete </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => item.user_id.toString()}
            // ListHeaderComponent={renderHeader}
            />
        </View>
    );
}
export default FriendRequest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    card: {
        backgroundColor: '#1bb',
        margin: 5,
        elevation: 10,
        padding: 10,
        borderRadius: 10
    },
    btnTouchable: {
        flex: 1,
        height: 50,
        backgroundColor: 'blue',
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },
    btnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    }
});
