import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: this method is used to call all data from asyncStorage.
const RemoveAll_UserInfo = async () => {
  await AsyncStorage.clear();
};

//TODO: this method will store logged_in user info in AsyncStorage i.e id and token with Key @session_token.
const SetUserInfo = async (responseJson) => {
  await AsyncStorage.setItem('@session_token', JSON.stringify(responseJson));
};

// TODO: this method will remove all value from AsyncStorage where key=@session_token.
const RemoveUserInfo = async () => {
  await AsyncStorage.removeItem('@session_token');
};

// TODO: this mehtod will return loggedin user info i.e id,token.
const GetUserInfo = async () => {
  const user = await AsyncStorage.getItem('@session_token');
  if (user != null) {
    const parse = JSON.parse(user);
    return {
      id: parse.id,
      token: parse.token,
    };
  }
  return {
    id: 0,
    token: 0,
  };
};
export default GetUserInfo;

// TODO: this mehtod will save list of draft post in AsyncStorage with key=Draft.Every time it will append new record on list.
const SaveDraft = async (post) =>
  AsyncStorage.getItem('Draft')
    .then((draft) => {
      const c = draft ? JSON.parse(draft) : [];
      c.push(post);
      AsyncStorage.setItem('Draft', JSON.stringify(c));
    })
    .then(() => true);

// TODO: this method will return all draft post.
const GetDraft = async () => {
  const posts = await AsyncStorage.getItem('Draft');
  return posts;
};

// TODO: this method will remove item from async storage where key=Draft.
const ClearDraft = async () => {
  await AsyncStorage.removeItem('Draft');
};

// TODO: this method will remove value from this list of draft posts where id=postid.
const Remove_DraftItem = async (postid) => {
  await AsyncStorage.getItem('Draft')
    .then((draft) => {
      const oldArray = draft ? JSON.parse(draft) : [];
      const newArray = oldArray.filter((item) => item.id !== postid);
      AsyncStorage.setItem('Draft', JSON.stringify(newArray));
    })
    .then(() => {
      /* eslint-disable no-console */
      console.log('Post removed from draft Successfully!');
      /* eslint-enable no-console */
    });
};

// TODO: this method will update record in draft list.
const UpdateDraft = async (id, postText) => {
  await AsyncStorage.getItem('Draft').then((draft) => {
    const oldArray = draft ? JSON.parse(draft) : [];
    const newData = oldArray.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          postText,
        };
      }
      return {
        ...item,
      };
    });
    AsyncStorage.setItem('Draft', JSON.stringify(newData))
      .then(() => alert('updated successfully!'))
      .catch((err) => alert(err));
  });
};

// -----------------------------Sechdule Start---------------------------------------------
// TODO: this method will save list of schedule posts in AsyncStorage where key=Schedule.
const SaveSchedule = async (post) =>
  AsyncStorage.getItem('Schedule')
    .then((draft) => {
      const c = draft ? JSON.parse(draft) : [];
      c.push(post);
      AsyncStorage.setItem('Schedule', JSON.stringify(c));
    })
    .then(() => true)
    .catch((err) => alert(err));

// TODO:this method will return list of all schedule posts.
const GetSchedule = async () => {
  const posts = await AsyncStorage.getItem('Schedule');
  return posts;
};

// TODO:this method will remove all items from AsyncStorage where key=Schedule.
const ClearSchedule = async () => {
  await AsyncStorage.removeItem('Schedule');
};

// TODO:this method will remove a single record from AsyncStorage where key=Scehdule
const RemoveSchedule = async (postid) => {
  await AsyncStorage.getItem('Schedule')
    .then((draft) => {
      const oldArray = draft ? JSON.parse(draft) : [];
      const newArray = oldArray.filter((item) => item.id !== postid);
      AsyncStorage.setItem('Schedule', JSON.stringify(newArray));
    })
    .then(() => {
      /* eslint-disable no-console */
      console.log('Post removed from schedule Successfully!');
      /* eslint-enable no-console */
    });
};

// TODO: this method will update record in schedule list.
const UpdateSchedule = async (id, postText) => {
  await AsyncStorage.getItem('Schedule').then((Schedule) => {
    const oldArray = Schedule ? JSON.parse(Schedule) : [];
    const newData = oldArray.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          postText,
        };
      }
      return {
        ...item,
      };
    });

    AsyncStorage.setItem('Schedule', JSON.stringify(newData))
      .then(() => 'updated successfully!')
      .catch((err) => alert(err));
  });
};

export {
  // User
  SetUserInfo,
  RemoveUserInfo,
  RemoveAll_UserInfo,
  // Draft
  SaveDraft,
  GetDraft,
  ClearDraft,
  Remove_DraftItem,
  UpdateDraft,
  // Schedule
  SaveSchedule,
  GetSchedule,
  ClearSchedule,
  RemoveSchedule,
  UpdateSchedule,
};
