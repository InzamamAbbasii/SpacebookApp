import moment from 'moment';
import GetUserInfo, {
  GetSchedule,
  RemoveSchedule,
  RemoveUserInfo,
} from '../../utils/async-storage';

//TODO: 192.168.1.102 replace this ip address with your ip address
const SERVER_URL = 'http://192.168.1.102:3333/api/1.0.0/';

// TODO: to get data from database through api we will use this method
const get = async (route, token) =>
  fetch(SERVER_URL + route, {
    headers: {
      'X-Authorization': token,
    },
  })
    .then((response) => response)
    .catch((err) => alert(err));

// TODO: to post data from database through api we will use this method
const post = async (route, header, body) =>
  fetch(SERVER_URL + route, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(body),
  })
    .then((response) => response)
    .catch((err) => alert(err));

// TODO: to modify/update any record in database  we will use patch method
const patch = async (route, header, body) =>
  fetch(SERVER_URL + route, {
    method: 'PATCH',
    headers: header,
    body: JSON.stringify(body),
  })
    .then((response) => response)
    .catch((err) => alert('err in api i.e PATCH ', err));

// TODO: this method is used to remove/delete any recorf from database
const remove = async (route, headers) =>
  fetch(SERVER_URL + route, {
    // mode:'no-cors',
    // credentials:'include',
    method: 'DELETE',
    headers,
  })
    .then((response) => response)
    .catch((err) => alert(err));

// TODO: getting profile picture of user. Here id=userId and token=LoggedIn user token
const getProfilePhoto1 = async (id, token) => {
  return fetch(`${SERVER_URL}user/${id}/photo`, {
    method: 'GET',
    headers: {
      'X-Authorization': token,
    },
  })
    .then((res) => {
      if (typeof res !== 'undefined') {
        if (res.status === 200) {
          return res.blob();
        } else {
          throw 'Something went wrong';
        }
      }
    })
    .then(async (resBlob) => {
      const f = await convertImageToBase64(resBlob);
      return f;
    })
    .catch((err) => {
      console.log(`Error : ${err}`);
    });
};

const convertImageToBase64 = async (blob) =>
  new Promise((resolve) => {
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(blob);
    fileReaderInstance.onload = () => {
      const b = fileReaderInstance.result;
      resolve(b);
    };
  });

// TODO:Getting info about user i.e name email etc.
const GetUserData = new Promise(async (resolve, reject) => {
  let loggedInUser = await GetUserInfo();
  await get(`user/${loggedInUser.id}`, loggedInUser.token)
    .then((res) => {
      if (typeof res !== 'undefined') {
        if (res.status === 200) return res.json();
        throw 'Something went wrong';
      }
    })
    .then(async (JsonResponse) => {
      if (typeof JsonResponse !== 'undefined') {
        let profile = await getProfilePhoto1(
          loggedInUser.id,
          loggedInUser.token
        );
        let obj = {
          token: loggedInUser.token,
          user_id: JsonResponse.user_id,
          first_name: JsonResponse.first_name,
          last_name: JsonResponse.last_name,
          email: JsonResponse.email,
          friend_count: JsonResponse.friend_count,
          profile: profile,
        };
        resolve(obj);
      }
    })
    .catch((err) => {
      console.log('Error : ', err);
      reject(err);
    });
});

const saveProfilePhoto = async (id, token, blob) => {
  const headers = {
    'X-Authorization': token,
    'Content-Type': 'image/jpeg',
  };
  return fetch(`${SERVER_URL}user/${id}/photo`, {
    method: 'POST',
    headers,
    body: blob,
  })
    .then((response) => {
      if (response.status === 200) {
        alert('Updated Successfully!');
      } else {
        throw 'Something went wrong';
      }
    })
    .catch((error) => {
      alert(error);
    });
};

// TODO: getAllFriends--> this method will return list of friends.
const getAllFriends = async (token) =>
  get('search?search_in=friends', token)
    .then((response) => {
      if (typeof response !== 'undefined') {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          navigation.navigate('Login');
          throw 'unauthorized';
        } else throw 'Something went wrong';
      }
    })
    .then((responseJson) => responseJson)
    .catch(() => {
      console.log('Error in getting all friends : ');
    });
// ------------------------------------Get post Detail-----------------------------------------------------------

// TODO: Get_SingleUser_Posts--> this method will return post detail of user in json form.
const Get_SingleUser_Posts = async (id, token) => {
  return get(`user/${id}/post`, token)
    .then((response) => {
      if (typeof response !== 'undefined') {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) throw 'Unauthorizedd';
        else throw 'Something went wrong';
      }
    })
    .then(async (responseJson) => {
      return responseJson;
    })
    .catch(() => {
      console.log('error');
    });
};
// TODO: GetAllPosts--> this method will return sordted list of posts of user along with user profile and other detail.
const GetAllPosts = async (id, token) => {
  const postList = [];
  const promises = [];
  const listoffriends = await getAllFriends(token);
  listoffriends.push({ user_id: id }); // logged in user
  listoffriends.forEach((element) => {
    promises.push(
      Get_SingleUser_Posts(element.user_id, token)
        .then(async (postData) => {
          const picture = await getProfilePhoto1(element.user_id, token); // return profile picture
          const obj = { postData, picture };
          return obj;
        })
        .then((res) => {
          if (typeof res !== 'undefined') {
            res.postData.forEach((element) => {
              const obj = {
                post_id: element.post_id,
                text: element.text,
                timestamp: element.timestamp,
                author: {
                  profile: res.picture,
                  user_id: element.author.user_id,
                  first_name: element.author.first_name,
                  last_name: element.author.last_name,
                  email: element.author.email,
                },
                numLikes: element.numLikes,
                like: false,
              };
              postList.push(obj);
            });
          }
        })
        .catch((error) => {
          console.log('Error: ', error);
        })
    );
  });
  //  TODO: here we will return list when all promises can be excuted.
  return Promise.all(promises)
    .then(() => {
      // TODO: sorting list based on post_id to show most recent post in top and so on.s
      const sortedList = postList.sort((a, b) => {
        return b.post_id - a.post_id;
      });
      return sortedList;
    })
    .catch((err) => alert(`Error in promises ${err}`));
};
// ------------------------------------Get post Detail END-----------------------------------------------------------
// TODO: postSchedules_Posts--> this method will posts all schedule post if schedule time is less or equal to current time.It will remove
//      post from AsyncStorage and post it througn api.
const postSchedules_Posts = () =>
  new Promise(async (resolve, reject) => {
    try {
      const userInfo = await GetUserInfo();
      const posts = await GetSchedule();
      let postsLength = 0;
      if (posts == null) {
        postsLength = 0;
      } else {
        const parse = JSON.parse(posts);
        postsLength = parse.length;
      }
      console.log('schedule posts = ', postsLength);
      if (posts !== 'undefined' && posts != null && postsLength != 0) {
        const parse = JSON.parse(posts);
        const currentDateTime = moment(new Date()).format(
          'MMMM Do YYYY, h:mm:ss a'
        );

        parse.forEach(async (element, index) => {
          const scheduleDateTime = moment(element.timestamp).format(
            'MMMM Do YYYY, h:mm:ss a'
          );
          if (currentDateTime >= scheduleDateTime) {
            const headers = {
              'Content-Type': 'application/json',
              'X-Authorization': userInfo.token,
            };
            const data = {
              text: element.postText,
            };
            await post(`user/${element.user_id}/post`, headers, data)
              .then(async (response) => {
                if (typeof response !== 'undefined') {
                  if (response.status === 201) {
                    await RemoveSchedule(element.id);
                    if (index === parse.length - 1)
                      resolve(
                        `Schedule Post is now publish! Id: ${element.id}`
                      );
                  }
                } else {
                  return Promise.reject(response);
                }
              })
              .catch((error) => {
                alert(`error : ${error}`);
              });
          } else {
            console.log('else');
            if (index === parse.length - 1)
              resolve('no schedule match at this time');
          }
        });
      } else {
        resolve('no schedule post found');
      }
    } catch (error) {
      reject(new Error('error in posting schedule'));
      alert(error);
    }
  });

export {
  get,
  post,
  patch,
  remove,
  getProfilePhoto1,
  saveProfilePhoto,
  getAllFriends,
  GetAllPosts,
  postSchedules_Posts,
  convertImageToBase64,
  GetUserData,
  Get_SingleUser_Posts,
};
