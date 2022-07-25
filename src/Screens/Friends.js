import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import GetUserInfo from '../utils/async-storage';
import { getAllFriends, getProfilePhoto1 } from './API';
import CommonStyles from './Styles/Common/CommonStyle';
import NoRecordFound from '../Components/NoRecordFound';
import Loader1 from '../Components/Loader1';
const Friends = ({ navigation }) => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notFound, setNotFound] = useState(false);
  useEffect(async () => {
    let isMounted = true; // note mutable flag
    const unsubscribe = navigation.addListener('focus', async () => {
      // The screen is focused
      setLoading(true);
      setDataList([]);
      await getFriendsList();
      setLoading(false);
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => {
      unsubscribe, (isMounted = false);
    };
  }, []);
  const getFriendsList = async () => {
    setRefreshing(true);
    setDataList([]);
    const loggedInUser = await GetUserInfo();
    await getAllFriends(loggedInUser.token)
      .then(async (responseJson) => {
        setDataList([]);
        if (responseJson.length === 0) {
          setNotFound(true);
          setRefreshing(false);
          setLoading(false);
        } else {
          setNotFound(false);
          await responseJson.forEach(async (element) => {
            const picture = await getProfilePhoto1(
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
                profile: picture,
              },
            ]);
          });
        }
      })
      .catch((error) => alert(error))
      .finally(() => setRefreshing(false));
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <Loader1 />
      ) : (
        <FlatList
          style={{ width: '97%' }}
          data={dataList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              colors={['red', 'green']}
              onRefresh={() => getFriendsList()}
            />
          }
          ListHeaderComponent={notFound && <NoRecordFound />}
          renderItem={({ item }) => (
            <View
              style={[
                CommonStyles.rowView,
                {
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: 15,
                  marginBottom: 0,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('FriendProfile', {
                    user_id: item.user_id,
                  })
                }
              >
                <Image
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 60,
                    backgroundColor: '#ccceee',
                  }}
                  source={{ uri: `${item.profile}` }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginHorizontal: 10,
                  flex: 1,
                }}
              >
                {item.user_givenname} {item.user_familyname}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                width: '90%',
                alignSelf: 'center',
                backgroundColor: '#ccceee',
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};
export default Friends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
