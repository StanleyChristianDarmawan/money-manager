import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase'; // Assuming you have a firebase.js file

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '414370947871-1vpoc11ff4oa4o0p4d08p54foh34j9jc.apps.googleusercontent.com',
    redirectUri: makeRedirectUri(),
  });

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      if (authentication) {
        setLoading(true);
        const credential = GoogleAuthProvider.credential(
          authentication.idToken,
          authentication.accessToken
        );

        signInWithCredential(auth, credential)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in:", user);
            router.push('/Home');
          })
          .catch((error) => {
            console.error("Error during Firebase login:", error);
            setLoading(false);
          });
      }
    }
  }, [response]);

  // Note: To use react-native-linear-gradient, you'll need to install it:
  // expo install expo-linear-gradient
  // Then uncomment the import and the LinearGradient component.
  // import { LinearGradient } from 'expo-linear-gradient';

  return (
    <View style={styles.container}>
      {/* Uncomment the following if you want to use the illustration */}
      {/*
        <Image
          source={require('../assets/login-illustration.png')}
          style={styles.image}
          resizeMode="contain"
        /> */}
      <Text style={styles.title}>Welcome to Money Manager</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity
          style={[styles.button, !request && { opacity: 0.5 }]}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Image
            source={{ uri: 'https://cdn.freebiesupply.com/logos/thumbs/2x/google-g-2015-logo.png' }}
            style={styles.googleIcon}
          />
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '80%', // Adjust width for responsiveness
    aspectRatio: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E0E0', // Light grey for title
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0', // Slightly darker grey for subtitle
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#6200EE', // Purple accent color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text for button
    fontSize: 16,
    fontWeight: '600',
  },
});
