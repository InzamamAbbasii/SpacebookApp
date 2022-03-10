import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar } from 'react-native-elements';

const Friends = ({ navigation }) => {
    const [dataList, setDataList] = useState([]);

    useEffect(async () => {
        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);
        getAllFriends(parse.id, parse.token)
    }, [])

    const getAllFriends = async (id, token) => {

        return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
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
                    alert('No record found')
                } else {
                    // console.log(responseJson);
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
                    // setDataList(responseJson);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }


    return (
        <View style={styles.container}>

            <FlatList
                data={dataList}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: 'skyblue', margin: 5, elevation: 10, padding: 10, borderRadius: 10 }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                style={{ height: 80, width: 80,borderRadius:80,backgroundColor:'red',marginHorizontal:10 }}
                                source={{ uri: `${item.Profile}` }}
                            />
                            <View>
                                <Text style={{ fontSize: 24, fontWeight: '600' }}>{item.user_givenname} {item.user_familyname}</Text>
                                <Text style={{ fontSize: 24, fontWeight: '600' }}> {item.user_email} </Text>
                            </View>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => item.user_id.toString()}
            // ListHeaderComponent={renderHeader}
            />
        </View>
    );
}
export default Friends;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

});
