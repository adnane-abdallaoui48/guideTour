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
import images from './../Images';
import { fonts } from '../../assets/styles/font';
import { BASE_URL } from '../../config';
import colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavorisScreen() {
  const navigation = useNavigation();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true); // pour éviter les flashs

  const fetchFavorites = useCallback(async () => {
    try {
      if (firstLoad) setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn("Token non trouvé");
        return setFavorites([]);
      }

      const response = await fetch(`${BASE_URL}/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sorted = data.sort((a, b) => b.id - a.id);
        setFavorites(sorted);
      } else {
        const err = await response.json();
        console.error("Erreur récupération favoris :", err.message || err);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    } finally {
      if (firstLoad) {
        setLoading(false);
        setFirstLoad(false);
      }
    }
  }, [firstLoad]);

  // Recharger quand on entre dans l'écran
  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DestinationDetail', { lieu: item.place })}
    >
      <Image source={images[item.place.imageUrl]} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.place?.name || 'Sans nom'}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {item.place?.description || 'Pas de description'}</Text>
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
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
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
