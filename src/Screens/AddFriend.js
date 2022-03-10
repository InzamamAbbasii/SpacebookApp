import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar } from 'react-native-elements';

const AddFriend = ({ navigation }) => {
    const [dataList, setDataList] = useState([]);

    useEffect(async () => {
        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);
        getData(parse.token)
    }, [])

    const getData = async (token) => {

        return fetch("http://localhost:3333/api/1.0.0/search", {
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
                // console.log(responseJson);
                // setDataList(responseJson);
                responseJson.forEach(element => {
                    console.log(element);
                    fetch(`http://localhost:3333/api/1.0.0/user/${element.user_id}/photo`, {
                        method: 'GET',
                        headers: {
                            'X-Authorization': token,
                        }
                    }).then((res) => {
                        if (res.status === 200) {
                            return res.blob();
                        } else {
                            throw 'Something went wrong';
                        }
                    })
                        .then((resBlob) => {
                            let picture = URL.createObjectURL(resBlob);
                            console.log('nmn', picture);
                            setDataList(data => [...data, {
                                user_id: element.user_id,
                                user_givenname: element.user_givenname,
                                user_familyname: element.user_familyname,
                                user_email: element.user_email,
                                Profile: picture,
                            }])
                        })
                        .catch((err) => {
                            alert(err)
                        });

                });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const addFriend = async (friendId) => {
        console.log(friendId);
        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);

        var URL = `http://localhost:3333/api/1.0.0/user/${friendId}/friends`;
        var headers = {
            'X-Authorization': parse.token,
            'Content-Type': 'application/json'
        };
        fetch(URL, {
            method: 'POST',
            headers: headers,
            // body: JSON.stringify(Data)
        }).then((response) => {
            console.log(response);
            if (response.status === 201) {
                alert('Sent Successfully!')
            } else if (response.status === 401) {
                throw 'Unauthorised';
            } else if (response.status === 403) {
                throw 'User is already added as a friend';
            } else {
                throw 'Something went wrong';
            }
        }).catch((error) => {
            alert(error);
        })

    }
    const renderHeader = () => {
        return <SearchBar placeholder='Search User here...' lightTheme round />;

    };
    return (
        <View style={styles.container}>

            <FlatList
                data={dataList}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: 'skyblue', margin: 5, elevation: 10, padding: 10, borderRadius: 10 }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                style={{ height: 80, width: 80, borderRadius: 80, backgroundColor: 'red', marginHorizontal: 10 }}
                                source={{ uri: `${item.Profile}` }}
                            />
                            <View>
                                <Text style={{ fontSize: 24, fontWeight: '600' }}>{item.user_givenname} {item.user_familyname}</Text>
                                <Text style={{ fontSize: 24, fontWeight: '600' }}> {item.user_email} </Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => addFriend(item.user_id)}
                            style={{ backgroundColor: 'blue', marginVertical: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 50 }}>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Add Friend +</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item, index) => item.user_id.toString()}
            // ListHeaderComponent={renderHeader}
            />
        </View>
    );
}
export default AddFriend;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

});
