import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { getDatabase, ref, get, update, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from '../../Firebase';
import HeaderProfile from '../../heades/HeaderProfile';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const ModifyPost = ({ route }) => {
    const { idpub } = route.params;
    const [publicationData, setPublicationData] = useState(null);
    const [publicationImage, setPublicationImage] = useState(null);
    const [originalPublicationData, setOriginalPublicationData] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigation = useNavigation();
    const db = getDatabase(app);
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;

    useEffect(() => {
        const fetchPublicationData = async () => {
            const publicationRef = ref(db, `users/${uid}/publications/${idpub}`);
            try {
                const snapshot = await get(publicationRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setPublicationData(data);
                    setOriginalPublicationData(data);
                    setPublicationImage(data.image);
                } else {
                    console.log('Publication data not found');
                }
            } catch (error) {
                console.error('Error fetching publication data:', error);
            }
        };

        fetchPublicationData();
    }, [db, uid, idpub]);

    const handleTitleChange = (oldTitle, newTitle) => {
        const updatedData = {};
        Object.entries(publicationData).forEach(([title, value]) => {
            if (title === oldTitle) {
                updatedData[newTitle] = value;
            } else {
                updatedData[title] = value;
            }
        });
        setPublicationData(updatedData);
    };

    const handleSubtitleChange = (title, subtitle, newValue) => {
        setPublicationData(prevData => ({
            ...prevData,
            [title]: {
                ...prevData[title],
                [subtitle]: newValue ? newValue.trim() : '' // Check if newValue is not undefined before calling trim
            }
        }));
    };
    

    const handleAddInput = (title) => {
        setPublicationData(prevData => ({
            ...prevData,
            [title]: {
                ...prevData[title],
                [`input_${Date.now()}`]: ''
            }
        }));
    };

    const handleDeleteInput = (title, subtitle) => {
        const updatedData = { ...publicationData };
        delete updatedData[title][subtitle];
        setPublicationData(updatedData);
    };

    const handleDeleteTitle = (title) => {
        const updatedData = { ...publicationData };
        delete updatedData[title];
        setPublicationData(updatedData);
    };
    const handleInsertTitle = () => {
        setPublicationData(prevData => ({
            ...prevData,
            [`titre`]: { subtitle1: '' } 
        }));
    };

    const saveChanges = async () => {
        // Vérifier si un titre ou un sous-titre est vide
        const isEmpty = Object.entries(publicationData).some(([title, value]) => {
            if (title.trim() === '') return true; // Vérifier si le titre est vide
            return Object.values(value).some(subtitleValue => {if (typeof subtitleValue === 'string') {
                return subtitleValue === '';
            } else {
                return false;
            }}); // Vérifier si un sous-titre est vide
        });
    
        // Si un titre ou un sous-titre est vide, afficher une erreur et ne pas sauvegarder les modifications
        if (isEmpty) {
            Alert.alert('Veuillez tout remplir avant de sauvegarder.');
            return;
        }
    
        // Afficher une boîte de dialogue de confirmation avant de sauvegarder les modifications
        Alert.alert(
            'Confirmer',
            'Êtes-vous sûr de vouloir sauvegarder les modifications ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Confirmer',
                    onPress: async () => {
                        try {
                            const publicationRef = ref(db, `users/${uid}/publications/${idpub}`);
                            await set(publicationRef, publicationData);
                            console.log('Changes saved successfully');
                            setShowSuccessMessage(true);
                        } catch (error) {
                            console.error('Error saving changes:', error);
                        }
                    }
                }
            ]
        );
    };
    
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission d\'accès à la galerie nécessaire pour choisir une image.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setPublicationImage(result.assets[0].uri);
        }
    };

    const handleDismissSuccessMessage = () => {
        setShowSuccessMessage(false);
        navigation.navigate('ProfileModal');
    };

    if (!publicationData) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <HeaderProfile title='Modify Post' />
            <View style={styles.profileImageContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <ImageBackground source={{ uri: publicationImage }} style={styles.publicationImage}>
                        <View style={styles.cameraIconContainer}>
                            <Image source={require('../../assets/Camera.png')} style={styles.cameraIcon} />
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleInsertTitle} style={styles.insertTitleButton}>
                <Text style={styles.insertTitleButtonText}>Insérer un titre</Text>
            </TouchableOpacity>
            {Object.entries(publicationData).map(([title, value], index) => {
                if (title !== 'image' && title !== 'date'&& title !== 'likes'&& title !== 'saves'&& title !== 'notifications'&& title !== 'comments') {
                    return (
                        <View key={index} style={styles.infoContainer}>
                            <View style={styles.titleWrapper}>
                                <View style={styles.titleRow}>
                                    <TextInput
                                        style={[styles.titleInput, title.trim() === '' ? styles.titleInputEmpty : null]}
                                        value={title}
                                        onChangeText={newValue => handleTitleChange(title, newValue)}
                                    />
                                </View>
                                <View style={styles.buttonsContainer}>
                                    <TouchableOpacity onPress={() => handleDeleteTitle(title)}>
                                        <Image source={require('../../assets/Delete.png')} style={styles.Deleteicon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleAddInput(title)}>
                                        <Image source={require('../../assets/Add.png')} style={styles.Addicon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {Object.entries(value).map(([subtitle, subtitleValue], subIndex) => (
                                <View key={subIndex} style={styles.subtitleWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        value={subtitleValue.toString()}
                                        onChangeText={newValue => handleSubtitleChange(title, subtitle, newValue)}
                                    />
                                    <TouchableOpacity onPress={() => handleDeleteInput(title, subtitle)}>
                                        <Image source={require('../../assets/X.png')} style={styles.deleteButton} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    );
                } else {
                    return null; // Ne pas afficher les titres "image" et "date"
                }
            })}
            <View style={styles.saveButtonContainer}>
                <Button title="Save Changes" onPress={saveChanges} />
            </View>
            {showSuccessMessage && (
                <View style={styles.successMessageContainer}>
                    <Text style={styles.successMessage}>Modifications sauvegardées avec succès !</Text>
                    <TouchableOpacity onPress={handleDismissSuccessMessage}>
                        <Text style={styles.closeButton}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 20,
    },
    container: {
        flex: 1,
        margin: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    publicationImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageContainer: {
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
        marginLeft: 10,
        marginRight: 10,
    },
    cameraIconContainer: {
        bottom: 10,
        right: 10,
    },
    cameraIcon: {
        width: 40,
        height: 40,
    },
    infoContainer: {
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    titleInput: {
        backgroundColor: '#E76654',
        color: 'black',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        fontWeight: 'bold',
        marginRight: 10,

    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subtitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ajout de justifyContent
    },
    deleteButton: {
        width: 15,
        height: 15,
        marginRight: 5, // Espacement entre le bouton "X.png" et le sous-titre
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    Addicon: {
        width: 30,
        height: 30,
        marginRight: 5,
        marginTop: 4,
    },
    Deleteicon: {
        width: 23,
        height: 23,
        marginRight: 5,
    },
    saveButtonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    titleInputEmpty: {
        minWidth: 100 // Largeur minimale lorsque le titre est vide
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    successMessageContainer: {
        backgroundColor: '#66BB6A',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    successMessage: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton: {
        color: '#fff',
        marginTop: 5,
        textDecorationLine: 'underline',
    },
    insertTitleButton: {
        backgroundColor: '#E76654',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 10,
    },
    insertTitleButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ModifyPost;
