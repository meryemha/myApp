import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const Goodbye = () => {
  const navigation = useNavigation();

  const onAnimationFinish = () => {
    navigation.navigate('EntryPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>I'm Sorry you left but ... I hope to see you again</Text>
      <LottieView
        source={require('../assets/goodbye.json')}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: 300,
    height: 300,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Goodbye;
