import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { UpdateDraft } from '../utils/async-storage';
import CommonStyles from './Styles/Common/CommonStyle';

const EditDraft = ({ navigation, route }) => {
  const [postText, setPostText] = useState(route.params.postText);
  const updateDraft = async () => {
    await UpdateDraft(route.params.id, postText).then(() => {
      navigation.goBack('Draft');
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[CommonStyles.scrollView, { padding: 10 }]}>
        <View style={CommonStyles.rowView}>
          <Image style={CommonStyles.smallImage} />
          <Text style={CommonStyles.txtAuthorName}>
            {route.params.first_name} {route.params.last_name}
          </Text>
        </View>
        <TextInput
          style={[
            CommonStyles.textInput,
            {
              minHeight: Dimensions.get('screen').height - 300,
              paddingLeft: 20,
            },
          ]}
          placeholder={`What's on Your Mind, ${route.params.first_name}?`}
          placeholderTextColor="#828282"
          multiline
          textAlignVertical="top"
          value={postText}
          onChangeText={(txt) => setPostText(txt)}
        />

        <TouchableOpacity
          disabled={postText.length === 0}
          onPress={() => updateDraft()}
          style={[
            CommonStyles.btnTouchable,
            {
              backgroundColor: postText.length === 0 ? '#CCCCCC' : '#1b74e4',
              width: '96%',
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
            Update
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
export default EditDraft;
