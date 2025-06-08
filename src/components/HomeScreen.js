import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fonts } from '../../assets/styles/font';
import Colors from './../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';
import { BASE_URL } from '../../config';


const fetchPlacesFromApi = async () => {
  const response = await fetch(`${BASE_URL}/places`);
  if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
  return await response.json();
};

const loadFavoritesFromStorage = async () => {
  const favData = await AsyncStorage.getItem('favorites');
  return favData ? JSON.parse(favData) : [];
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState('Tourism');
  const [favorites, setFavorites] = useState([]);
  const [searchPlaces, setSearchPlaces] = useState({ Tourism: '', Hotel: '', Restaurant: '' });
  const [lieux, setLieux] = useState([]); 
  const [loading, setLoading] = useState(true);
  const Tabs = ['Tourism', 'Hotel', 'Restaurant'];
  
  useEffect(() => {
    const initialize = async () => {
      try {
        const [favs, places] = await Promise.all([
          loadFavoritesFromStorage(),
          fetchPlacesFromApi(),
        ]);
        setFavorites(favs);
        setLieux(places);
      } catch (err) {
        console.error('Erreur init:', err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

 
  const toggleFavorite = async (placeId) => {
    if (!user) return;

    const isFavorite = favorites.includes(placeId);
    const newFavorites = isFavorite
      ? favorites.filter((fav) => fav !== placeId)
      : [...favorites, placeId];

    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));

    const token = await AsyncStorage.getItem('token');
    try {
      await fetch(`${BASE_URL}/favorites/${placeId}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.log('Erreur lors de la mise à jour du favori :', err);
    }
  };

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const filteredPlaces = useMemo(() => {
    return lieux.filter((place) =>
      place.name.toLowerCase().includes(searchPlaces[activeTab]?.toLowerCase()) &&
      place.category?.toLowerCase() === activeTab.toLowerCase()
    );
  }, [lieux, searchPlaces, activeTab]);

  const recommendedPlaces = [
    {
      title: 'Plage de Saïdia',
      image: require('../../assets/images/plageSaidia.jpg'),
    },
    {
      title: 'Marina Saïdia',
      image: require('../../assets/images/marinaSaidia.jpg'),
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.titleBerkane}>Berkane</Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#aaa" />
          <TextInput placeholder="Rechercher" style={styles.searchInput} onChangeText={(text) =>
                    setSearchPlaces((prev) => ({ ...prev, [activeTab]: text }))
          }/>
        </View>

        <View style={styles.tabs}>
          {Tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => handleTabChange(tab)}>
              <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Populaires</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

              {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
               ) : (
              <FlatList
                ref={scrollRef}
                data={filteredPlaces}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isFavorite = favorites.includes(item.id);
                  return (
                    <TouchableOpacity
                      style={styles.card}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('DestinationDetail', { lieu: item })}
                    >
                      {/* <Image source={images[item.imageUrl]} style={styles.cardImage} /> */}
                      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                      <View style={styles.cardOverlay}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <View style={styles.rating}>
                          <Ionicons name="star" size={18} color="gold" />
                          <Text style={styles.ratingText}>{item.rating}</Text>
                        </View>
                        <MaterialIcons
                          name={isFavorite ? 'favorite' : 'favorite-border'}
                          size={30}
                          color="white"
                          style={styles.favoriteIcon}
                          onPress={() => toggleFavorite(item.id)}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
              )}
            
        <Text style={styles.sectionTitle}>Recommandés</Text>
        <View style={styles.recommendedContainer}>
          {recommendedPlaces.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recommendedCard}
              activeOpacity={0.8}
            >
              <Image source={item.image} style={styles.recommendedImage} />
              <Text style={styles.recomendedTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.white,
    flex: 1,
  },
  header: {
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.regular,
  },
  titleBerkane: {
    fontSize: 32,
    fontFamily: fonts.medium,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 18,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 30,
    height: 56,
  },
  searchInput: {
    marginLeft: 5,
    fontSize: 16,
    fontFamily : fonts.regular,
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.secondary,
  },
  activeTab: {
    color: Colors.primary,
    fontFamily: fonts.bold,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
  },
  seeAll: {
    color: Colors.primary,
    fontFamily: fonts.medium,
  },
  card: {
    width: 191,
    height: 238,
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
  },
  cardTitle: {
    color: Colors.white,
    fontFamily: fonts.semibold,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: Colors.primary,
    marginLeft: 4,
    fontFamily: fonts.semibold
  },
  favoriteIcon: {
    position: 'absolute',
    right: 5,
    bottom: 12,
  },
  recommendedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  recommendedCard: {
    width: '48%',
  },
  recommendedImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 5,
  },
  recomendedTitle: {
    fontFamily: fonts.medium,
  },
});
