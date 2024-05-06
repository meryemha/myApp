import React, { useState, useRef } from 'react';
import { View, Button, StyleSheet, Dimensions, Animated, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFonts, IrishGrover_400Regular } from '@expo-google-fonts/irish-grover';

const EntryPage = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;
  let [fontsLoaded] = useFonts({
    IrishGrover_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Attendre que les polices de caractères soient chargées
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave</Text>
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          loop={true}
          source={require('../assets/Leave.json')}
          style={[styles.animation, { width: screenWidth }]}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <Button
            title="Register"
            onPress={() => navigation.navigate('Register')}
            color="#27B92D" // Couleur personnalisée pour le bouton Register
          />
        </View>
        <View style={{ marginHorizontal: 20 }}></View>
        <View style={styles.buttonContainer}>
          <Button
            title="Log in"
            onPress={() => navigation.navigate('Login')}
            color="#27B92D" 
            
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Couleur de fond personnalisée
  },
  title: {
    fontSize: 45, // Taille de police plus grande
    fontFamily: 'IrishGrover_400Regular',
    fontWeight: 'bold',
    color: '#27B92D', // Couleur verte pour le titre
    marginTop: 20, // Marge en haut du titre
    marginBottom: 10, // Marge en bas du titre
  },
  
  animationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  animation: {
    height: 300,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 5,
    right: 5,
    flexDirection: 'row', // Pour aligner les boutons horizontalement
    justifyContent: 'center', // Pour centrer les boutons horizontalement
  },
  buttonContainer: {
    marginHorizontal: 10,
  },
});

export default EntryPage;
