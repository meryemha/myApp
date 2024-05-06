import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, update , get, push } from 'firebase/database';
import { app } from '../Firebase';

export default function PostCo() {
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const navigation = useNavigation();
    const auth = getAuth(app);
    const db = getDatabase(app);
    const user = auth.currentUser;
  
    const saveAdditionalInfo = async () => {
      try {
        const userRef = ref(db, 'users/' + user.uid);
        // Vérifier si l'image de profil n'est pas définie
        const snapshot = await get(userRef);
        if (snapshot.exists() && !snapshot.val().pic) {
          await update(userRef, { 
            username: username,
            bio: bio,
            country: country,
            city: city,
            pic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1xVfbpv8vLIlp8pcM8gNhc917Qrw3cihy7A&s'
          });
        } else {
          await update(userRef, { 
            username: username,
            bio: bio,
            country: country,
            city: city
          });
        }

        

        Alert.alert('Success', 'Additional information saved successfully!');
        navigation.navigate('EditProfile');
      } catch (error) {
        console.error('Error while saving informations:', error);
        Alert.alert('Error', 'An error occurred while saving informations. Please try again.');
      }
    };
  
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Input
              label="Username"
              onChangeText={(text) => setUsername(text)}
              value={username}
              placeholder="Enter your username"
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Input
              label="Bio"
              onChangeText={(text) => setBio(text)}
              value={bio}
              placeholder="Enter your bio"
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Input
              label="County"
              onChangeText={(text) => setCountry(text)}
              value={country}
              placeholder="Enter your country"
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Input
              label="City"
              onChangeText={(text) => setCity(text)}
              value={city}
              placeholder="Enter your city"
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button title="Save" onPress={() => saveAdditionalInfo()} />
          </View>
        </View>
      </ScrollView>
    );
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
});
