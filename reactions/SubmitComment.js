import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, push, get, child, serverTimestamp, set } from 'firebase/database';
import { app } from '../Firebase';
import { getAuth } from 'firebase/auth';

const SubmitButton = ({ commentInput, publicationId, onCommentSubmit }) => {
  const handleSubmitComment = async () => {
    const db = getDatabase(app);
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;
    const timestamp = serverTimestamp();

    try {
      const usersRef = ref(db, 'users');
      const usersSnapshot = await get(usersRef);

      usersSnapshot.forEach(user => {
        const userPublicationsRef = child(user.ref, 'publications');
        get(userPublicationsRef).then(publicationsSnapshot => {
          publicationsSnapshot.forEach(publication => {
            if (publication.key === publicationId) {
              const commentsRef = child(publication.ref, 'comments');
              const newCommentRef = push(commentsRef, {
                uid: uid,
                comment: commentInput,
                date: timestamp
              });

              const notificationsRef = ref(db, `users/${uid}/publications/${publication.key}/notifications`);
              get(notificationsRef).then(notificationsSnapshot => {
                if (!notificationsSnapshot.exists()) {
                  set(ref(db, `users/${user.key}/publications/${publication.key}/notifications/${newCommentRef.key}`), {
                    title: 'comment',
                    commentId: newCommentRef.key
                  });
                } else {
                  set(ref(db, `users/${user.key}/publications/${publication.key}/notifications/${newCommentRef.key}`), {
                    title: 'comment',
                    commentId: newCommentRef.key
                  });
                }
              });
            }
          });
        });
      });

      onCommentSubmit();
      console.log('comment');
       // Appeler la fonction de gestion de la soumission du commentaire
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleSubmitComment}>
      <Text style={styles.submitButton}>Submit</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default SubmitButton;
