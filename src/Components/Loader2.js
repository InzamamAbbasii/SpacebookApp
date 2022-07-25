import React from 'react';
import { View, Text, Platform, Dimensions } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
const Loader2 = () => {
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
            height: 150,
          }}
          resizeMode="cover"
          source={require('../../assets/loader2.json')}
          autoPlay
          loop
        />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#000' }}>
          Loading...
        </Text>
      </View>
    );
  }
};

export default Loader2;
