import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../Firebase';
import { getAuth } from 'firebase/auth';
import Logout from '../connexion/Logout';

const ProfileModal = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const auth = getAuth(app);
  const db = getDatabase(app);
  const uid = auth.currentUser.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(db, 'users/' + uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleNavigate = (screenName) => {
    if (screenName === 'Profile') {
      navigation.navigate(screenName, { userId: auth.currentUser.uid });
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={[styles.header, { marginTop: 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../assets/Fleche.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            {userData && (
              <>
                <Text style={styles.username}>{userData.username}</Text>
                <Image source={{ uri: userData.pic }} style={styles.profileImage} />
              </>
            )}
          </View>
        </View>
      
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Profile')}>
            <Text style={styles.buttonText}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('EditProfile')}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('MyPosts')}>
            <Text style={styles.buttonText}>My Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('AddPost')}>
            <Text style={styles.buttonText}>Add Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Notifications')}>
            <Text style={styles.buttonText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('AccountPrivacy')}>
            <Text style={styles.buttonText}>Account Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('ParentalSupervision')}>
            <Text style={styles.buttonText}>Parental Supervision</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Language')}>
            <Text style={styles.buttonText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Blocked')}>
            <Text style={styles.buttonText}>Bloqued</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Help')}>
            <Text style={styles.buttonText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('About')}>
            <Text style={styles.buttonText}>About</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Logout />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    marginRight: 'auto',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileModal;
