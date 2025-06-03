import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacité de 0
  const bounceAnim = useRef(new Animated.Value(0.5)).current; // scale 0.5

  useEffect(() => {
    // Lancer l'animation au montage
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Après 3 secondes, naviguer
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setTimeout(() => {
        if (token) {
          navigation.replace("MainTabs");
        } else {
          navigation.replace("SignIn");
        }
      }, 3000);
    };

    checkToken();
  }, [navigation, fadeAnim, bounceAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: fadeAnim,
            transform: [{ scale: bounceAnim }],
          },
        ]}
      >
        Tjwall
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFA500",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    fontFamily: "Verdana",
    color: "white",
  },
});
