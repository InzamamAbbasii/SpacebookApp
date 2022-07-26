import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import GetUserInfo from '../utils/async-storage';
import CommonStyles from './Styles/Common/CommonStyle';
import { get, post, getAllFriends, getProfilePhoto1 } from './API';
import Loader1 from '../Components/Loader1';
import NoRecordFound from '../Components/NoRecordFound';

const AddFriend = ({ navigation }) => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notFound, setNotFound] = useState(false); // TODO: this will used to check record is found or not if found we will set true on it.
  useEffect(async () => {
    let isMounted = true; // note mutable flag
    const unsubscribe = navigation.addListener('focus', async () => {
      // The screen is focused
      setLoading(true);
      await getData();
      setLoading(false);
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => {
      unsubscribe, (isMounted = false);
    };
  }, [navigation]);

  // TODO: getting list of all users and store it into dataList.
  const getData = async () => {
    const loggedInUser = await GetUserInfo();
    setRefreshing(true);
    setDataList('');
    return get('search', loggedInUser.token)
      .then((response) => {
        if (response.status === 200) return response.json();
        if (response.status === 401) navigation.navigate('Login');
        else throw 'Something went wrong';
      })
      .then(async (responseJson) => {
        setDataList([]);

        if (typeof responseJson !== 'undefined') {
          if (responseJson.length === 0) {
            setNotFound(true);
          } else {
            // TODO: remove logged in user data from list .Because it will not add himself as a friend.
            let newData = responseJson.filter((item) => {
              return item.user_id != loggedInUser.id;
            });
            if (newData.length == 0) setNotFound(true);
            await newData.forEach(async (element) => {
              const listoffriends = await getAllFriends(loggedInUser.token); // TODO: this will return list of all friends of loggedin user.
              const picture = await getProfilePhoto1(
                // TODO: this method will return profile picture of user.
                element.user_id,
                loggedInUser.token
              );
              let isFriend = listoffriends.some(
                (item) => item.user_id === element.user_id
              ); //TODO: we check every record in friends list if it will find we store true it means user is already friend of loggedin user else
              // we store false
              if (isFriend == false) {
                setDataList((data) => [
                  ...data,
                  {
                    user_id: element.user_id,
                    user_givenname: element.user_givenname,
                    user_familyname: element.user_familyname,
                    user_email: element.user_email,
                    profile: picture,
                    isFriend: listoffriends.some(
                      (item) => item.user_id === element.user_id
                    ), //TODO: we check every record in friends list if it will find we store true it means user is already friend of loggedin user else
                    // we store false
                  },
                ]);
              }
            });
          }
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => setRefreshing(false));
  };

  // TODO: this will add user as friend of loggdin user
  const addFriend = async (friendId) => {
    const loggedInUser = await GetUserInfo();
    const headers = {
      'X-Authorization': loggedInUser.token,
      'Content-Type': 'application/json',
    };
    return post(`user/${friendId}/friends`, headers)
      .then((response) => {
        if (response.status === 201) {
          const newData = dataList.map((item) => {
            if (item.user_id === friendId) {
              return {
                ...item,
                isFriend: !item.isFriend,
              };
            }
            return {
              ...item,
            };
          });
          setDataList(newData);
          alert('Sent Successfully!');
        } else if (response.status === 401) throw 'Unauthorised';
        else if (response.status === 403)
          throw 'User is already added as a friend';
        else throw 'Something went wrong';
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={CommonStyles.container}>
      {loading ? (
        <Loader1 />
      ) : (
        <FlatList
          style={{ width: '98%' }}
          data={dataList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              colors={['red', 'pink', 'green']}
              onRefresh={() => getData()}
            />
          }
          ListHeaderComponent={notFound && <NoRecordFound />}
          renderItem={({ item }) => (
            <View style={[CommonStyles.rowViewFlexStart, { padding: 10 }]}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('FriendProfile', {
                    user_id: item.user_id,
                  })
                }
              >
                <Image
                  style={CommonStyles.normalImage}
                  source={{ uri: `${item.profile}` }}
                />
              </TouchableOpacity>
              <Text style={CommonStyles.txtAuthorName}>
                {item.user_givenname} {item.user_familyname}
              </Text>
              {item.isFriend ? (
                <FontAwesome5 name="user-check" size={27} color="#1b74e4" />
              ) : (
                <Feather
                  name="user-plus"
                  size={30}
                  color="black"
                  onPress={() => addFriend(item.user_id)}
                />
              )}
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={CommonStyles.itemSepratorView} />
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
      )}
    </View>
  );
};
export default AddFriend;
