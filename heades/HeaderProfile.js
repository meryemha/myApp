import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HeaderProfile = ({ title }) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    const routes = navigation.getState().routes;
    const currentRouteIndex = navigation.getState().index;
    const goBackRoute = routes[currentRouteIndex - 1]?.name;
  
    if (goBackRoute === 'Login' || goBackRoute === 'PostCo' || goBackRoute === 'Register') {
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  };
  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={[styles.header, { marginTop: 30 }]}>
      <TouchableOpacity onPress={handleGoBack}>
        <Image source={require('../assets/Fleche.png')} style={styles.arrowIcon} />
      </TouchableOpacity>     
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={handleGoHome}>
        <Image source={require('../assets/Leaf.png')} style={[styles.appIcon, { transform: [{ rotate: '45deg' }] }]} />
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pour centrer les éléments horizontalement
    marginBottom: 20,
    marginTop: 15,
    paddingHorizontal: 20, // Ajout de marge horizontale pour centrer les éléments dans la vue
  },
  arrowIcon: {
    width: 25,
    height: 25,
  },
  appIcon: {
    width: 45,
    height: 45,
    transform: [{ rotate: '45deg' }],
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});


export default HeaderProfile;
