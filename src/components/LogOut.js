import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleLogout = async (navigation) => {
  try {
    await AsyncStorage.removeItem("token");
    navigation.replace("SignIn");
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};
