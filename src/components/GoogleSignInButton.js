import { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton({ onGoogleLoginSuccess }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '1070531194737-kdp298j2571ppm4su3i6ke2jngbmsdh9.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;

      // Appelle la fonction passée en props pour gérer la suite côté parent
      onGoogleLoginSuccess(id_token);
    }
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.googleButton}
      disabled={!request}
      onPress={() => promptAsync()}
    >
      <FontAwesome name="google" size={24} color="#FFA500" />
      <Text style={styles.googleButtonText}>Continuer avec Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    padding: 15,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    gap: 20,
    borderWidth: 1,
    borderColor: '#FFA500',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: '500',
  },
});
