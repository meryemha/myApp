// Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../Firebase';
import HeaderProfile from '../heades/HeaderProfile';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const db = getDatabase(app);
  const auth = getAuth(app);
  const currentUserUid = auth.currentUser.uid;

  useEffect(() => {
    const fetchProfileData = async () => {
      const userRef = ref(db, 'users/' + userId);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setProfileData(data);
        } else {
          console.log('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchProfileData();
  }, [db, userId]);

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderProfile title= 'My Profile' />
      <ScrollView>
        <View style={styles.profileContainer}>
          <Image source={{ uri: profileData.pic }} style={styles.profileImage} />
          <Text style={styles.username}>{profileData.username}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>Bio</Text>
            <Text style={styles.text}>{profileData.bio}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>Gender</Text>
            <Text style={styles.text}>{profileData.gender}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>Age</Text>
            <Text style={styles.text}>{profileData.age}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>Country</Text>
            <Text style={styles.text}>{profileData.country}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>City</Text>
            <Text style={styles.text}>{profileData.city}</Text>
          </View>
          {/* Bouton de modification du profil */}
          {currentUserUid === userId && (
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'lightgray',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0075FF',
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
