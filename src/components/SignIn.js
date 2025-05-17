import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
import { Ionicons } from "@expo/vector-icons";  
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleLogin = async () => {
    setErrors([]);

    if (!email || !password) {
      setErrors(["Veuillez remplir tous les champs."]);
      return;
    }

    try {
      const response = await fetch("https://1601-196-81-34-139.ngrok-free.app/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        console.log(data);
        await AsyncStorage.setItem("token", token);
        navigation.navigate('MainTabs', { screen: 'Accueil' });
        
      } else {
        setErrors([data.message || "Email ou mot de passe incorrect."]);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setErrors(["Impossible de contacter le serveur."]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Connectez-vous</Text>
      <Text style={styles.subtitle}>Veuillez vous identifier pour accéder à l'application</Text>

      {errors.length > 0 && (
        <View style={styles.errorContainer}>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>{error}</Text>
          ))}
        </View>
      )}
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        
      />

      <View style={styles.passwordContainer}>
        <TextInput 
          style={styles.passwordInput}
          placeholder="Mot de passe"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons 
            name={passwordVisible ? "eye-off" : "eye"} 
            size={20} 
            color="gray" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotPasswordEnd}>
        <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Se connecter</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>
        Vous n’avez pas de compte ? <Text style={styles.signUpLink} onPress={() => navigation.navigate("SignUp")}>Inscrivez-vous</Text>
      </Text>

      <Text style={styles.orText}>Ou connectez-vous avec</Text>

      <TouchableOpacity style={styles.socialIcons}>
        <FontAwesome name="google" size={24} color="#FFA500" />
        <Text>Continuer avec Google</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 24,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
  },
  forgotPassword: {
    color: "#FFA500",
    marginBottom: 25,
  },
  forgotPasswordEnd: {
    alignSelf: "flex-end",
  },
  signInButton: {
    backgroundColor: "#FFA500",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 30,
    fontSize: 14,
  },
  signUpLink: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  orText: {
    marginTop: 15,
    color: "gray",
  },
  socialIcons: {
    flexDirection: "row",
    padding: 15,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    gap: 20,
    borderWidth: 1,
    borderColor: "#FFA500",
    justifyContent: "center",
  },
  errorContainer: {
    width: "100%",
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
});
