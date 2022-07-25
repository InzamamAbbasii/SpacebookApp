import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Loader3 = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={'#fff'} size="large" />
    </View>
  );
};

export default Loader3;
