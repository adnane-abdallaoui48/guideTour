import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import Colors from '../constants/colors';
import { fonts } from '../../assets/styles/font';
import { addFavorite, removeFavorite } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const AllPlaces = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { places = [], category = '', initialFavorites = [], updateFavorites } = route.params || {};

  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(initialFavorites);
  const [loadingFav, setLoadingFav] = useState(false);

  const filteredPlaces = useMemo(() => {
  return places.filter(
    (place) =>
      place.category?.toLowerCase() === category.toLowerCase() &&
      place.name.toLowerCase().includes(search.toLowerCase())
  );
}, [places, search, category]);


  const toggleFavorite = async (placeId) => {
    setLoadingFav(true);
    const isFav = favorites.includes(placeId);
    try {
      if (isFav) {
          await removeFavorite(placeId);
          const newFavorites = favorites.filter(id => id !== placeId);
          setFavorites(newFavorites);
          updateFavorites && updateFavorites(newFavorites); 
          Toast.show({ type: 'success', text1: 'Favori supprimé' });
        } else {
          await addFavorite(placeId);
          const newFavorites = [...favorites, placeId];
          setFavorites(newFavorites);
          updateFavorites && updateFavorites(newFavorites); 
          Toast.show({ type: 'success', text1: 'Favori ajouté' });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de modifier les favoris.',
      });
      console.error(err.message);
    } finally {
      setLoadingFav(false);
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('DestinationDetail', { lieu: item })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name || 'Sans nom'}</Text>
          {item.averageRating !== null && item.averageRating !== undefined
              ? 
                  <View style={styles.rating}>
                    <Ionicons name="star" size={18} color="gold" />
                    <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
                  </View>
              :  <Text style={styles.ratingText}>N/A</Text>}
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
          disabled={loadingFav}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-outline'}
            size={30}
            color={isFavorite ? Colors.primary : '#888'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingBottom: insets.bottom}]} >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput
          placeholder="Rechercher un lieu"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.container}>
        {places.length === 0 ? (
          <Text style={styles.emptyText}>Aucun lieu disponible.</Text>
        ) : filteredPlaces.length === 0 ? (
          <Text style={styles.emptyText}>Aucun lieu trouvé.</Text>
        ) : (
          <FlatList
            data={filteredPlaces}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    backgroundColor: '#f9f9f9',
    borderRadius: 50,
    padding: 10,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 25,
    marginLeft: 30,
  },
  rating: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
    fontFamily: fonts.medium,

  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 18,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 25,
    height: 56,
    marginHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  card: {
    marginTop: 20,
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
  favoriteButton: {
    padding: 2,
    position : 'absolute',
    top : 8,
    right : 8,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  emptyText: {
    marginTop: 50,
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    fontFamily: fonts.medium,
  },
});

export default AllPlaces;