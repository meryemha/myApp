import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../Firebase';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const db = getDatabase(app);
  const navigation = useNavigation();

  const checkEmailExists = async () => {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      let emailFound = false;
      snapshot.forEach((user) => {
        const userEmailRef = ref(db, `users/${user.key}/email`);
        get(userEmailRef).then((emailSnapshot) => {
          if (emailSnapshot.exists() && emailSnapshot.val() === email) {
            emailFound = true;
            resetPassword();
          }
        });
      });
      if (!emailFound) {
        setEmailNotFound(true);
      }
    } catch (error) {
      console.error('Error checking email existence:', error);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Email de réinitialisation envoyé ! Veuillez vérifier votre boîte de réception.');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la réinitialisation du mot de passe. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
        {emailNotFound && (
          <Text style={styles.errorMessage}>Your Email wasn't found in our Database.</Text>
        )}
        <Button
          title="Reset Password"
          disabled={loading}
          onPress={checkEmailExists}
          loading={loading}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Text style={styles.message}>You still didn't join us?</Text>
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom:90,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  message: {
    marginBottom: 20,
  },
  registerButton: {
    width: '50%', // Définissez la largeur souhaitée pour le bouton "Register"
  },
});
