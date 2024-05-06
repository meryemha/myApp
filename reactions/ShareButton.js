import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const ShareButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={require('../assets/Share.png')} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    buttonContainer: {
      padding: 10,
    },
    icon: {
      width: 20,
      height: 20,
    },
  });

export default ShareButton;
