import AsyncStorage from '@react-native-async-storage/async-storage';

 const  GetUserInfo = async () => {
    const user = await AsyncStorage.getItem('@session_token');
    let parse = JSON.parse(user);
    console.log('user info..', parse.id, parse.token);
    return {
        id: parse.id,
        token: parse.token
    }
}

export default GetUserInfo

// module.exports = {
//     GetUserInfo: GetUserInfo,
// }