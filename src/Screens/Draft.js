import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import CommonStyles from './Styles/Common/CommonStyle';
import NoRecordFound from '../Components/NoRecordFound';
import Loader1 from '../Components/Loader1';
import GetUserInfo, {
  GetDraft,
  Remove_DraftItem,
} from '../utils/async-storage';
import { post } from './API';

const Draft = ({ navigation }) => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(async () => {
    // await ClearDraft();
    setLoading(true);
    await getDraftPosts();
    console.log('here...');
    setLoading(false);
  }, []);
  const getDraftPosts = async () => {
    setRefreshing(true);
    const posts = await GetDraft();
    console.log(posts);
    if (posts !== 'undefined' && posts != null) {
      JSON.parse(posts).length === 0 && setNotFound(true);
      setDataList(JSON.parse(posts));
    } else {
      setLoading(false);
      setNotFound(true);
    }
    setRefreshing(false);
  };
  const savePost = async (id, user_id, postText) => {
    const loggedInUser = await GetUserInfo();
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': loggedInUser.token,
    };
    const data = { text: postText };
    return post(`user/${user_id}/post`, headers, data)
      .then(async (response) => {
        if (response.status === 201) {
          await Remove_DraftItem(id);
          const newData = dataList.filter((item) => item.id !== id);
          setDataList(newData);
          alert('Post Created Successfully!');
        } else throw 'Something went wrong';
      })
      .catch((error) => {
        alert(error);
      });
  };

  const deleteDraft = async (id) => {
    await Remove_DraftItem(id)
      .then(() => {
        const newData = dataList.filter((item) => item.id !== id);
        setDataList(newData);
        alert('Deleted Successfully!');
      })
      .catch(() => alert('Something went wrong.'));
  };
  const editDraft = (item) => {
    navigation.navigate('EditDraft', {
      id: item.id,
      first_name: item.first_name,
      last_name: item.last_name,
      postText: item.postText,
    });
  };

  return (
    <View style={[CommonStyles.container, { backgroundColor: '#cccede' }]}>
      {loading == true ? (
        <Loader1 />
      ) : (
        <View style={{ flex: 1, width: '100%' }}>
          <FlatList
            data={dataList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                color={['red', '#000', 'green']}
                onRefresh={() => getDraftPosts()}
              />
            }
            ListHeaderComponent={notFound && <NoRecordFound />}
            renderItem={({ item }) => (
              <View style={CommonStyles.postCard}>
                <View style={CommonStyles.rowViewFlexStart}>
                  <Image
                    style={CommonStyles.smallImage}
                    // source={{ uri: `${item.author.profile}` }}
                  />
                  <Text style={[CommonStyles.txtAuthorName, { color: 'red' }]}>
                    Draft
                  </Text>
                  <Entypo
                    name="edit"
                    size={24}
                    color="green"
                    style={{ marginHorizontal: 5 }}
                    onPress={() => editDraft(item)}
                  />
                  <MaterialIcons
                    name="delete"
                    size={24}
                    color="red"
                    style={{ marginHorizontal: 25 }}
                    onPress={() => deleteDraft(item.id)}
                  />
                </View>
                <Text style={CommonStyles.postText}>{item.postText}</Text>
                <TouchableOpacity
                  onPress={() => savePost(item.id, item.user_id, item.postText)}
                  style={CommonStyles.btnTouchable}
                >
                  <Text style={CommonStyles.btnText}>Post Now</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
};
export default Draft;
