import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import CommonStyles from './Styles/Common/CommonStyle';
import { postSchedules_Posts } from './API';
import NoRecordFound from '../Components/NoRecordFound';
import Loader2 from '../Components/Loader2';
import {
  GetSchedule,
  SaveDraft,
  GetDraft,
  RemoveSchedule,
} from '../utils/async-storage';

const Schedule = () => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(async () => {
    // await ClearSchedule();
    setLoading(true);
    await getSchedulePosts();
    setLoading(false);
  }, []);
  const getSchedulePosts = async () => {
    setRefreshing(true);
    const posts = await GetSchedule();
    if (posts !== 'undefined' && posts != null) {
      JSON.parse(posts).length === 0 ? setNotFound(true) : setNotFound(false);
      setDataList(JSON.parse(posts));
    } else {
      setNotFound(true);
    }
    setRefreshing(false);
  };

  const deleteSchedule = async (id) => {
    await RemoveSchedule(id)
      .then(() => {
        const newData = dataList.filter((item) => item.id !== id);
        setDataList(newData);
        alert('Deleted Successfully!');
      })
      .catch(() => alert('Something went wrong.'));
  };

  const cancelSend = async (item) => {
    await RemoveSchedule(item.id)
      .then(async () => {
        // remove from schedule list and store it into draft
        await saveDraft(item);
        const newData = dataList.filter((newItem) => newItem.id !== item.id);
        setDataList(newData);
        alert('Post remove from schedule and moved to draft.');
      })
      .catch(() => alert('Something went wrong.'));
  };
  const saveDraft = async (item) => {
    const draftList = await GetDraft();
    const parse = JSON.parse(draftList);
    let postid = 1;

    if (parse !== null && parse.length !== 0) {
      const lastitem = parse.pop();
      postid = ++lastitem.id;
    }
    const obj = {
      id: postid,
      user_id: item.user_id,
      first_name: item.first_name,
      last_name: item.last_name,
      postText: item.postText,
    };
    await SaveDraft(obj);
  };

  return (
    <View style={[CommonStyles.container, { backgroundColor: '#dcccdc' }]}>
      {loading ? (
        <Loader2 />
      ) : (
        <View style={{ flex: 1, width: '100%' }}>
          <FlatList
            data={dataList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                colors={['green', 'red', '#000']}
                onRefresh={() => getSchedulePosts()}
              />
            }
            ListHeaderComponent={notFound && <NoRecordFound />}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 10,
                  marginVertical: 4,
                }}
              >
                <View style={CommonStyles.rowViewFlexStart}>
                  <Image
                    style={CommonStyles.smallImage}
                    // source={{ uri: `${item.author.profile}` }}
                  />
                  <Text style={[CommonStyles.txtAuthorName, { color: 'red' }]}>
                    Schedule
                  </Text>

                  <TouchableOpacity onPress={() => cancelSend(item)}>
                    <Text style={{ color: 'blue', fontWeight: 'bold' }}>
                      Cancel Send
                    </Text>
                  </TouchableOpacity>
                  <MaterialIcons
                    name="delete"
                    size={24}
                    color="red"
                    style={{ marginHorizontal: 15 }}
                    onPress={() => deleteSchedule(item.id)}
                  />
                </View>
                <Text
                  style={[CommonStyles.text, { color: 'red', marginLeft: 10 }]}
                >
                  {moment(item.timestamp).add(0, 'days').calendar()}
                </Text>

                <Text style={CommonStyles.postText}>{item.postText}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
};
export default Schedule;
