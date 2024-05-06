import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const CommentButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={require('../assets/Comment.png')} style={styles.icon} />
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

export default CommentButton;
