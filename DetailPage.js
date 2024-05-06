import React from 'react';
import { View, Image, Text, ScrollView, StyleSheet } from 'react-native';
import Header from './heades/Header';

const DetailPage = ({ route }) => {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
      <Image source={post.image} style={styles.image} />
      <Text style={styles.title}>Description:</Text>
      <Text style={styles.info}>{post.Description}</Text>
      <Text style={styles.title}>Location:</Text>
      <Text style={styles.info}>{post.Location}</Text>
      <Text style={styles.title}>Transportation:</Text>
      <Text style={styles.info}>{post.Transportation}</Text>
      <Text style={styles.title}>Cost:</Text>
      <Text style={styles.info}>{post.Cost}</Text>
      <Text style={styles.title}>Description:</Text>
      <Text style={styles.info}>{post.Description}</Text>
      <Text style={styles.title}>Location:</Text>
      <Text style={styles.info}>{post.Location}</Text>
      <Text style={styles.title}>Transportation:</Text>
      <Text style={styles.info}>{post.Transportation}</Text>
      <Text style={styles.title}>Cost:</Text>
      <Text style={styles.info}>{post.Cost}</Text>
        {/* Ajoutez d'autres informations de la publication avec leurs titres */}
      </ScrollView>
      
      {/* Ajoutez d'autres informations de la publication avec leurs titres */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    backgroundColor: '#F3F3F3',
    padding: 5,
    borderRadius: 15,
    color: '#000000',
  },
  info: {
    marginBottom: 10,
  },
});

export default DetailPage;
