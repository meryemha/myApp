import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getDatabase, ref, update, get } from 'firebase/database';
import { app } from '../Firebase';
import { getAuth } from 'firebase/auth';

const SaveButton = ({ publicationId, isSaved }) => {
  const [username, setUsername] = useState('');
  const [saved, setSaved] = useState(isSaved);
  const db = getDatabase(app);
  const auth = getAuth(app);
  const uid = auth.currentUser.uid;

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const snapshot = await get(ref(db, `users/${uid}/username`));
        if (snapshot.exists()) {
          setUsername(snapshot.val());
        } else {
          console.log('Username not found');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [db, uid]);

  const handleSavePress = async () => {
    try {
      const publicationRef = ref(db, `users/${uid}/publications/${publicationId}`);
      if (saved) {
        await removeFromSaves(publicationRef, uid);
      } else {
        await addToSaves(publicationRef, uid);
      }
      setSaved(!saved);
    } catch (error) {
      console.error('Error saving publication:', error);
    }
  };

  const addToSaves = async (publicationRef, uid) => {
    try {
      const snapshot = await get(publicationRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const saves = data.saves || [];
        saves.push(uid);
        await update(publicationRef, { saves });
      }
    } catch (error) {
      console.error('Error adding to saves:', error);
    }
  };

  const removeFromSaves = async (publicationRef, uid) => {
    try {
      const snapshot = await get(publicationRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const saves = data.saves || [];
        const updatedSaves = saves.filter((user) => user !== uid); // Retirer le nom d'utilisateur de la liste des sauvegardes
        await update(publicationRef, { saves: updatedSaves });
      }
    } catch (error) {
      console.error('Error removing from saves:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleSavePress}>
      <Image source={saved ? require('../assets/blacksave.png') : require('../assets/Save.png')} style={styles.Saveicon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Saveicon: {
    width: 40,
    height: 40,
  },
});

export default SaveButton;
