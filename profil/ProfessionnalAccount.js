import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useFonts, IrishGrover_400Regular } from '@expo-google-fonts/irish-grover';

const ProfessionalAccount = ({ navigation }) => {
    let [fontsLoaded] = useFonts({
        IrishGrover_400Regular,
      });
    
      if (!fontsLoaded) {
        return <Text>Loading...</Text>; // Attendre que les polices de caractères soient chargées
      }

  const handleLeavePress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professional Account</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          This feature is not yet configured, but it will be available upon request.
        </Text>
        <Text style={styles.description}>
          We understand that each business has unique needs and considerations regarding data privacy,
          access permissions, and audience. Therefore, we aim to tailor our solutions to meet your specific requirements.
        </Text>
        <Text style={styles.description}>
          Whether you require restricted access for authorized employees or wish to make certain data public,
          we are committed to accommodating your organization's preferences.
        </Text>
      </View>
      
      <Text style={styles.contact}>
        For more information or to request the activation of the Professional Account feature,
        please contact our support team at support@leave.com.
      </Text>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeavePress}>
          <Text style={styles.leaveButtonText}>Leave</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    justifyContent: 'space-between', // Aligner les éléments verticalement vers le bas
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4373BB',
    marginTop: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  contact: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20, // Marge en bas du footer
  },
  leaveButton: {
    backgroundColor: '#27B92D',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  leaveButtonText: {
    fontSize: 30,
    fontFamily: 'IrishGrover_400Regular',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default ProfessionalAccount;
