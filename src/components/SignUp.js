import { ScrollView, TouchableOpacity, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native'; 
import { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../../assets/styles/font';
import Colors from './../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../config';

const SignUp = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null })
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!form.username.trim()) newErrors.username = "L'identifiant est obligatoire";
    if (!form.firstName.trim()) newErrors.firstName = "Le nom est obligatoire";
    if (!form.lastName.trim()) newErrors.lastName = "Le prénom est obligatoire";
    if (!form.email.trim()) newErrors.email = "Veuillez entrer une adresse e-mail";
    else if (!emailRegex.test(form.email)) newErrors.email = "Format d'e-mail invalide";
    if (!form.password.trim()) newErrors.password = "Veuillez choisir un mot de passe";
    else if (form.password.length < 6) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    if (!form.confirmPassword.trim()) newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne sont pas identiques";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 

  const submitForm = async () => {
    if (!validateForm()) return;
  
    const { confirmPassword, ...userData } = form;
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (response.ok) {
        const { token } = data;
        await AsyncStorage.setItem("token", token);
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Inscription réussie !',
          text2: 'Vous pouvez maintenant vous connecter.',
          visibilityTime: 3000,
        });
        navigation.replace("SignIn");
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Erreur d\'inscription',
          text2: data.message || "Une erreur est survenue.",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Erreur de connexion',
        text2: "Impossible de contacter le serveur.",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
    };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white}}>
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Inscrivez-vous</Text>
      <Text style={styles.subtitle}>Veuillez vous inscrire pour accéder à l'application.</Text>

      {/* {errors.general && <Text style={styles.errorText}>{errors.general}</Text>} */}

      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
      <TextInput
        placeholder='Identifiant'
        style={styles.input}
        value={form.username}
        onChangeText={(text) => handleChange("username", text)}
      />

      {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
      <TextInput
        placeholder='Nom'
        style={styles.input}
        value={form.firstName}
        onChangeText={(text) => handleChange("firstName", text)}
      />

      {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
      <TextInput
        placeholder='Prénom'
        style={styles.input}
        value={form.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
      />

      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        placeholder='Email'
        keyboardType='email-address'
        style={styles.input}
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mot de passe"
          style={styles.passwordInput}
          secureTextEntry={!passwordVisible}
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirmez votre mot de passe"
          style={styles.passwordInput}
          secureTextEntry={!confirmPasswordVisible}
          value={form.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
          <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.signUpButton, isLoading && { opacity: 0.5 }]}
        onPress={submitForm}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signIUpText}>S'inscrire</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.signInText}>
        Vous avez déjà un compte ? <Text style={styles.signInLink} onPress={() => navigation.navigate("SignIn")}>Connectez-vous</Text>
      </Text>

      <Text style={styles.orText}>Ou connectez-vous avec</Text>

      <TouchableOpacity style={styles.socialIcons}>
        <FontAwesome name="google" size={24} color="#FFA500" />
        <Text style={styles.textGoogle}>Continuer avec Google</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
    alignItems: "center",
    padding: 20
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 13,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 50,
    padding: 10
  },
  title: {
    fontSize: 24,
    fontFamily : fonts.bold,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 20,
    fontFamily : fonts.regular
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontFamily : fonts.regular
  },
  passwordContainer: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 6
  },
  passwordInput: {
    flex: 1,
    fontFamily : fonts.regular
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  signIUpText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily : fonts.semibold
  },
  signInText: {
    marginTop: 15,
    fontSize: 14,
    fontFamily : fonts.medium
  },
  signInLink: {
    color: Colors.primary,
    fontFamily : fonts.semibold
  },
  orText: {
    marginTop: 10,
    color: "gray",
    fontFamily : fonts.medium
  },
  socialIcons: {
    flexDirection: "row",
    padding: 15,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 35,
    gap: 20,
    borderWidth: 1,
    borderColor: "#FFA500",
    justifyContent: "center"
  },
  textGoogle: {
    fontFamily : fonts.medium
  },
  errorText: {
    width: "100%",  
    color: "red",
    marginBottom: 5,
    fontFamily : fonts.medium
  }
});
