// LikeButton.js
import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getDatabase, ref, update, serverTimestamp, push, remove, get, child, set } from 'firebase/database';
import { app } from '../Firebase';
import { getAuth } from 'firebase/auth';

const LikeButton = ({ publicationId, isLiked }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeId, setLikeId] = useState(null);
  const db = getDatabase(app);
  const auth = getAuth(app);
  const uid = auth.currentUser.uid;

  const handleLikePress = async () => {
    try {
      const usersRef = ref(db, 'users');
      const usersSnapshot = await get(usersRef);

      usersSnapshot.forEach(user => {
        const userPublicationsRef = child(user.ref, 'publications');
        get(userPublicationsRef).then(publicationsSnapshot => {
          publicationsSnapshot.forEach(publication => {
            if (publication.key === publicationId) {
              const publicationLikesRef = ref(db, `users/${user.key}/publications/${publicationId}/likes`);
              const timestamp = serverTimestamp();

              if (!liked) {
                const newLikeRef = push(publicationLikesRef); // Générer une nouvelle référence pour le like
                update(newLikeRef, {
                  uid: uid,
                  publicationId: publicationId,
                  date: timestamp
                });

                // Stocker l'ID du like ajouté
                setLikeId(newLikeRef.key);

                // Ajouter la notification
                const notificationsRef = ref(db, `users/${user.key}/publications/${publicationId}/notifications`);
                const newNotificationRef = push(notificationsRef);
                set(newNotificationRef, {
                  title: 'like',
                  likeId: newLikeRef.key
                });
              } else {
                if (likeId) {
                  // Si on a l'ID du like, on peut le supprimer
                  remove(ref(db, `users/${user.key}/publications/${publicationId}/likes/${likeId}`));
                  setLikeId(null);
                }
              }
            }
          })
        })
      })

      setLiked(!liked);
    } catch (error) {
      console.error('Error liking publication:', error);
    }

  };

  return (
    <TouchableOpacity onPress={handleLikePress}>
      <Image source={liked ? require('../assets/redheart.png') : require('../assets/Heart.png')} style={styles.Hearticon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Hearticon: {
    width: 30,
    height: 30,
  },
});

export default LikeButton;
