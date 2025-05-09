import React, { useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts } from '../../assets/styles/font';
import Colors from './../constants/colors';

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Lieux');
  const [favorites, setFavorites] = useState([]);
  const scrollRef = useRef(null);
  const [searchPlaces, setSearchPlaces] = useState({
    Lieux: '',
    Hôtels: '',
    Restaurants: '',
  });
  const toggleFavorite = (title) => {
    if (favorites.includes(title)) {
      setFavorites(favorites.filter((fav) => fav !== title));
    } else {
      setFavorites([...favorites, title]);
    }
  };

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      scrollRef.current?.scrollTo({ x: 0, animated: true });
    }
  };


const fetchData = async (category, token) => {
  try {
    const response = await fetch(`https://tonapi.com/api/places?category=${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur fetchData:', error.message);
    return [];
  }
};
useEffect(() => {
  const loadPlaces = async () => {
    const token = AsyncStorage.getItem('token');
    const data = await fetchData(activeTab, token);
    setPlaces(data); 
  };

  loadPlaces();
}, [activeTab]);

  const popularPlaces = [
    {
      title: 'Limona',
      rating: 4.2,
      image: require('../../assets/images/litch.jpg'),
      category: "Lieux"
    },
    {
      title: 'La Grotte du Chameau',
      rating: 4.3,
      image: require('../../assets/images/Grottechameau.jpg'),
      category: "Lieux"
    },
    {
      title: 'Grotte des Pigeons',
      rating: 4.8,
      image: require('../../assets/images/GrottedesPigeons(Tafoughalt).jpg'),
      category: "Lieux"
    },
    {
      title: 'Parc des Béni Snassen',
      rating: 4.7,
      image: require('../../assets/images/parcBeniSnassen.jpg'),
      category: "Lieux"
    },
    {
      title: 'Raid Oriental',
      rating: 4.3,
      image: require('../../assets/images/RaidOriental.png'),
      category: "Hôtels"
    },
    {
      title: 'Be Live Collection',
      rating: 5,
      image: require('../../assets/images/beInLiveSaidia.jpg'),
      category: "Hôtels"
    },
    
  ];

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


  const filterPlacesCategory = popularPlaces.filter(place =>
      place.category === activeTab && place.title.toLowerCase().includes(searchPlaces[activeTab].toLowerCase())
  );
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
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
          {['Lieux', 'Hôtels', 'Restaurants'].map((tab) => (
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef}>
          {filterPlacesCategory.map((item, index) => {
            const isFavorite = favorites.includes(item.title);
            scrollRef.current?.scrollTo({ y: 0, animated: true });
            return (
              <TouchableOpacity
                key={index}
                style={styles.card}
                activeOpacity={0.8}
                // onPress={() => navigation.navigate("DetailsScreen", { place: item })}
              >
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.cardOverlay}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={14} color="gold" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <MaterialIcons
                    name={isFavorite ? 'favorite' : 'favorite-border'}
                    size={30}
                    color="white"
                    style={styles.favoriteIcon}
                    onPress={() => toggleFavorite(item.title)}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recommandés</Text>
        <View style={styles.recommendedContainer}>
          {recommendedPlaces.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recommendedCard}
              activeOpacity={0.8}
              // onPress={() => navigation.navigate("DetailsScreen", { place: item })}
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
