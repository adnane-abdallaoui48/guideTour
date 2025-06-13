import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { fonts } from '../../assets/styles/font';
export default function WelcomeSc({ navigation }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/beach.jpg')}
        style={styles.image}
        resizeMode="cover"
        onLoad={() => setIsImageLoaded(true)} 
      >
        {isImageLoaded && ( 
          <View style={styles.textCon}>
            <Text style={styles.exploreT}>Explorez et découvrez de nouveaux endroits</Text>
            <TouchableOpacity style={styles.signIn} onPress={() => navigation.replace('SignIn')}>
              <Text style={styles.textSig}>Explorer maintenant</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  textCon: {
    paddingHorizontal: 35,
    position: 'absolute',
    bottom: 150,
  },
  exploreT: {
    color: '#ddd',
    fontSize: 28,
    fontFamily : fonts.bold
  },
  signIn: {
    backgroundColor: "#FFA726",
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 20,
  },
  textSig: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontFamily : fonts.semibold
  },
});