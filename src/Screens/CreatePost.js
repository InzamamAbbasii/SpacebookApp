import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import {
  SaveDraft,
  GetDraft,
  SaveSchedule,
  GetSchedule,
} from '../utils/async-storage';

import CommonStyles from './Styles/Common/CommonStyle';
import { post } from './API';

const CreatePost = ({ navigation, route }) => {
  const [postText, setPostText] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const savePost = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': route.params.token,
    };
    const data = {
      text: postText,
    };
    return post(`user/${route.params.user_id}/post`, headers, data)
      .then((response) => {
        if (response.status === 201) {
          if (Platform.OS == 'android') {
            navigation.navigate('BottomTab');
            ToastAndroid.show('Posted', ToastAndroid.SHORT);
          } else {
            navigation.navigate('Home');
            alert('Post Created Successfully!');
          }
        } else throw 'Something went wrong';
      })
      .catch((error) => {
        alert(error);
      });
  };

  const saveDraft = async () => {
    const draftList = await GetDraft();
    const parse = JSON.parse(draftList);
    let postid = 1;

    if (parse !== null && parse.length !== 0) {
      const lastitem = parse.pop();
      postid = ++lastitem.id;
    }
    const obj = {
      id: postid,
      user_id: route.params.user_id,
      first_name: route.params.first_name,
      last_name: route.params.last_name,
      postText,
    };
    await SaveDraft(obj).then((res) => {
      if (res === true) {
        navigation.navigate('Draft');
      }
    });
  };

  const saveSchedulePost = async () => {
    const scheduleList = await GetSchedule();
    const parse = JSON.parse(scheduleList);
    let postid = 1;

    if (parse !== null && parse.length !== 0) {
      const lastitem = parse.pop();
      postid = ++lastitem.id;
    }
    const obj = {
      id: postid,
      user_id: route.params.user_id,
      first_name: route.params.first_name,
      last_name: route.params.last_name,
      postText,
      timestamp: date,
    };

    await SaveSchedule(obj)
      .then((res) => {
        if (res === true) {
          navigation.navigate('Schedule');
        }
      })
      .finally(() => setModalVisible(false));
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const ModalContent = () => {
    return (
      <View style={styles.modalContent1}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Pick Date & Time</Text>

        <View style={styles.datePicker}>
          <Text> {date.toLocaleDateString()}</Text>
          <FontAwesome
            name="calendar"
            size={24}
            color="red"
            onPress={() => showDatepicker()}
          />
        </View>
        <View style={styles.datePicker}>
          <Text> {date.toLocaleTimeString()}</Text>
          <FontAwesome
            name="calendar"
            size={24}
            color="red"
            onPress={() => showTimepicker()}
          />
        </View>
        <View
          style={[
            CommonStyles.rowView,
            { marginVertical: 20, justifyContent: 'flex-end', width: '100%' },
          ]}
        >
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text
              style={{
                fontSize: 20,
                color: '#031cff',
                fontWeight: 'bold',
                marginHorizontal: 10,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveSchedulePost()}>
            <Text
              style={{
                fontSize: 20,
                color: '#031cff',
                fontWeight: 'bold',
                marginHorizontal: 10,
              }}
            >
              Ok
            </Text>
          </TouchableOpacity>
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour
            display="default"
            minimumDate={new Date()}
            onChange={onChange}
          />
        )}
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={CommonStyles.scrollView}>
        <Modal
          isVisible={isModalVisible}
          is24Hour
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          <ModalContent />
        </Modal>
        <View
          style={[
            CommonStyles.rowView,
            { justifyContent: 'flex-start', padding: 10 },
          ]}
        >
          <Image
            style={CommonStyles.normalImage}
            source={{ uri: `${route.params.profile}` }}
          />
          <Text style={CommonStyles.txtAuthorName}>
            {route.params.first_name} {route.params.last_name}{' '}
          </Text>
        </View>

        <TextInput
          style={[
            CommonStyles.textInput,
            {
              minHeight: Dimensions.get('window').height / 2.1,
              paddingLeft: 20,
            },
          ]}
          placeholder={`What's on Your Mind, ${route.params.first_name}?`}
          placeholderTextColor="#828282"
          multiline
          textAlignVertical="top"
          onChangeText={(txt) => setPostText(txt)}
        />

        <View style={{ padding: 10, width: '100%' }}>
          <TouchableOpacity
            disabled={postText.length === 0}
            onPress={() => savePost()}
            style={[
              CommonStyles.btnTouchable,
              {
                backgroundColor: postText.length === 0 ? '#CCCCCC' : '#1b74e4',
              },
            ]}
          >
            <Text
              style={[
                CommonStyles.btnText,
                {
                  color: postText.length === 0 ? '#828282' : '#fff',
                },
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
          <View style={[CommonStyles.rowView, { marginBottom: 10 }]}>
            <TouchableOpacity
              disabled={postText.length === 0}
              onPress={() => saveDraft()}
              style={[
                CommonStyles.btnTouchable,
                {
                  flex: 1,
                  marginVertical: 0,
                  backgroundColor:
                    postText.length === 0 ? '#CCCCCC' : '#008f8a',
                },
              ]}
            >
              <Text
                style={[
                  CommonStyles.btnText,
                  { color: postText.length === 0 ? '#828282' : '#fff' },
                ]}
              >
                Save as Draft
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Draft')}
              style={[
                CommonStyles.btnTouchable,
                {
                  flex: 1,
                  marginVertical: 0,
                  marginLeft: 5,
                  backgroundColor: '#096360',
                },
              ]}
            >
              <Text style={CommonStyles.btnText}>View Draft</Text>
            </TouchableOpacity>
          </View>

          <View style={[CommonStyles.rowView, { marginBottom: 10 }]}>
            <TouchableOpacity
              disabled={postText.length === 0}
              onPress={toggleModal}
              style={[
                CommonStyles.btnTouchable,
                {
                  flex: 1,
                  marginVertical: 0,
                  backgroundColor:
                    postText.length === 0 ? '#CCCCCC' : '#ff9705',
                },
              ]}
            >
              <Text
                style={[
                  CommonStyles.btnText,
                  { color: postText.length === 0 ? '#828282' : '#fff' },
                ]}
              >
                Schedule
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Schedule')}
              style={[
                CommonStyles.btnTouchable,
                {
                  flex: 1,
                  marginVertical: 0,
                  marginLeft: 5,
                  backgroundColor: 'green',
                },
              ]}
            >
              <Text style={CommonStyles.btnText}>View Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent1: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  datePicker: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 7,
    borderColor: '#000',
    borderWidth: 1,
  },
});
