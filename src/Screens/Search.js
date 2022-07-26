import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import CommonStyles from './Styles/Common/CommonStyle';
import GetUserInfo from '../utils/async-storage';
import { get, post, getProfilePhoto1, getAllFriends } from './API';
import Loader2 from '../Components/Loader2';
import NoRecordFound from '../Components/NoRecordFound';
const Search = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{ width: Dimensions.get('window').width - 65, height: 40 }}
        >
          <TextInput
            style={{
              flex: 1,
              fontSize: 20,
              color: '#000',
              backgroundColor: '#e9ebee',
              borderRadius: 20,
              paddingLeft: 10,
            }}
            placeholder="Search"
            autoFocus
            // value={searchText.toString()}
            onChangeText={(txt) => {
              setSearchText(txt);
            }}
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => searchText !== '' && search(), 1000); // 1000-->call search method after 1 sec
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const search = async () => {
    setIsNotFound(false);
    if (searchText.trim().length !== 0) {
      setLoading(true);
      const loggedInUser = await GetUserInfo();
      return get(`search?q=${searchText.trim()}&limit=5`, loggedInUser.token)
        .then((response) => {
          if (response.status === 200) return response.json();
          if (response.status === 401) throw 'Unauthorize';
          else throw 'Something went wrong';
        })
        .then(async (jsonResponse) => {
          if (jsonResponse.length === 0) {
            setIsNotFound(true);
          } else {
            setDataList([]);
            const listoffriends = await getAllFriends(loggedInUser.token);
            jsonResponse.forEach(async (element) => {
              const profile = await getProfilePhoto1(
                element.user_id,
                loggedInUser.token
              );
              setDataList((data) => [
                ...data,
                {
                  user_id: element.user_id,
                  user_givenname: element.user_givenname,
                  user_familyname: element.user_familyname,
                  user_email: element.user_email,
                  profile,
                  isFriend: listoffriends.some(
                    (item) => item.user_id === element.user_id
                  ), // store true if find else false
                },
              ]);
            });
          }
        })
        .catch((error) => alert(error))
        .finally(() => setLoading(false));
    }
  };

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
          alert('Added Successfully!');
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
    <View
      style={[
        CommonStyles.container,
        { justifyContent: 'flex-start', backgroundColor: '#fff' },
      ]}
    >
      {loading ? (
        <Loader2 />
      ) : isNotFound ? (
        <NoRecordFound />
      ) : (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          data={dataList}
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

export default Search;
