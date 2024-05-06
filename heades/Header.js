import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../Firebase';
import { getAuth } from 'firebase/auth';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Header = ({ isHomePage, onPressBack, onRefreshHome }) => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userRef = ref(db, 'users/' + uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setProfileImage(userData.pic);
          setUsername(userData.username);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [refreshing]);

  const handleRefresh = () => {
    onRefreshHome(); // Appeler la fonction de rafraîchissement dans Home.js
    setRefreshing(true);
    wait(200).then(() => setRefreshing(false));
  };

  const openProfileModal = () => {
    navigation.navigate('ProfileModal', { username, profileImage });
  };

  return (
    <ScrollView
      style={{ marginTop: 20 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      <View style={styles.header}>
        {!isHomePage && (
          <TouchableOpacity style={styles.backButton} onPress={onPressBack || navigation.goBack}>
            <Image source={require('../assets/Fleche.png')} style={styles.backIcon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
          <Image source={require('../assets/Leaf.png')} style={[styles.logoImage, { transform: [{ rotate: '45deg' }] }]} /> 
          <Text style={styles.iconText}>eave</Text> 
        </TouchableOpacity>
        <TouchableOpacity onPress={openProfileModal} style={styles.profileButton}>
          {profileImage && <Image source={{ uri: profileImage }} style={styles.profileIcon} />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: "#1C8D21"
  },
  profileButton: {
    borderRadius: 16,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  logoImage: {
    width: 55,
    height: 43,
  },
  
  backIcon: {
    width: 30,
    height: 30,
  },
});

export default Header;
