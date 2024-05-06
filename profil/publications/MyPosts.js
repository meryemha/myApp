import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from '../../Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import HeaderProfile from '../../heades/HeaderProfile';

const MyPosts = () => {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [publicationIds, setPublicationIds] = useState([]);
  const [publicationImages, setPublicationImages] = useState([]);
  const [publicationDates, setPublicationDates] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState(null);
  const db = getDatabase(app);
  const auth = getAuth(app);
  const uid = auth.currentUser.uid;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = ref(db, 'users/' + uid);
      const publicationRef = ref(db, 'users/' + uid + '/publications');

      try {
        const snapshotUser = await get(userRef);
        const snapshotPublications = await get(publicationRef);

        if (snapshotUser.exists()) {
          const userData = snapshotUser.val();
          setUsername(userData.username);
          setProfilePic(userData.pic);
        } else {
          console.log('User data not found');
        }

        if (snapshotPublications.exists()) {
          const publicationData = snapshotPublications.val();
          const ids = Object.keys(publicationData).map((key) => {
            return { id: key, ...publicationData[key] };
          });
          setPublicationIds(ids);

          // Récupérer les noms de chaque image de publication et les dates
          const promises = ids.map(async ({ id }) => {
            const imageRef = ref(db, `users/${uid}/publications/${id}/image`);
            const dateRef = ref(db, `users/${uid}/publications/${id}/date`);
            const imageSnapshot = await get(imageRef);
            const dateSnapshot = await get(dateRef);
            const imageUri = imageSnapshot.exists() ? imageSnapshot.val() : null;
            const timestamp = dateSnapshot.exists() ? dateSnapshot.val() : null;
            const formattedDate = formatTimestamp(timestamp);
            return {
              id: id,
              imageUri: imageUri,
              date: formattedDate,
            };
          });
          Promise.all(promises).then((results) => {
            const images = results.map(result => result.imageUri);
            const dates = results.map(result => result.date);
            setPublicationImages(images);
            setPublicationDates(dates);
          });
        } else {
          console.log('User publications not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [uid]);

  // Fonction pour formater la date
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Les mois commencent à partir de 0, donc on ajoute 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const goToProfile = () => {
    navigation.navigate('Profil'); // Naviguer vers le fichier Profil.js
  };

  const handleOptionsPress = (publicationId) => {
    setSelectedPublicationId(publicationId);
    setShowOptions(true);
  };

  const handleEditPublication = () => {
    // Naviguer vers ModifyPost.js en passant l'id de la publication sélectionnée comme paramètre
    navigation.navigate('ModifyPost', { idpub: selectedPublicationId });
    setShowOptions(false);
  };

  const handleDeletePublication = async () => {
    // Afficher une alerte de confirmation de suppression
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette publication ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              // Supprimer la publication de la base de données
              const publicationRef = ref(db, `users/${uid}/publications/${selectedPublicationId}`);
              await remove(publicationRef);
              console.log('Publication supprimée avec succès');
  
              // Naviguer vers "Mes Publications"
              navigation.navigate('ProfileModal');
  
              // Cacher les options
              setShowOptions(false);
            } catch (error) {
              console.error('Erreur lors de la suppression de la publication :', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const goToAddPost = () => {
    navigation.navigate('AddPost');
  };

  const closeModal = () => {
    setShowOptions(false);
  };
  
  const handleImagePress = (publicationId) => {
    // Naviguer vers PostDetails.js en passant l'id de la publication sélectionnée comme paramètre
    navigation.navigate('PostDetails', { idpub: publicationId });
  };

  return (
    <View style={styles.container}>
      <HeaderProfile title={'My Posts'} />
      <TouchableOpacity style={styles.addIconContainer} onPress={goToAddPost}>
        <Image source={require('../../assets/Add.png')} style={styles.addIcon} />
      </TouchableOpacity>
      
      <ScrollView>
        {publicationIds.map(({ id }, index) => (
          <TouchableOpacity key={id} style={styles.publicationItem} onPress={() => handleImagePress(id)}>
            {publicationImages[index] && (
              <View>
                <Image
                  source={{ uri: publicationImages[index] }}
                  style={styles.publicationImage}
                />
                <View style={styles.overlay}>
                  <TouchableOpacity style={styles.profileInfo} onPress={goToProfile}>
                    <Image
                      source={{ uri: profilePic }}
                      style={styles.profilePicOverlay}
                    />
                    <Text style={styles.usernameOverlay} onPress={goToProfile}>{username}</Text>
                  </TouchableOpacity>
                  <Text style={styles.dateOverlay}>{publicationDates[index]}</Text>
                </View>
                <TouchableOpacity style={styles.pointContainer} onPress={() => handleOptionsPress(id)}>
                  <Image
                    source={require('../../assets/Point.png')}
                    style={styles.pointIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
  visible={showOptions}
  animationType="slide"
  transparent={true}
  onRequestClose={closeModal}
>
  <Pressable style={styles.modalBackground} onPress={closeModal}>
    <View style={styles.modalContent}>
      <View style={styles.optionContainer}>
        <Pressable onPress={handleEditPublication} style={styles.optionButton}>
          <Text style={styles.optionText}>Modifier la publication</Text>
        </Pressable>
        <Pressable onPress={handleEditPublication}>
      <Image source={require('../../assets/Arrow.png')} style={styles.arrowIcon} />
    </Pressable>
      </View>
      <View style={styles.optionContainer}>
        <Pressable onPress={handleDeletePublication} style={styles.optionButton}>
          <Text style={styles.optionText}>Supprimer la publication</Text>
        </Pressable>
        <Pressable onPress={handleDeletePublication}>
      <Image source={require('../../assets/Arrow.png')} style={styles.arrowIcon} />
    </Pressable>
      </View>
    </View>
  </Pressable>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    flex: 1,
  },
  publicationItem: {
    marginBottom: 5,
    marginTop: 5,
  },
  publicationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    padding: 15,
    flexDirection: 'row',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicOverlay: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  usernameOverlay: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateOverlay: {
    color: '#fff',
    position: 'absolute',
    top: 22,
    right: 10,
  },
  pointContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  pointIcon: {
    width: 20,
    height: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    elevation: 30,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButton: {
    marginRight: 10,
  },
  arrowIcon: {
    width: 15,
    height: 15,
    marginBottom: 7,
    marginLeft: 10,
  },
  optionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  addIconContainer: {
    position: 'absolute',
    top: 70,
    right: 10,
    zIndex: 1,
  },
  addIcon: {
    width: 30,
    height: 30,
  },
});

export default MyPosts;
