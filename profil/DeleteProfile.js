import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getDatabase, ref, remove } from 'firebase/database';
import { app } from '../Firebase';

const DeleteProfile = ({ navigation }) => {
  const [password, setPassword] = useState('');

  const handleDeleteProfile = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    // Vérification que le mot de passe est saisi
    if (password.trim() === '') {
      Alert.alert('Empty Password', 'Please enter your password to delete your profile.');
      return;
    }

    // Affichage d'une alerte de confirmation avant la suppression
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              // Ré-authentifier l'utilisateur avec son mot de passe actuel
              const credential = EmailAuthProvider.credential(user.email, password);
              await reauthenticateWithCredential(user, credential);

              // Suppression du compte utilisateur avec authentification
              await deleteUser(user);

              // Suppression du compte dans la base de données (Realtime Database)
              const db = getDatabase(app);
              const userRef = ref(db, `users/${user.uid}`);
              await remove(userRef);

              // Navigation vers la page "GoodBye" après la suppression du compte
              navigation.navigate('GoodBye');
            } catch (error) {
              // Gestion des erreurs lors de la suppression du compte
              Alert.alert('Error', 'Failed to delete profile. Please check your password and try again.');
              console.error('Error deleting profile:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Profile</Text>
      <Text style={styles.description}>
        Are you sure you want to delete your profile? This action cannot be undone.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProfile}>
        <Text style={styles.deleteButtonText}>Delete Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50, // Modification : hauteur de l'input augmentée
  },
  deleteButton: {
    backgroundColor: '#FF6347', // Red color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeleteProfile;
