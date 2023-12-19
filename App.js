import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import screens
import Start from './components/Start';
import Chat from './components/Chat';

// define stack
const Stack = createNativeStackNavigator();

const App = () => {

  //configure Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyDzPYWGo1ZTbQQ8cQP6cu457DosgoZDUBQ",
    authDomain: "chat-app-cbc39.firebaseapp.com",
    projectId: "chat-app-cbc39",
    storageBucket: "chat-app-cbc39.appspot.com",
    messagingSenderId: "912158082107",
    appId: "1:912158082107:web:e2da50b4e21c72ea87881e"
  };

  // initialize Firebase
  const app = initializeApp(firebaseConfig);

  // initialize Cloud Firestore
  const db = getFirestore(app);

  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />

        <Stack.Screen
          name="Chat"
        >
          {/* pass Firebase db object to Chat screen via props */}
          {props => <Chat db={db} {...props}/>}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;