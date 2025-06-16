import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { fonts } from '../../assets/styles/font';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Splash({ navigation }) {
  
  useEffect(() => {
  const checkAuth = async () => {
  const token = await AsyncStorage.getItem("token");
  const biometricEnabled = await AsyncStorage.getItem("biometricEnabled"); // clé que tu crées pour savoir si utilisateur veut biométrie

  setTimeout(async () => {
    if (token) {
      if (biometricEnabled === 'true') {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (compatible && enrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Se connecter avec biométrie',
            fallbackLabel: 'Utiliser le code',
          });

          if (result.success) {
            navigation.replace("MainTabs");
          } else {
            Alert.alert("Authentification biométrique échouée");
            navigation.replace("WelcomeSc");
          }
        } else {
          navigation.replace("MainTabs");
        }
      } else {
        navigation.replace("MainTabs");
      }
    } else {
      navigation.replace("WelcomeSc");
    }
  }, 3000);
};


    checkAuth();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="bounceIn"
        duration={1500}
        source={require('../../assets/logo.png')}
        style={styles.cardImage}
      />
      <Animatable.Text
        animation="fadeInUp"
        delay={500}
        duration={1500}
        style={styles.title}
      >
        Mosafer
      </Animatable.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 34,
    color: "#F28B00",
    fontFamily: fonts.semibold,
    marginLeft: 10,
    marginLeft: 0,

  },
  cardImage: {
    width: 100,
    height: 100,
    marginRight: -17
  },
});
