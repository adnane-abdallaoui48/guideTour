import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  // <== important
import images from "./../Images";
import { fonts } from '../../assets/styles/font';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function DestinationDetail({route}) {
  const { lieu } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>

        <Image source={images[lieu.imageUrl]} style={styles.image} />

        <View style={styles.data}>
          <Text style={styles.titleName}>{lieu.name}</Text>
          <Text numberOfLines={3} style={styles.description}>
            {lieu.description}
          </Text>      
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 30,    // <-- plus haut pour éviter l'encoche
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
    borderTopLeftRadius : 35,
    borderTopRightRadius : 35,
    backgroundColor : '#fff',
    padding : 20,
    flex: 1,
  },
  titleName: {
    fontSize: 18,
    fontFamily : fonts.semibold,
  },
  description : {
    fontFamily : fonts.regular,
  },
});
