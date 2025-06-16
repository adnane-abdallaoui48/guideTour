import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fonts } from '../../assets/styles/font';
import colors from '../constants/colors';
import { clearFavorites, fetchFavorites } from '../services/api';
import Toast from 'react-native-toast-message';

export default function FavorisScreen() {
  const navigation = useNavigation();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true); 

  const fetchFavoritesFromApi = useCallback(async () => {
  try {
    if (firstLoad) setLoading(true);
    const response = await fetchFavorites();
    
    const sorted = response.data.sort((a, b) => b.id - a.id);
    setFavorites(sorted);
  } catch (err) {
    console.error("Erreur récupération favoris :", err.response?.data?.message || err.message);
  } finally {
    if (firstLoad) {
      setLoading(false);
      setFirstLoad(false);
    }
  }
}, [firstLoad]);

  useFocusEffect(
    useCallback(() => {
      fetchFavoritesFromApi();
    }, [fetchFavoritesFromApi])
  );



  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DestinationDetail', { lieu: item.place })}
    >
      <Image source={{uri : item.place.imageUrl}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.place?.name || 'Sans nom'}</Text>
        {/* <Text numberOfLines={1} style={styles.description}>
          {item.place?.description || 'Pas de description'}</Text> */}
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.favHeader}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={navigation.goBack}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.favTitle}>Mes favoris</Text>
      </View>

       

      <View style={styles.container}>
        {firstLoad && loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : favorites.length === 0 ? (
          <Text style={styles.emptyText}>Aucun lieu favori pour le moment.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  favHeader: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  favTitle: {
    fontFamily: fonts.semibold,
    fontSize: 25,
    marginLeft: 30,
  },
  backButton: {
    backgroundColor: "#f9f9f9",
    borderRadius: 50,
    padding: 10,
  },
  card: {
    marginTop : 20,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    marginBottom: 6,
    color: '#222',
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: '#555',
  },
  emptyText: {
    marginTop: 50,
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    fontFamily: fonts.medium,
  },
  loader: {
    marginTop: 20,
  },


});
