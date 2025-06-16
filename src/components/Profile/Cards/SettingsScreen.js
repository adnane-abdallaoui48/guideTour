import { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/colors';
import { fonts } from '../../../../assets/styles/font';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    AsyncStorage.getItem('biometricEnabled').then(value => {
      setBiometricEnabled(value === 'true');
    });
  }, []);

  const toggleBiometric = async () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    await AsyncStorage.setItem('biometricEnabled', newValue.toString());
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
         </TouchableOpacity>
         <Text style={styles.titleSettings}>Paramètres</Text>
    </View>

      <View style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="finger-print-outline" size={24} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Authentification biométrique</Text>
          <Text style={styles.subtitle}>Déverrouillez lapplication avec Face ID ou Touch ID</Text>
        </View>
        <Switch
          value={biometricEnabled}
          onValueChange={toggleBiometric}
          thumbColor={biometricEnabled ? Colors.primary : '#ccc'}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backButton: { 
    alignSelf: 'flex-start',
    backgroundColor: '#f9f9f9',
    borderRadius: 50,
    padding: 10,
    marginRight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  titleSettings: {
    fontSize: 28,
    fontFamily: fonts.semibold,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal : 5,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
    fontFamily: fonts.regular,
  },
});
