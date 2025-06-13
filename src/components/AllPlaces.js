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

const AllPlaces = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { places = [], category = '', initialFavorites = [] } = route.params || {};

  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(initialFavorites);
  const [loadingFav, setLoadingFav] = useState(false);

  const filteredPlaces = useMemo(() => {
    return places.filter(place =>
      place.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [places, search]);

  const toggleFavorite = async (placeId) => {
    setLoadingFav(true);
    const isFav = favorites.includes(placeId);
    try {
      if (isFav) {
        await removeFavorite(placeId);
        setFavorites(prev => prev.filter(id => id !== placeId));
        Toast.show({ type: 'success', text1: 'Favori supprimé' });
      } else {
        await addFavorite(placeId);
        setFavorites(prev => [...prev, placeId]);
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
    <SafeAreaView style={styles.safeArea}>
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
    paddingBottom: 20, 
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
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    paddingRight: 10,
  },
  image: {
    width: 100,
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
    padding: 8,
    position : 'absolute',
    bottom : 5,
    right : 10
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
