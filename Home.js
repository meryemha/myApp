import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { getDatabase, ref, get, child } from 'firebase/database';
import { app } from './Firebase';
import Header from './heades/Header';
import { useNavigation } from '@react-navigation/native';
import LikeButton from './reactions/LikeButton';
import CommentButton from './reactions/CommentButton';
import ShareButton from './reactions/ShareButton';
import SaveButton from './reactions/SaveButton';
import SubmitButton from './reactions/SubmitComment';

const Home = () => {
  const [publications, setPublications] = useState([]);
  const [commentInput, setCommentInput] = useState(''); 
  const db = getDatabase(app);
  const navigation = useNavigation();

  // Fonction pour charger les publications
  const loadPublications = async () => {
    try {
      const usersRef = ref(db, 'users');
      const usersSnapshot = await get(usersRef);
      const allPublications = [];
      
      const promises = [];

      usersSnapshot.forEach(user => {
        const userPublicationsRef = child(user.ref, 'publications');
        const promise = get(userPublicationsRef).then(publicationsSnapshot => {
          publicationsSnapshot.forEach(publication => {
            const publicationData = {
              userId: user.key,
              userName: user.val().username,
              userProfilePic: user.val().pic,
              publicationId: publication.key,
              image: publication.val().image,
              date: formatDate(publication.val().date)
            };
            allPublications.push(publicationData);
          });
        });
        promises.push(promise);
      });

      await Promise.all(promises);

      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      setPublications(shuffleArray(allPublications));
      
    } catch (error) {
      console.error('Error loading publications:', error);
    }
  };

  useEffect(() => {
    loadPublications();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleImagePress = (publicationId) => {
    navigation.navigate('PostDetails', { idpub: publicationId });
  };

  const handleProfilePress = (userId) => {
    navigation.navigate('Profile', { userId: userId });
  };

  const handleCommentInputChange = (text) => {
    setCommentInput(text);
  };

  const handleCommentSubmit = () => {
    setCommentInput('');
  };

  const handleRefresh = () => {
    loadPublications(); // Appeler la fonction pour recharger les publications
  };

  const handleCommentButtonPress = (publicationId) => {
    navigation.navigate('Comment', { publicationId: publicationId });
  };



  return (
    <View style={styles.container}>
      <Header isHomePage={true} onRefreshHome={handleRefresh} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>
        {publications.map((publication, index) => (
          <TouchableOpacity key={index} onPress={() => handleImagePress(publication.publicationId)}>
            <View style={styles.publicationContainer}>
              <View style={styles.userInfo}>
              <TouchableOpacity onPress={() => handleProfilePress(publication.userId)}>
                  <Image source={{ uri: publication.userProfilePic }} style={styles.profilePic} />
                </TouchableOpacity>
                <Text style={styles.userName}>{publication.userName}</Text>
                <Text style={styles.date}>{publication.date}</Text>
              </View>
              <Image source={{ uri: publication.image }} style={styles.image} />
              <View style={styles.iconContainer}>
                <View style={styles.leftIcons}>
                  <LikeButton publicationId={publication.publicationId} />
                </View>
                <View style={styles.rightIcons}>
                  <ShareButton />
                  <SaveButton publicationId={publication.publicationId} />
                </View>
              </View>
              <View style={styles.commentInputContainer}>
                <TextInput 
                  style={styles.commentInput} 
                  placeholder="Write a comment..." 
                  value={commentInput} // Utiliser la valeur de l'état pour le champ de saisie
                  onChangeText={handleCommentInputChange} // Gérer le changement de la valeur du champ de saisie
                />
                <SubmitButton 
                  publicationId={publication.publicationId} 
                  commentInput={commentInput} 
                  onCommentSubmit={handleCommentSubmit} // Passer la fonction de gestion de la soumission du commentaire
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  publicationContainer: {
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginLeft: 'auto',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
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
});

export default Home;
