import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native';

import GetUserInfo from '../utils/async-storage';
import CommonStyles from './Styles/Common/CommonStyle';
import { get, post, remove, getProfilePhoto1 } from './API';
import Loader1 from '../Components/Loader1';
import NoRecordFound from '../Components/NoRecordFound';
import { AntDesign } from '@expo/vector-icons';

const FriendProfile = ({ navigation, route }) => {
  const [base64Image, setBase64Image] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [friends_count, setFriends_count] = useState(0);
  const [friendsPostsList, setFriendsPostsList] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(async () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //TODO: The screen is focused
      setLoading(true);
      const loggedInUser = await GetUserInfo();

      let id =
        typeof route.params.user_id === 'undefined'
          ? loggedInUser.id
          : route.params.user_id;
      await getUserInfo(id, loggedInUser.token);

      await getFriendsPosts(id, loggedInUser.token);

      // await getUserInfo(loggedInUser.id, loggedInUser.token);
      const profile = await getProfilePhoto1(
        id,
        // loggedInUser.id,
        loggedInUser.token
      );
      setBase64Image(profile);
      loggedInUser.id === id
        ? setIsLoggedInUser(true)
        : setIsLoggedInUser(false); //TODO: to haldle edit button
      setLoading(false);
    });
    return () => unsubscribe;
  }, [navigation]);

  const getUserInfo = async (id, token) => {
    setLoading(true);

    return get(`user/${id}`, token)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw 'Something went wrong';
      })
      .then((JsonResponse) => {
        setFirst_name(JsonResponse.first_name);
        setLast_name(JsonResponse.last_name);
        setEmail(JsonResponse.email);
        setFriends_count(JsonResponse.friend_count);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getFriendsPosts = async (id, token) => {
    await get(`user/${id}/post`, token)
      .then((response) => {
        if (typeof response !== 'undefined') {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) throw 'Unauthorizedd';
          else if (response.status === 403) {
            setIsFriend(false);
            throw 'Can only view the posts of yourself or your friends';
          } else throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        setFriendsPostsList([]);
        setIsFriend(true);
        if (responseJson.length === 0) {
          setNotFound(true);
        } else {
          responseJson.forEach((element) => {
            setFriendsPostsList((data) => [
              ...data,
              {
                post_id: element.post_id,
                text: element.text,
                timestamp: element.timestamp,
                author: {
                  user_id: element.author.user_id,
                  first_name: element.author.first_name,
                  last_name: element.author.last_name,
                  email: element.author.email,
                },
                numLikes: element.numLikes,
                like: false,
              },
            ]);
          });
        }
      })
      .catch((err) => {
        console.log('error...', err);
      })
      .finally(() => setLoading(false));
  };

  const saveLike = async (user_id, token, post_id) => {
    console.log('save like called....');

    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': token,
    };
    return post(`user/${user_id}/post/${post_id}/like`, headers)
      .then((response) => {
        if (typeof response !== 'undefined') {
          if (response.status === 200) {
            // TODO: update postsList when post is successfully liked.
            const newData = friendsPostsList.map((item) => {
              if (item.post_id === post_id) {
                return {
                  ...item,
                  numLikes: item.numLikes + 1,
                  like: true,
                  // like: !item.like,
                };
              }
              return {
                ...item,
                like: item.like,
              };
            });
            setFriendsPostsList(newData);
            console.log('Like...');
          } else if (response.status === 401) {
            throw 'Unauthorized';
          } else if (response.status === 400) {
            throw 'You have already like this post';
          } else if (response.status === 403) {
            throw 'Can only like the posts of your friends';
          } else {
            throw 'Something went wrong';
          }
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const deleteLike = async (user_id, token, post_id) => {
    console.log('delete like called....');
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': token,
    };
    return remove(`user/${user_id}/post/${post_id}/like`, headers)
      .then((response) => {
        if (typeof response != 'undefined') {
          if (response.status === 200) {
            const newData = friendsPostsList.map((item) => {
              if (item.post_id === post_id) {
                return {
                  ...item,
                  numLikes: item.numLikes - 1,
                  like: false,
                };
              }
              return {
                ...item,
                like: item.like,
              };
            });
            setFriendsPostsList(newData);
            console.log('DELETED...');
          } else if (response.status === 401) {
            throw 'Unauthorized';
          } else if (response.status === 403) {
            throw 'Can only like the posts of your friends';
          } else {
            throw 'Something went wrong';
          }
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleLike = async (post_authorId, selectedPostId) => {
    const loggedInUser = await GetUserInfo();
    const newData = friendsPostsList.map((item) => {
      if (item.post_id === selectedPostId) {
        console.log(item.like, !item.like);
        item.like === false
          ? saveLike(post_authorId, loggedInUser.token, selectedPostId)
          : deleteLike(post_authorId, loggedInUser.token, selectedPostId);
      }
    });
  };

  return (
    <View style={CommonStyles.container}>
      {loading ? (
        <Loader1 />
      ) : (
        <View
          style={[
            CommonStyles.container,
            { width: '100%', backgroundColor: '#ced0d4' },
          ]}
        >
          <FlatList
            style={{ width: '100%' }}
            data={friendsPostsList}
            ListHeaderComponent={
              <View style={{ backgroundColor: '#ced0d4' }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    paddingBottom: 20,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    style={CommonStyles.largeImage}
                    source={{ uri: `${base64Image}` }}
                  />

                  <Text style={CommonStyles.textBold}>
                    {first_name} {last_name}
                  </Text>
                  <Text style={CommonStyles.text}>{email}</Text>
                  <Text style={CommonStyles.text}>
                    Friends : {friends_count}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    padding: 10,
                    paddingLeft: 15,
                    marginTop: 5,
                  }}
                >
                  <Text style={[CommonStyles.textBold]}>POSTS : </Text>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <View style={CommonStyles.postCard}>
                <View style={CommonStyles.rowView}>
                  <Image
                    style={CommonStyles.smallImage}
                    source={{ uri: `${base64Image}` }}
                  />

                  <Text style={[CommonStyles.txtAuthorName, { fontSize: 18 }]}>
                    {item.author.first_name} {item.author.last_name}
                  </Text>
                </View>

                <Text style={CommonStyles.postText}>{item.text}</Text>

                <View style={CommonStyles.rowViewFlexStart}>
                  <AntDesign name="like1" size={24} color="blue" />
                  <Text style={CommonStyles.txtLikeCount}>{item.numLikes}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleLike(item.author.user_id, item.post_id)}
                  style={[
                    CommonStyles.rowView,
                    {
                      borderBottomColor: '#000',
                      borderTopColor: '#000',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      padding: 5,
                    },
                  ]}
                >
                  {item.like ? (
                    <AntDesign name="like1" size={24} color="blue" />
                  ) : (
                    <AntDesign name="like2" size={24} color="black" />
                  )}
                  <Text style={CommonStyles.txtLikeCount}> Like </Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              notFound == true ? (
                <NoRecordFound />
              ) : (
                isFriend == false && (
                  <View style={CommonStyles.postCard}>
                    <Text
                      style={[
                        CommonStyles.text,
                        { color: 'red', marginLeft: 10 },
                      ]}
                    >
                      You Can only view the posts of yourself or your friends
                    </Text>
                  </View>
                )
              )
            }
            keyExtractor={(item) => item.post_id.toString()}
          />
        </View>
      )}
    </View>
  );
};
export default FriendProfile;
