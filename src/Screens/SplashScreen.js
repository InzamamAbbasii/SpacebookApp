import React from 'react';
import { View, Text, Platform, Dimensions } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
const SplashScreen = () => {
  const { height, width } = Dimensions.get('screen');
  if (Platform.OS == 'android') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatedLottieView
          style={{
            width: width,
            height: height,
            // marginRight: 95,
          }}
          resizeMode="cover"
          source={require('../../assets/splash.json')}
          autoPlay
          loop
        />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#1b74e4' }}>
          Spacebook
        </Text>
      </View>
    );
  }
};

export default SplashScreen;
