import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config';
import { fonts } from '../../../assets/styles/font';
import Colors from '../../constants/colors';
import Toast from 'react-native-toast-message';

const ProfileDetailsScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [lastName, setLastName] = useState(user.lastName || '');
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [email, setEmail] = useState(user.email || '');

  const isModified = firstName !== user.firstName || lastName !== user.lastName || email !== user.email;

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSave = async () => {
    if (!firstName || !lastName || !email) {
    Toast.show({
      type: 'error',
      text1: 'Champs manquants',
      text2: 'Tous les champs sont obligatoires.',
    });
    return;
    }
     if (!isValidEmail(email)) {
    Toast.show({
      type: 'error',
      text1: 'Email invalide',
      text2: 'Veuillez entrer une adresse email valide.',
    });
    return;
  }
    const updatedUser = {
      firstName,
      lastName,
      email,
      username: user.username,
      password: user.password || '', 
    };

    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Profil mis à jour avec succès !',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
      } else {
        Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de mettre à jour le profil.',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
      }
    } catch (error) {
      Toast.show({
      type: 'error',
      text1: 'Erreur réseau',
      text2: 'Vérifie ta connexion internet.',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image source={require('../../../assets/adnane.png')} style={styles.avatar} />
          <TouchableOpacity style={styles.editIcon}>
            <EvilIcons name="pencil" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.name}>{user.username}</Text>
        </View>
      </View>

      <View style={styles.firstLast}>
        <View style={[styles.infoRow, styles.inputC]}>
          <Text style={styles.label}>Nom</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
        </View>
        <View style={[styles.infoRow, styles.inputC]}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, !isModified && { opacity: 0.5 }]}
        onPress={handleSave}
        disabled={!isModified}
      >
        <Text style={styles.saveButtonText}>Modifier les informations</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backButton: { alignSelf: 'flex-start', marginTop: 20, backgroundColor: '#f9f9f9', borderRadius: 50, padding: 10 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 20 },
  avatar: { width: 90, height: 90, borderRadius: 50 },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
  },
  name: { fontSize: 20, fontFamily: fonts.semibold, marginTop: 8 },
  firstLast: { flexDirection: 'row', justifyContent: 'space-between' },
  inputC: { width: '45%' },
  infoRow: { paddingVertical: 12 },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontFamily: fonts.medium,
  },
  label: { fontFamily: fonts.semibold, marginBottom: 6 },
  saveButton: { marginTop: 20, backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontFamily: fonts.semibold },
});
