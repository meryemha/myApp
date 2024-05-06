import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Image, TouchableOpacity} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { AuthErrorCodes, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../Firebase';
import { getDatabase, ref, get } from 'firebase/database';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigation = useNavigation();
  const auth = getAuth(app);
  const db = getDatabase(app);

  const loginEmailPassword = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userRef = ref(db, 'users/' + user.uid);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.username && userData.bio && userData.country && userData.city) {
            navigation.navigate('Home');
          } else {
            navigation.navigate('PostCo');
          }
        } else {
          console.log('User data does not exist');
        }
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      console.log(error);
      showLoginError(error);
    }
  }

  const showLoginError = (error) => {
    if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
      Alert.alert('Erreur', 'Email ou Mot de passe incorrect. Veuillez réessayer.');
    } else {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={showPassword ? require('../assets/Eye.png') : require('../assets/closedeye.png')}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          }
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={!showPassword}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          onPress={() => loginEmailPassword()}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.centered]}>
        <Text onPress={() => navigation.navigate('ResetPassword')}>Forgot Password?</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.message}>You still didn't join us?</Text>
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
          color= "#1C8D21" 
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
    flex: 1,
  },
  verticallySpaced: {
    paddingTop: 20,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  centered: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1C8D21',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  eyeIcon: {
    width: 24,
    height: 24,
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
  }
});
