// Import des modules
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { getDatabase, ref, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from '../../Firebase';
import HeaderProfile from '../../heades/HeaderProfile';
import LikeButton from '../../reactions/LikeButton';
import CommentButton from '../../reactions/CommentButton';
import ShareButton from '../../reactions/ShareButton';
import SaveButton from '../../reactions/SaveButton';
import { useNavigation } from '@react-navigation/native';
import MapView , {Marker} from 'react-native-maps';

// Définition du composant
const PostDetails = ({ route }) => {
  const { idpub } = route.params;
  const [publicationData, setPublicationData] = useState(null);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [savedByCurrentUser, setSavedByCurrentUser] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showMapPopup, setShowMapPopup] = useState(false); // State pour contrôler l'affichage de la popup de la carte
  const db = getDatabase(app);
  const auth = getAuth(app);
  const uid = auth.currentUser.uid;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPublicationData = async () => {
      try {
        // Recherche de la publication correspondante dans la base de données
        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);
  
        usersSnapshot.forEach(user => {
          const userPublicationsRef = child(user.ref, 'publications');
          get(userPublicationsRef).then(publicationsSnapshot => {
            publicationsSnapshot.forEach(publication => {
              if (publication.key === idpub) {
                const publicationRef = ref(db, `users/${user.key}/publications/${publication.key}`);
                get(publicationRef).then(snapshot => {
                  if (snapshot.exists()) {
                    const data = snapshot.val();
                    setPublicationData(data);
  
                    // Vérifier si l'utilisateur actuel a aimé la publication
                    const likes = data.likes;
                    let liked = false;
                    if (likes) {
                      Object.values(likes).forEach(like => {
                        console.log(like)
                        if (like.uid === uid) {
                          liked = true;
                          
                        }
                      });
                    }
                    setLikedByCurrentUser(liked);
  
                    // Vérifier si l'utilisateur a sauvegardé cette publication
                    // Vous pouvez implémenter une logique similaire pour les sauvegardes si nécessaire
                  } else {
                    console.log('Publication data not found');
                  }
                }).catch(error => {
                  console.error('Error fetching publication data:', error);
                });
              }
            });
          });
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchPublicationData();
  }, [db, uid, idpub]);
  
  

  // Fonction de gestion des clics pour le bouton Comment
  const handleCommentPress = () => {
    navigation.navigate('Comment', { idpub: idpub });
  };

  // Fonction de gestion des clics pour le bouton Share
  const handleSharePress = () => {
    // Gérer le clic sur le bouton Share ici
  };

  // Fonction pour gérer le changement de texte dans le champ de commentaire
  const handleCommentInputChange = (text) => {
    setCommentInput(text);
  };

  // Fonction pour gérer l'envoi du commentaire
  const handleCommentSubmit = () => {
    // Vous pouvez ajouter ici la logique pour soumettre le commentaire à la base de données
    // Une fois que le commentaire est soumis, vous pouvez vider le champ de saisie
    setCommentInput('');
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <HeaderProfile title={'Post Details'} />
        {publicationData && (
          <View>
            <Image source={{ uri: publicationData.image }} style={styles.image} />
            <View style={styles.iconContainer}>
              <View style={styles.leftIcons}>
                <LikeButton publicationId={idpub} isLiked={likedByCurrentUser} />
                <CommentButton onPress={handleCommentPress} />
              </View>
              <View style={styles.rightIcons}>
                <ShareButton onPress={handleSharePress} />
                <SaveButton publicationId={idpub} isLiked={savedByCurrentUser} />
              </View>
            </View>
            {Object.entries(publicationData).map(([title, value], index) => {
              if (title !== 'image' && title !== 'date' && title !== 'likes' && title !== 'saves' && title !== 'comments' && title !== 'notifications'&& title !== 'location') {
                return (
                  <View key={title}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>{title}</Text>
                    </View>
                    {Object.entries(value).map(([subtitle, subtitleValue]) => (
                      <Text key={subtitle} style={styles.subtitle}>
                        {subtitleValue}
                      </Text>
                    ))}
                    {index !== Object.keys(publicationData).length - 2 && <View style={styles.line} />}
                  </View>
                );
              } else {
                return null;
              }
            })}
          </View>
        )}
        {publicationData && publicationData.location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: publicationData.location.latitude,
              longitude: publicationData.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: publicationData.location.latitude,
                longitude: publicationData.location.longitude,
              }}
              title="Milieu naturel"
              description="Localisation du milieu naturel"
            />
          </MapView>
        )}
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={commentInput}
          onChangeText={handleCommentInputChange}
        />
        <TouchableOpacity onPress={handleCommentSubmit}>
          <Text style={styles.submitButton}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  titleContainer: {
    backgroundColor: '#E76654',
    alignSelf: 'flex-start',
    borderRadius: 15,
    paddingHorizontal: 7,
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 20,
  },
  line: {
    height: 1,
    backgroundColor: '#000',
    opacity: 0.5,
    marginVertical: 7,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(209, 195, 195, 0.3)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(209, 195, 195, 0.3)',
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: 'rgba(209, 195, 195, 0.3)',
  },
  submitButton: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    height: 200,
    marginTop: 10,
    borderRadius: 15, // Ajout du border radius
  },
});

export default PostDetails;