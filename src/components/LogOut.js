import React from 'react'
import { View, Text, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
export default function LogOut() {
    const navigation = useNavigation();
    const handleLogout = async () => {
        try {
        await AsyncStorage.removeItem("token");
        navigation.replace("SignIn"); 
        } catch (error) {
        console.error("Erreur lors de la déconnexion", error);
        }
    };
  return (
    <View>
        <Text>LogOut</Text>
        <Button title="Se déconnecter" onPress={handleLogout} />
    </View>
  )
}