import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase';

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

  return (
    <View style={styles.container}>
      {/* <Image
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
