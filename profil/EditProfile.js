import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Modal, Pressable, ImageBackground, Platform } from 'react-native';
import { getDatabase, ref, update, get } from 'firebase/database';
import { app } from '../Firebase';
import { getAuth } from 'firebase/auth';
import HeaderProfile from '../heades/HeaderProfile';
import CameraIcon from '../assets/Camera.png';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';


const EditProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState('');
  const db = getDatabase(app);
  const auth = getAuth(app);
  const uid = auth.currentUser.uid;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(db, 'users/' + uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setProfileData(userData);
          setImage(userData.pic); // Met à jour l'image si elle existe dans la base de données
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (key, value) => {
    setProfileData({ ...profileData, [key]: value });
    setIsModified(true);
  };

  const handleSave = async () => {
    try {
      await update(ref(db, 'users/' + uid), profileData);
      setSuccessMessage('Modifications enregistrées avec succès.');
      setIsModified(false);
      setModalVisible(true);
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate('Profile' ,{ userId: auth.currentUser.uid } )
  };

  const pickImage = async () => {
   
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission d\'accès à la galerie nécessaire pour choisir une image.');
        return;
      }
    

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleChange('pic', result.assets[0].uri); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderProfile title="Edit profile" />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {successMessage !== '' && <Text style={styles.successMessage}>{successMessage}</Text>}
        {profileData && (
          <>
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.profileImageContainer}>
                {image ? (
                  <ImageBackground source={{ uri: image }} style={styles.profileImage}>
                    <View style={styles.cameraIconContainer}>
                      <Image source={CameraIcon} style={styles.cameraIcon} />
                    </View>
                  </ImageBackground>
                ) : (
                  <View style={[styles.profileImage, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Add Photo</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.infoContainer}>
              <TouchableOpacity onPress={() => console.log("Modifier le nom")}>
                <Text style={styles.label}>First Name: </Text>
                <TextInput
                  style={styles.input}
                  value={profileData.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Modifier le nom")}>
                <Text style={styles.label}>Last Name: </Text>
                <TextInput
                  style={styles.input}
                  value={profileData.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Modifier le nom")}>
                <Text style={styles.label}>Username: </Text>
                <TextInput
                  style={styles.input}
                  value={profileData.username}
                  onChangeText={(text) => handleChange('username', text)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Modifier le nom")}>
                <Text style={styles.label}>Bio: </Text>
                <TextInput
                  style={styles.input}
                  value={profileData.bio}
                  onChangeText={(text) => handleChange('bio', text)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Modifier le nom")}>
                <Text style={styles.label}>Gender: </Text>
                <TextInput
                  style={styles.input}
                  value={profileData.gender}
                  onChangeText={(text) => handleChange('gender', text)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Modifier le nom")}>
                <Text style={styles.label}>Age: </Text>
                <TextInput
                  style={styles.input}
                  value={profileData.age}
                  onChangeText={(text) => handleChange('age', text)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Modifier le nom")}>
                <Text style={styles.label}>Country: </Text>
                <TextInput
                  style={styles.input}
                  value={profileData.country}
                  onChangeText={(text) => handleChange('country', text)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Modifier le nom")}>
                <Text style={styles.label}>City: </Text>
                <TextInput
                  style={styles.input}
                  value={profileData.city}
                  onChangeText={(text) => handleChange('city', text)}
                />
              </TouchableOpacity>
              {/* Ajoutez les autres champs de profil ici */}
            </View>
          </>
        )}
        {/* Le bouton est activé uniquement si des modifications sont apportées */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isModified ? '#0075FF' : '#ddd' }]}
          onPress={handleSave}
          disabled={!isModified} // Désactive le bouton si aucune modification n'est apportée
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <View style={styles.marge}>
        <TouchableOpacity onPress={() => navigation.navigate('ProfessionnalAccount')}>
          <Text style={styles.buttonTextpro}>Change to a professionnel account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallButton]} onPress={() => navigation.navigate('DeleteProfile')}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity></View>
      </ScrollView>
      {/* Pop-up de succès */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Modifications enregistrées avec succès.</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={closeModal}
            >
              <Text style={styles.textStyle}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 20,
    borderRadius: 60,
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    borderRadius: 20,
    padding: 5,
  },
  cameraIcon: {
    width: 40,
    height: 40,
  },
  infoContainer: {
    width: '100%',
    marginTop: 20, // Espacement ajouté
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10, // Espacement ajouté
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextpro:{
    color: '#0075FF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    backgroundColor: "#333",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  smallButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,   
  },
  marge: {
    marginTop: 50,
  }
});



export default EditProfile;