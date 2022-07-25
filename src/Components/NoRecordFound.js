import React from 'react';
import { View, Text, Platform, Dimensions } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
const NoRecordFound = () => {
  const { height, width } = Dimensions.get('window');
  if (Platform.OS == 'android') {
    return (
      <View
        style={{
          flex: 1,
          height: height - 110,
          // backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatedLottieView
          style={{
            height: 160,
          }}
          resizeMode="cover"
          source={require('../../assets/norecordfound.json')}
          autoPlay
          loop={false}
        />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#000' }}>
          No Record Found
        </Text>
      </View>
    );
  }
};

export default NoRecordFound;
