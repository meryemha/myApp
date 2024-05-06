import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EntryPage from './connexion/EntryPage'; // Importez la page d'entrée
import Home from './Home';

import Comment from './Comment';
import ProfileModal from './profil/ProfileModal';
import EditProfile from './profil/EditProfile';
import Login from './connexion/Login'; // Importez l'écran de connexion
import Register from './connexion/Register'; // Importez l'écran d'inscription
import ResetPassword from './connexion/ResetPassword';
import PostCo from './connexion/PostCo';
import AddPost from './profil/publications/AddPost';
import MyPosts from './profil/publications/MyPosts';
import Profile from './profil/Profile';
import ModifyPost from './profil/publications/ModifyPost';
import PostDetails from './profil/publications/PostDetails'
import ProfessionalAccount from './profil/ProfessionnalAccount';
import DeleteProfile from './profil/DeleteProfile';
import Goodbye from './connexion/GoodBye';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EntryPage"> 
        <Stack.Screen 
          name="EntryPage" 
          component={EntryPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="Comment" 
          component={Comment} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProfileModal" 
          component={ProfileModal} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfile} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPassword} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PostCo" 
          component={PostCo} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AddPost" 
          component={AddPost} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MyPosts" 
          component={MyPosts} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ModifyPost" 
          component={ModifyPost} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PostDetails" 
          component={PostDetails} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProfessionnalAccount" 
          component={ProfessionalAccount} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="DeleteProfile" 
          component={DeleteProfile} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="GoodBye" 
          component={Goodbye} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

export default App;
