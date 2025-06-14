import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';  
import images from "./../Images";
import { fonts } from '../../assets/styles/font';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Ionicons } from '@expo/vector-icons';
import Map from './Map';  

export default function DestinationDetail({ route }) {
  const { lieu } = route.params;
  const navigation = useNavigation();
  const [showMap, setShowMap] = useState(false);

  // Afficher la carte après un délai pour alléger le premier rendu
  useEffect(() => {
    const timeout = setTimeout(() => setShowMap(true), 500); // 0.5s
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={navigation.goBack}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>

        <Image source={{uri : lieu.imageUrl}} style={styles.image} />

        <ScrollView style={styles.data} showsVerticalScrollIndicator={false} >
          <View style={styles.titleRating}>
            <Text style={styles.titleName}>{lieu.name}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={18} color="gold" />
              <Text style={styles.ratingText}>{lieu.rating} (10 avis)</Text>
            </View>
          </View>

          <View style={styles.province}>
            <EvilIcons name="location" size={24} color="gray" />
            <Text style={styles.ngPr}>{lieu.address}</Text>
          </View>

          <View style={styles.about}>
            <Text style={styles.aboutT}>Description</Text>
            <Text numberOfLines={5} style={styles.description}>
              {lieu.description}
            </Text>
          </View>

        {showMap && (
        <View style={styles.mapContainer}>
          <Map
            latitude={lieu.latitude}
            longitude={lieu.longitude}
            name={lieu.name}
            address={lieu.address}
          />
        </View>
      )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 30,    
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 350,
  },
  data : {
    position : 'relative',
    top : -30,
    borderTopLeftRadius : 30,
    borderTopRightRadius : 30,
    backgroundColor : '#fff',
    padding : 20,
    flex: 1,
  },
  titleRating : {
    flexDirection : 'row',
    justifyContent: 'space-between',
    marginBottom : 5
  },
  rating : {
    flexDirection : 'row',
  },
  ratingText : {
    marginLeft : 4,
    fontFamily : fonts.medium
  },
  titleName: {
    fontSize: 18,
    fontFamily : fonts.semibold,
  },
  description : {
    fontFamily : fonts.regular,
  },
  province : {
    flexDirection : 'row',
    paddingRight : 10
  },
  ngPr : {
    fontFamily : fonts.regular
  },
  about : {
    marginTop : 20
  },
  aboutT : {
    fontFamily : fonts.semibold,
    fontSize : 16,
    marginBottom : 5
  },
  mapContainer: {
  marginTop: 20,
  paddingBottom: 60, 
  marginBottom: 30,  
},

});
