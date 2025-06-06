import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, StatusBar } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

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
            console.log("User signed in:", userCredential.user);
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
      <StatusBar translucent backgroundColor="transparent" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="wallet-outline" size={48} color="#FFFFFF" />
          </View>
        </View>
        
        <Text style={styles.title}>Money Manager</Text>
        <Text style={styles.subtitle}>Take control of your finances</Text>
        
        <View style={styles.featureRow}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="trending-up" size={22} color="#6C3EB7" />
            </View>
            <Text style={styles.featureText}>Track Expenses</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="pie-chart" size={22} color="#6C3EB7" />
            </View>
            <Text style={styles.featureText}>Budget Planning</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="notifications" size={22} color="#6C3EB7" />
            </View>
            <Text style={styles.featureText}>Alerts</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8A52E5" style={styles.loader} />
            <Text style={styles.loadingText}>Signing you in...</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, !request && { opacity: 0.5 }]}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <View style={styles.buttonContent}>
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-google" size={18} color="#6C3EB7" />
              </View>
              <Text style={styles.buttonText}>Sign in with Google</Text>
            </View>
          </TouchableOpacity>
        )}
        
        <Text style={styles.privacyText}>
          By signing in, you agree to our Terms of Service
        </Text>
      </View>
      
      {/* Background decoration */}
      <View style={styles.bgDecorTop} />
      <View style={styles.bgDecorBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1128',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight || 0,
    overflow: 'hidden',
  },
  content: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 10,
  },
  bgDecorTop: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(108, 62, 183, 0.08)',
    top: -width * 0.25,
    right: -width * 0.25,
    zIndex: 1,
  },
  bgDecorBottom: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(108, 62, 183, 0.05)',
    bottom: -width * 0.2,
    left: -width * 0.2,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#6C3EB7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#D1C4E9',
    marginBottom: 36,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 36,
  },
  featureItem: {
    alignItems: 'center',
    width: '33%',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  featureText: {
    fontSize: 12,
    color: '#D1C4E9',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  loader: {
    marginBottom: 10,
  },
  loadingText: {
    color: '#D1C4E9',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    marginTop: 16,
    backgroundColor: '#6C3EB7',
    elevation: 4,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  privacyText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 20,
  }
});
