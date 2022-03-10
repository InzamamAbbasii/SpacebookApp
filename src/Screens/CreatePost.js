import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Image, TouchableOpacity } from "react-native";

const CreatePost = ({ navigation, route }) => {
    const [postText, setPostText] = useState('');

    const savePost = () => {
        console.log(postText,route.params.user_id,route.params.token);
        var url = `http://localhost:3333/api/1.0.0/user/${route.params.user_id}/post`;
        var headers = {
            'Content-Type': 'application/json',
            'X-Authorization': route.params.token,
        };
        var data={
            text:postText
        }
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => {
            console.log(response);
            if (response.status === 201) {
                alert('Post Created Successfully!');
            } else {
                throw 'Something went wrong';
            }
        }).catch((error) => {
            alert(error);
        })
    }
    return (
        <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: 'red' }}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                    <Image
                        style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: 'red', marginRight: 10 }}
                        source={{ uri: `${route.params.profile}` }}
                    />
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}> {route.params.first_name} {route.params.last_name} </Text>
                </View>
                <TextInput
                    style={{ flex: 1, padding: 10, fontSize: 20 }}
                    placeholder={`What's on Your Mind, ${route.params.first_name}?`}
                    placeholderTextColor={'#828282'}
                    multiline={true}
                    onChangeText={(txt) => setPostText(txt)}
                />

                <TouchableOpacity disabled={postText.length == 0 ? true : false} onPress={() => savePost()}
                    style={{ backgroundColor: postText.length == 0 ? '#CCCCCC' : '#1b74e4', marginVertical: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 40 }}>
                    <Text style={{ color: postText.length == 0 ? '#828282' : '#fff', fontSize: 20, fontWeight: 'bold' }}> Post </Text>
                </TouchableOpacity>



            </View>
        </ScrollView>

    );
}
export default CreatePost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
})