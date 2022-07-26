import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import Loader1 from '../Components/Loader1';
import NoRecordFound from '../Components/NoRecordFound';
import GetUserInfo from '../utils/async-storage';
import CommonStyles from './Styles/Common/CommonStyle';
import {
  getProfilePhoto1,
  get,
  post,
  remove,
  GetAllPosts,
  GetUserData,
} from './API';

const Home = ({ navigation }) => {
  const [postList, setPostList] = useState([]);
  const [base64Image, setBase64Image] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [user_id, setUser_id] = useState('');
  const [token, setToken] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notFound, setNotFound] = useState(false);
  useEffect(async () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      //TODO: The screen is focused
      setLoading(true);
      await getPosts();
      setLoading(false);
    });
    //TODO: Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe;
  }, [navigation]);

  const getPosts = async () => {
    setRefreshing(true);
    const loggedInUser = await GetUserInfo();
    setLoggedInUserId(loggedInUser.id);
    // //TODO: getting loggedin user profile picture
    await getProfilePhoto1(loggedInUser.id, loggedInUser.token)
      .then((res) => setBase64Image(res))
      .catch(() => console.log('Error in getting profile'));

    await getUserInfo(loggedInUser.id, loggedInUser.token);

    //TODO: getting list of all posts of loggedin user and also his friends post
    const allPosts = await GetAllPosts(
      loggedInUser.id,
      loggedInUser.token
    ).catch(() => navigation.navigate('Login'));
    setPostList([]);
    typeof allPosts !== 'undefined' && allPosts.length !== 0
      ? (setPostList(allPosts), setNotFound(false))
      : (setNotFound(true), setPostList([]));
    setRefreshing(false);
  };

  const getUserInfo = async (id, token) => {
    return get(`user/${id}`, token)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw 'Something went wrong';
      })
      .then((JsonResponse) => {
        setToken(token);
        setUser_id(JsonResponse.user_id);
        setFirst_name(JsonResponse.first_name);
        setLast_name(JsonResponse.last_name);
        setEmail(JsonResponse.email);
      })
      .catch((err) => {
        alert(err);
      });
  };

  // TODO: this method will add like in databse through api.
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
            const newData = postList.map((item) => {
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
            setPostList(newData);
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

  // TODO: this method will delete like from posts.
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
            // TODO: update postsList when post is scussfully deleted.
            const newData = postList.map((item) => {
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
            setPostList(newData);
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

  // TODO: when user press on like  button this method will called. It will check either user press like button first time or second time.
  //  if user pressed like button first time it will call saveLike method and if it will pressed like button second time it will call delete
  // button.
  const handleLike = async (post_authorId, selectedPostId) => {
    const loggedInUser = await GetUserInfo();
    const newData = postList.map((item) => {
      if (item.post_id === selectedPostId) {
        item.like === false
          ? saveLike(post_authorId, loggedInUser.token, selectedPostId)
          : deleteLike(post_authorId, loggedInUser.token, selectedPostId);
      }
    });
  };

  // TODO: this method will delete post from database where postId=? and userId=?
  const deletePost = async (userId, postId) => {
    console.log(userId, postId);
    const loggedInUser = await GetUserInfo();
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': loggedInUser.token,
    };
    return remove(`user/${userId}/post/${postId}`, headers)
      .then((response) => {
        if (typeof response !== 'undefined') {
          if (response.status === 200) {
            const newData = postList.filter((item) => {
              return item.post_id !== postId;
            });
            setPostList(newData);
            alert('Post deleted successfully');
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

  return (
    <View style={[CommonStyles.container, { backgroundColor: '#ced0d4' }]}>
      {loading ? (
        <Loader1 />
      ) : (
        <FlatList
          style={{ width: '100%' }}
          data={postList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              colors={['red', 'blue', 'green']}
              onRefresh={() => getPosts()}
            />
          }
          ListHeaderComponent={
            <View
              style={[CommonStyles.rowView, { padding: 10, marginBottom: 5 }]}
            >
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image
                  style={CommonStyles.normalImage}
                  source={{ uri: `${base64Image}` }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={CommonStyles.btnCreatePost}
                onPress={() => {
                  navigation.navigate('CreatePost', {
                    user_id,
                    token,
                    first_name,
                    last_name,
                    email,
                    profile: base64Image,
                  });
                }}
              >
                <Text>Whats on Your Mind,{first_name}?</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={CommonStyles.postCard}>
              <View style={CommonStyles.rowView}>
                <TouchableOpacity
                  onPress={() => {
                    loggedInUserId === item.author.user_id
                      ? navigation.navigate('Profile', {
                          user_id: item.author.user_id,
                        })
                      : navigation.navigate('FriendProfile', {
                          user_id: item.author.user_id,
                        });
                  }}
                >
                  <Image
                    style={CommonStyles.smallImage}
                    source={{ uri: `${item.author.profile}` }}
                  />
                </TouchableOpacity>

                <Text style={[CommonStyles.txtAuthorName, { fontSize: 18 }]}>
                  {item.author.first_name} {item.author.last_name}
                </Text>
                {
                  // edit only own posts
                  loggedInUserId === item.author.user_id && (
                    <View
                      style={[
                        CommonStyles.rowView,
                        {
                          width: 120,
                          justifyContent: 'space-around',
                        },
                      ]}
                    >
                      <AntDesign
                        name="edit"
                        size={24}
                        color="green"
                        onPress={() =>
                          navigation.navigate('EditPost', {
                            post_id: item.post_id,
                            user_id: item.author.user_id,
                            token,
                            profile: item.author.profile,
                          })
                        }
                      />

                      <TouchableOpacity
                        style={{ marginHorizontal: 10 }}
                        onPress={() =>
                          navigation.navigate('EditPost', {
                            post_id: item.post_id,
                            text: item.text,
                            user_id: item.author.user_id,
                            token,
                            first_name: item.author.first_name,
                            last_name: item.author.last_name,
                            email: item.author.email,
                            profile: item.author.profile,
                          })
                        }
                      >
                        <AntDesign
                          name="delete"
                          size={24}
                          color="red"
                          onPress={() =>
                            deletePost(item.author.user_id, item.post_id)
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )
                }
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
          ListFooterComponent={notFound == true ? <NoRecordFound /> : null}
          keyExtractor={(item) => item.post_id.toString()}
        />
      )}
    </View>
  );
};
export default Home;
