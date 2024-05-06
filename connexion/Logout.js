import React, { useState } from 'react';
import { View, TextInput, Text, Button, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleLogout = () => {
    setModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await signOut(auth);
      console.log('User signed out successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error.message);
      setErrorMessage('Invalid password. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ResetPassword');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Please confirm your password to logout:</Text>
            <TextInput
              style={[styles.input, { marginTop: 20 }]} // Ajout de la marge top de 10
              secureTextEntry={true}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={handleConfirmLogout} style={[styles.button, styles.confirmButton]}>
                <Text style={[styles.buttonText, styles.confirmButtonText]}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.button, styles.cancelButton]}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    padding: 10,
    
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  confirmButton: {
    marginRight: 5,
  },
  cancelButton: {
    marginLeft: 5,
  },
  confirmButtonText: {
    color: '#FF5E5E',
  },
  cancelButtonText: {
    color: '#45A73C',
  },
  forgotPassword: {
    color: 'blue',
  },
});

export default Logout;
