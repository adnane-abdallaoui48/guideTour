import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Splash({ navigation }) {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setTimeout(() => {
        if (token) {
          navigation.replace("HomeScreen");
           
        } else {
          navigation.replace("SignIn"); 
        }
      }
      , 3000); 
     
    };
    checkToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Tjwall</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor : "#FFA500"
    },
    title: {
      fontSize: 34,
      fontWeight: "bold",
      fontFamily : "Verdana",
      color : "white"
    },
  });
