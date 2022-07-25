import React from 'react';
import { View, Text, Platform, Dimensions } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
const Loader1 = () => {
  const { height, width } = Dimensions.get('screen');
  if (Platform.OS == 'android') {
    return (
      <View
        style={{
          width: '100%',
          height: height - 110,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatedLottieView
          style={{
            height: 100,
          }}
          resizeMode="cover"
          source={require('../../assets/loader1.json')}
          autoPlay
          loop
        />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#1b74e4' }}>
          Loading...
        </Text>
      </View>
    );
  }
};

export default Loader1;
