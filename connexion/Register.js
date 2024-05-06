import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification  } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from '../Firebase'


export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const navigation = useNavigation();
  const auth = getAuth(app);
  const db = getDatabase();

  const createAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Envoyer un e-mail de vérification
      await sendEmailVerification(user);
  
      // Créer une référence à l'emplacement où enregistrer les données de l'utilisateur
      const userRef = ref(db, 'users/' + user.uid);
  
      // Enregistrer les données de l'utilisateur dans la base de données
      await set(userRef, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        gender: gender,
        age: age
      });
  
      console.log(user);
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.verticallySpaced}>
          <Input
            label="First Name"
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
            placeholder="First Name"
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Last Name"
            onChangeText={(text) => setLastName(text)}
            value={lastName}
            placeholder="Last Name"
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Age"
            onChangeText={(text) => setAge(text)}
            value={age}
            keyboardType="number-pad"
            placeholder="Age"
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Gender"
            onChangeText={(text) => setGender(text)}
            value={gender}
            placeholder="Gender"
          />
        </View>
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
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            title="Sign up"
            onPress={() => createAccount()}
            buttonStyle={{ backgroundColor: '#1C8D21' }} // Couleur verte pour le bouton "Sign up"
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
