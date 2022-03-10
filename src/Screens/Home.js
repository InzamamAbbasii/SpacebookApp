import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { patchWebProps } from 'react-native-elements/dist/helpers';
import { Paragraph } from 'react-native-paper';

const Home = ({ navigation }) => {
    const [dataList, setDataList] = useState([]);
    const [postList, setPostList] = useState([]);
    const [base64Image, setBase64Image] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState('');
    const [user_id, setUser_id] = useState('');
    const [token, setToken] = useState('');
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [friend_count, setFriend_count] = useState(0);

    useEffect(async () => {
        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);
        console.log(parse.token);
        setLoggedInUserId(parse.id);
        // getAllFriends(parse.id, parse.token);
        // getAllPosts(parse.id, parse.token);
        getProfilePhoto(parse.id, parse.token)
        // loggedInUserInfo(parse.id, parse.token);
    }, [])

    const getData = async (token) => {

        return fetch("http://${ip}:3333/api/1.0.0/search", {
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
                setDataList(responseJson);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getAllFriends = async (id, token) => {

        return fetch(`http://${ip}:3333/api/1.0.0/user/${id}/friends`, {
            'headers': {
                'X-Authorization': token
            }
        }).then((response) => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 401) {
                navigation.navigate("Login");
            } else {
                throw 'Something went wrong';
            }
        }).then((responseJson) => {
            // console.log(responseJson);
            if (responseJson.length == 0) {
                alert('No record found')
            } else {
                getAllPosts(id, token);
                responseJson.forEach(element => {
                    console.log(element.user_id, token);
                    getAllPosts(element.user_id, token);
                });
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const getAllPosts = async (id, token) => {
        return fetch(`http://${ip}:3333/api/1.0.0/user/${id}/post`, {
            'headers': {
                'X-Authorization': token
            }
        }).then((response) => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 401) {
                navigation.navigate("Login");
            } else {
                throw 'Something went wrong';
            }
        }).then((responseJson) => {
            // setDataList(responseJson);
            responseJson.forEach(element => {
                // console.log(element.author.user_id);
                fetch(`http://${ip}:3333/api/1.0.0/user/${element.author.user_id}/photo`, {
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
                }).then((resBlob) => {
                    let profile = URL.createObjectURL(resBlob);
                    setPostList(data => [...data, {
                        post_id: element.post_id,
                        text: element.text,
                        timestamp: element.timestamp,
                        author: {
                            profile: profile,
                            user_id: element.author.user_id,
                            first_name: element.author.first_name,
                            last_name: element.author.last_name,
                            email: element.author.email,
                        },
                        numLikes: element.numLikes,
                        like: false,
                    }])
                }).catch((err) => {
                    alert(err)
                });
            });

        }).catch((error) => {
            console.log(error);
        })
    }

    const renderHeader = () => {
        return <SearchBar placeholder='Search User here...' lightTheme round />;

    };

    const getProfilePhoto = async (id, token) => {
        console.log('ip',ip);
        fetch(`http://${ip}:3333/api/1.0.0/user/${id}/photo`, {
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
                console.log(resBlob,ip);
                // let data = URL.createObjectURL(resBlob);
                // console.log('nmn', data);
                // setBase64Image(data);
            })
            .catch((err) => {
                alert(err)
            });
    }
    const loggedInUserInfo = (id, token) => {
        fetch(`http://${ip}:3333/api/1.0.0/user/${id}`, {
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
                setUser_id(id); setToken(token);
                setFirst_name(JsonResponse.first_name);
                setLast_name(JsonResponse.last_name);
                setEmail(JsonResponse.email);
                setFriend_count(JsonResponse.friend_count);
            })
            .catch((err) => {
                alert(err)
            });
    }

    const saveLike = (user_id, token, post_id) => {
        console.log('Save Like', user_id, token, post_id);
        var url = `http://${ip}:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`;
        var headers = {
            'Content-Type': 'application/json',
            'X-Authorization': token
        };
        fetch(url, {
            method: 'POST',
            headers: headers,
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                alert('Like...')
            } else if (response.status === 401) {
                throw 'Unauthorized';
            } else if (response.status === 400) {
                throw 'You have already like this post';
            } else if (response.status === 403) {
                throw 'Can only like the posts of your friends';
            } else {
                throw 'Something went wrong';
            }
        }).catch((error) => {
            alert(error);
        })
    }

    const deleteLike = (user_id, token, post_id) => {
        console.log('Delete Like', user_id, token, post_id);
        var url = `http://${ip}:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`;
        var headers = {
            'Content-Type': 'application/json',
            'X-Authorization': token
        };
        fetch(url, {
            method: 'DELETE',
            headers: headers,
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                alert('DELETED...')
            } else if (response.status === 401) {
                throw 'Unauthorized';
            } else if (response.status === 403) {
                throw 'Can only like the posts of your friends';
            } else {
                throw 'Something went wrong';
            }
        }).catch((error) => {
            alert(error);
        })
    }
    const handleLike = async (post_authorId,selectedPostId) => {

        const user = await AsyncStorage.getItem('@session_token');
        let parse = JSON.parse(user);

        const newData = postList.map(item => {
            if (item.post_id == selectedPostId) {
                !item.like ? saveLike(post_authorId, parse.token, selectedPostId) : deleteLike(post_authorId, parse.token, selectedPostId)
                return {
                    ...item,
                    numLikes: !item.like ? item.numLikes + 1 : item.numLikes - 1,
                    like: !item.like,
                }
            }
            return {
                ...item,
                like: item.like
            }
        })
        setPostList(newData);
    }
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 10, borderRadius: 10, marginVertical: 10, alignItems: 'center' }}>
                <Image
                    style={{ height: 60, width: 60, borderRadius: 60, backgroundColor: 'red', marginRight: 10 }}
                    source={{ uri: `${base64Image}` }}
                />
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#fff', height: 40, flex: 1, borderRadius: 30, paddingLeft: 10, backgroundColor: '#ccc' }}
                    placeholder={'Whats on Your Mind?'}
                    onFocus={() => navigation.navigate('CreatePost', {
                        user_id: user_id,
                        token: token,
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        profile: base64Image,
                    })}
                />
            </View>

            <FlatList
                data={postList}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginVertical: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                            <Image
                                style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: 'red', marginRight: 10 }}
                                source={{ uri: `${item.author.profile}` }}
                            />
                            <Text style={{ fontWeight: '500', fontSize: 20, flex: 1 }}> {item.author.first_name} {item.author.last_name} </Text>
                            {
                                //edit only own posts
                                loggedInUserId == item.author.user_id && (
                                    <TouchableOpacity style={{ backgroundColor: '#1b74e4', padding: 5, borderRadius: 5, marginHorizontal: 10 }}
                                        onPress={() => navigation.navigate('EditPost', {
                                            post_id: item.post_id,
                                            text: item.text,
                                            user_id: item.author.user_id,
                                            token: token,
                                            first_name: item.author.first_name,
                                            last_name: item.author.last_name,
                                            email: item.author.email,
                                            profile: item.author.profile,
                                        })}>
                                        <Text style={{ fontWeight: '500', fontSize: 20, color: '#fff' }}> Edit </Text>
                                    </TouchableOpacity>
                                )
                            }

                        </View>

                        <Text style={{ fontSize: 22 }}> {item.text} </Text>

                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                            <AntDesign name="like1" size={24} color="blue" />
                            <Text style={{ marginHorizontal: 10, fontWeight: '600', fontSize: 20, color: '#65676b' }}>{item.numLikes}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: .2, borderBottomWidth: .2, padding: 10, marginVertical: 10 }}>
                            {
                                item.like ? (
                                    <AntDesign name="like1" size={24} color="blue" onPress={() => handleLike(item.author.user_id,item.post_id)} />
                                ) : (
                                    <AntDesign name="like2" size={24} color="black" onPress={() => handleLike(item.author.user_id,item.post_id)} />
                                )
                            }
                            <Text style={{ marginHorizontal: 10, fontWeight: '600', fontSize: 20, color: '#65676b' }}>Like </Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => item.post_id.toString()}
            />
            {/* <FlatList
                data={dataList}
                renderItem={({ item }) => (
                    <View style={{backgroundColor:'skyblue',marginVertical:5,padding:10}}>
                        <Text>{item.user_givenname} {item.user_familyname}</Text>
                        <Text> {item.user_email} </Text>
                       
                    </View>
                )}
                keyExtractor={(item, index) => item.user_id.toString()}
                ListHeaderComponent={renderHeader}
            /> */}
        </View>
    );
}
export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ced0d4',
        padding: 10,
    },

});
