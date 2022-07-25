import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import GetUserInfo from '../utils/async-storage';
import { get, post, remove } from './API';
import Loader1 from '../Components/Loader1';
import Loader2 from '../Components/Loader2';
import NoRecordFound from '../Components/NoRecordFound';
const FriendRequest = ({ navigation }) => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(async () => {
    let isMounted = true;
    setLoading(true);
    await getFriendRequests();
    setLoading(false);
    return () => {
      isMounted = false;
    };
  }, []);

  const getFriendRequests = async () => {
    const loggedInUser = await GetUserInfo();
    setRefreshing(true);
    return get('friendrequests', loggedInUser.token)
      .then((response) => {
        if (response.status === 200) return response.json();
        if (response.status === 401) navigation.navigate('Login');
        else throw 'Something went wrong';
      })
      .then((responseJson) => {
        if (responseJson.length === 0) {
          setDataList([]);
          setNotFound(true);
        } else {
          setDataList([]);
          responseJson.forEach((element) => {
            setDataList((data) => [
              ...data,
              {
                user_id: element.user_id,
                first_name: element.first_name,
                last_name: element.last_name,
                email: element.email,
              },
            ]);
          });
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => setRefreshing(false));
  };

  const confirmRequest = async (friendId) => {
    const loggedInUser = await GetUserInfo();

    const headers = {
      'X-Authorization': loggedInUser.token,
      'Content-Type': 'application/json',
    };
    return post(`friendrequests/${friendId}`, headers)
      .then((response) => {
        if (response.status === 200) {
          const newData = dataList.filter((item) => {
            return item.user_id !== friendId;
          });
          setDataList(newData);
          alert('Confirm');
        } else if (response.status === 401) throw 'Unauthorized';
        else throw 'Something went wrong';
      })
      .catch((error) => {
        alert(error);
      });
  };
  const deleteRequest = async (friendId) => {
    const loggedInUser = await GetUserInfo();

    const headers = {
      'X-Authorization': loggedInUser.token,
      'Content-Type': 'application/json',
    };
    return remove(`friendrequests/${friendId}`, headers)
      .then((response) => {
        if (response.status === 200) {
          const newData = dataList.filter((item) => {
            return item.user_id !== friendId;
          });
          setDataList(newData);
          alert('Deleted');
        } else if (response.status === 401) throw 'Unauthorized';
        else throw 'Something went wrong';
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader2 />
      ) : (
        <FlatList
          style={{ width: '98%', height: '100%' }}
          data={dataList}
          ListHeaderComponent={notFound && <NoRecordFound />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              colors={['red', 'green', 'blue']}
              onRefresh={() => getFriendRequests()}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={{ fontSize: 24, fontWeight: '600' }}>
                {item.first_name} {item.last_name}
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '600' }}>
                {' '}
                {item.email}{' '}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => confirmRequest(item.user_id)}
                  style={styles.btnTouchable}
                >
                  <Text style={styles.btnText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => deleteRequest(item.user_id)}
                  style={styles.btnTouchable}
                >
                  <Text style={styles.btnText}> Delete </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
          // ListHeaderComponent={renderHeader}
        />
      )}
    </View>
  );
};
export default FriendRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1bb',
    margin: 5,
    elevation: 10,
    padding: 10,
    borderRadius: 10,
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
    fontWeight: 'bold',
  },
});
