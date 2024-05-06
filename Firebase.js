// Import the functions you need from the SDKs you need
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc8ciyJf-4E8pmSLsAtdECu7wzllBSrXo",
  authDomain: "leave-b68a2.firebaseapp.com",
  databaseURL: "https://leave-b68a2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leave-b68a2",
  storageBucket: "leave-b68a2.appspot.com",
  messagingSenderId: "346079082891",
  appId: "1:346079082891:web:9d694b134360e991fd978e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage for state persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const updateProfileData = async (uid, newData) => {
  const db = getDatabase(app);
  const userRef = ref(db, 'users/' + uid);

  try {
    await update(userRef, newData);
    console.log('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export { app };