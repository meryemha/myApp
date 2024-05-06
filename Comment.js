import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableOpacity } from 'react-native';
import { getDatabase, ref, get, child, update } from 'firebase/database';
import { app } from './Firebase';
import Header from './heades/Header';
import LikeButton from './reactions/LikeButton';
import SaveButton from './reactions/SaveButton';
import ShareButton from './reactions/ShareButton';
import SubmitButton from './reactions/SubmitComment';
import { getAuth } from 'firebase/auth';

const Comment = ({ route }) => {
  const { idpub } = route.params;
  const [comments, setComments] = useState([]);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const db = getDatabase(app);
  const auth = getAuth(app);
  const uid = auth.currentUser.uid;

  
    const fetchPublicationData = async () => {
      try {
        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);

        usersSnapshot.forEach(user => {
          const userPublicationsRef = child(user.ref, 'publications');
          get(userPublicationsRef).then(publicationsSnapshot => {
            publicationsSnapshot.forEach(publication => {
              if (publication.key === idpub) {
                const commentsRef = child(publication.ref, 'comments');
                const imageRef = child(publication.ref, 'image');
                get(imageRef).then(imageSnapshot => {
                  const imageURL = imageSnapshot.val();
                  setImage(imageURL);
                  console.log('yes image wa wa wa)')
                }).catch(error => {
                  console.error('Error fetching image:', error);
                });

                get(commentsRef).then(commentsSnapshot => {
                  const commentsData = [];
                  const imagesData = [];
                  commentsSnapshot.forEach(comment => {
                    const commentData = comment.val();
                    commentsData.push(commentData);
                    const uidcomment = commentData.uid;
                    const userPicRef = ref(db, `users/${uidcomment}/pic`);
                    const userNameRef = ref(db, `users/${uidcomment}/username`);
                    Promise.all([get(userPicRef), get(userNameRef)]).then(([picSnapshot, nameSnapshot]) => {
                      const picURL = picSnapshot.val();
                      const userName = nameSnapshot.val();
                      imagesData.push({ picURL, userName });
                      setImages([...imagesData]);
                    }).catch(error => {
                      console.error('Error fetching user data:', error);
                    });
                  });
                  setComments(commentsData);
                }).catch(error => {
                  console.error('Error fetching comments:', error);
                });

                
              }
            });
          });
        });
      } catch (error) {
        console.error('Error fetching publication data:', error);
      }
    };
    useEffect(() => {
    fetchPublicationData();
  }, [db, idpub]);

  const handleSharePress = () => {
    // Gérer le clic sur le bouton Share ici
  };

  const handleCommentInputChange = (text) => {
    setCommentInput(text);
  };

  const handleLikePress = (commentId) => {
    // Mettre à jour l'icône et la liste des likes dans la base de données
    const commentRef = ref(db, `publications/${idpub}/comments/${commentId}`);
    update(commentRef, {
      likes: {
        // Si l'utilisateur existe déjà dans la liste des likes, le supprimer
        [uid]: comments[commentId].likes && comments[commentId].likes[uid] ? null : true,
      }
    });
  };

  const handleCommentSubmit = () => {
    // Logique pour soumettre le commentaire à la base de données
    // Ajoutez ici la logique pour ajouter le commentaire à la liste des commentaires dans la base de données
    // Assurez-vous de vider le champ de saisie après la soumission du commentaire
    setCommentInput('');
  };

  const handleRefresh = () => {
    fetchPublicationData(); // Appeler la fonction pour recharger les publications
  };

  return (
    <View style={styles.container}>
      <Header isHomePage={false} onRefreshHome={handleRefresh} />
      <ScrollView>
        {/* Image de la publication */}
        {image && <Image source={{ uri: image }} style={styles.image} />}

        {/* Icônes Like, Share et Save */}
        <View style={styles.iconContainer}>
          <LikeButton publicationId={idpub} />
          <View style={styles.rightIcons}>
            <ShareButton onPress={handleSharePress} />
            <SaveButton publicationId={idpub} />
          </View>
        </View>

        {/* Commentaires */}
        <ScrollView style={styles.commentsContainer}>
          {comments.length > 0 ? (
            <>
              {comments.map((comment, index) => (
                <View key={index} style={styles.commentContainer}>
                  <View style={styles.commentHeader}>
                    <Image source={{ uri: images[index]?.picURL }} style={styles.userImage} />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{images[index]?.userName}</Text>
                      <Text style={styles.commentDate}>{formatDate(comment.date)}</Text>
                    </View>
                  </View>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleLikePress(index)}>
                    <Image source={comment.likes && comment.likes[uid] ? require('./assets/redheart.png') : require('./assets/Heart.png')} style={styles.HeartIcon} />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.commentText}>No comments found.</Text>
          )}
        </ScrollView>

        {/* Partie Input Commentaire */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={commentInput}
            onChangeText={handleCommentInputChange}
          />
          <SubmitButton
            commentInput={commentInput}
            publicationId={idpub}
            onCommentSubmit={handleCommentSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Fonction pour formater la date au format 'dd/mm/yyyy'
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const styles = StyleSheet.create({
  
  image: {
    height: 200,
    marginBottom: 10,
    borderRadius: 15,
    marginRight:5,
    marginLeft:5
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(209, 195, 195, 0.3)',
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  commentsContainer: {
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#D1C3C3',
    borderRadius: 15
  },
  commentContainer: {
    borderRadius: 15,
    padding: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
  },
  commentContent: {
    marginLeft: 50,
    backgroundColor: '#ffff',
    borderRadius: 15,
    paddingLeft: 10
  },
  commentText: {
    fontSize: 18,
    marginBottom: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20, // Ajout de marge supérieure
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
  HeartIcon: {
    width: 25,
    height: 25,
  },
});

export default Comment;
