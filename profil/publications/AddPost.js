import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import HeaderProfile from '../../heades/HeaderProfile';
import { getDatabase, ref, update, push, serverTimestamp } from 'firebase/database';
import { app } from '../../Firebase';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const AddPost = () => {
  const [image, setImage] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false); // State to track whether location is fetched
  const db = getDatabase(app);
  const auth = getAuth(app);
  const uid = auth.currentUser.uid;
  const navigation = useNavigation();

  // Fonction pour choisir une image depuis la galerie
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission refusée pour accéder à la galerie.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);      
    }
  };

  // Fonction pour obtenir la localisation actuelle
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied to access location.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      setLocationFetched(true); // Set locationFetched to true when location is successfully fetched
      console.log('yes',currentLocation);
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'An error occurred while fetching the location.');
    }
  };

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { title: 'Title', inputs: [''] }]);
  };

  const handleAddInput = (index) => {
    const updatedFields = [...customFields];
    updatedFields[index].inputs.push('');
    setCustomFields(updatedFields);
  };

  const handleInputChange = (fieldIndex, inputIndex, text) => {
    const updatedFields = [...customFields];
    updatedFields[fieldIndex].inputs[inputIndex] = text;
    setCustomFields(updatedFields);
  };

  const handleDeleteInput = (fieldIndex, inputIndex) => {
    const updatedFields = [...customFields];
    updatedFields[fieldIndex].inputs.splice(inputIndex, 1);
    setCustomFields(updatedFields);
  };
  
  const handleDeleteTitle = (fieldIndex) => {
    const updatedFields = [...customFields];
    updatedFields.splice(fieldIndex, 1);
    setCustomFields(updatedFields);
  };
  const handleEditTitle = (fieldIndex, text) => {
    const updatedFields = [...customFields];
    updatedFields[fieldIndex].title = text;
    setCustomFields(updatedFields);
  };

  const handlePublish = async () => {
    if (image || customFields.length > 0) {
      try {
        const publicationRef = ref(db, 'users/' + uid + '/publications');
        const newPublicationRef = push(publicationRef);

        const publicationData = {};

        if (image) {
          publicationData.image = image;
        }

        if (customFields.length > 0) {
          customFields.forEach((field, index) => {
            publicationData[field.title] = field.inputs;
          });
        }

        publicationData.date = serverTimestamp();

        if (currentLocation) {
          publicationData.location = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          };
        }

        await update(newPublicationRef, publicationData);

        navigation.navigate('MyPosts');
      } catch (error) {
        console.error('Error publishing:', error);
        Alert.alert('Erreur', 'Une erreur s\'est produite lors de la publication.');
      }
    } else {
      Alert.alert('Aucune modification', 'Vous n\'avez ajouté aucune modification à publier.');
    }
  };

  return (
    <View style={styles.container}>
      <HeaderProfile title="Add Post" />
      <View style={styles.body}>
        <ScrollView>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Add a Picture</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <TouchableOpacity style={styles.button} onPress={handleAddCustomField}>
            <Text style={styles.buttonText}>Add a Title</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
            <Text style={styles.buttonText}>Add Location</Text>
          </TouchableOpacity>
          {locationFetched && <Text style={styles.locationText}>Coordinates fetched successfully!</Text>}
          {customFields.map((field, fieldIndex) => (
            <View key={fieldIndex} style={styles.titleContainer}>
              <View style={styles.titleWrapper}>
                <TextInput
                  style={styles.fieldInput}
                  value={field.title}
                  onChangeText={(text) => handleEditTitle(fieldIndex, text)}
                />
                <TouchableOpacity style={styles.XButton} onPress={() => handleDeleteTitle(fieldIndex)}>
                  <Image source={require('../../assets/X.png')} style={styles.deleteButton} />
                </TouchableOpacity>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.iconButton} onPress={() => handleAddInput(fieldIndex)}>
                    <Image source={require('../../assets/Add.png')} style={styles.Addicon} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton} onPress={() => handleDeleteInput(fieldIndex, field.inputs.length - 1)}>
                    <Image source={require('../../assets/Delete.png')} style={styles.Deleteicon} />
                  </TouchableOpacity>
                </View>
              </View>
              {field.inputs.map((input, inputIndex) => (
                <TextInput
                  key={inputIndex}
                  style={styles.input}
                  placeholder={`Entrez votre texte`}
                  value={input}
                  onChangeText={(text) => handleInputChange(fieldIndex, inputIndex, text)}
                />
              ))}
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={handlePublish}>
            <Text style={styles.buttonText}>Publish</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: 20,
    flex: 1,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleContainer: {
    marginBottom: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  fieldInput: {
    backgroundColor: '#E76654',
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontWeight: 'bold',
    marginRight: 10,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  iconButton: {
    alignItems: 'center',
    marginRight: 10,
  },
  XButton: {    
    marginRight: 110,
  },
  Addicon: {
    width: 30,
    height: 30,
  },
  Deleteicon: {
    width: 23,
    height: 23,
    marginLeft: 5,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 15,
  },
  deleteButton: {
    width: 15,
    height: 15,
  },
  disabledButton: {
    backgroundColor: '#999', 
  },
  locationText: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AddPost;
