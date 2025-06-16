import { useState, useRef, useMemo} from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons} from '@expo/vector-icons';
import { fonts } from '../../assets/styles/font';
import Colors from './../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';
import RecommendedCard from '../components/RecommendedCard';
import PlaceCard from '../components/PlaceCard';
import { addFavorite, removeFavorite } from '../services/api';
import { usePlaces } from '../hooks/usePlaces';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
const Tabs = ['Lieu', 'Hotel', 'Restaurant'];

const HomeScreen = () => {
  const navigation = useNavigation();
  const popularListRef = useRef(null);
  const recommendedListRef = useRef(null);


  const [activeTab, setActiveTab] = useState('Lieu');
  const [searchPlaces, setSearchPlaces] = useState({ Lieu: '', Hotel: '', Restaurant: '' });

  const { popular, recommended, favorites, setFavorites, loading, places } = usePlaces();

    
    const toggleFavorite = async (placeId) => {
    const isFav = favorites.includes(placeId);
    try {
      if (isFav) {
        await removeFavorite(placeId);
        setFavorites(prev => prev.filter(id => id !== placeId));
        Toast.show({
          type: 'success',
          text1: 'Favori supprimé',
        });
      } else {
        await addFavorite(placeId);
        setFavorites(prev => [...prev, placeId]);
        Toast.show({
          type: 'success',
          text1: 'Favori ajouté',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de modifier les favoris.',
      });
      console.error('Erreur toggleFavorite :', err.message);
    }
  };


  
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      popularListRef.current?.scrollToOffset({ offset: 0, animated: true });
      recommendedListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

 const filterPlaces = useCallback((list, category, query) => {
  return list.filter(place =>
    place.name.toLowerCase().includes(query.toLowerCase()) &&
    place.category?.toLowerCase() === category.toLowerCase()
  );
}, []);
  const filteredPlaces = useMemo(() => {
    return filterPlaces(popular, activeTab, searchPlaces[activeTab] || '');
  }, [popular, searchPlaces, activeTab]);

  const filteredRecommended = useMemo(() => {
    return filterPlaces(recommended, activeTab, searchPlaces[activeTab] || '');
  }, [recommended, searchPlaces, activeTab]);

  const extractKey = (item) => item.id.toString();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.titleBerkane}>Berkane</Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#aaa" />
          <TextInput
            placeholder="Rechercher"
            style={styles.searchInput}
            onChangeText={(text) =>
              setSearchPlaces((prev) => ({ ...prev, [activeTab]: text }))
            }
          />
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
          <TouchableOpacity onPress={() => navigation.navigate('AllPlaces', { places: places, category: activeTab, initialFavorites: favorites, updateFavorites: setFavorites, })}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            ref={popularListRef}
            data={filteredPlaces}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={extractKey}
            renderItem={({ item }) => {
              const isFavorite = favorites.includes(item.id);
              return (
               <PlaceCard
                place={item}
                isFavorite={isFavorite}
                onPress={() => navigation.navigate('DestinationDetail', { lieu: item })}
                onToggleFavorite={() => toggleFavorite(item.id)}
              />
              );
            }}
          />
        )}
        {!loading && filteredPlaces.length === 0 && (
          <Text style={{ marginTop: 20, color: '#888', textAlign: 'center' }}>
            Aucun lieu trouvé.
          </Text>
        )}
        <Text style={styles.sectionTitle}>Recommandés</Text>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
        <FlatList
          ref={recommendedListRef}
          data={filteredRecommended}
          keyExtractor={extractKey}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
             <RecommendedCard
              place={item}
              onPress={() => navigation.navigate('DestinationDetail', { lieu: item })}
            />
          )}
        />
        )}
        {!loading && filteredPlaces.length === 0 && (
          <Text style={{ marginTop: 20, color: '#888', textAlign: 'center' }}>
            Aucun lieu trouvé.
          </Text>
        )}
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
    marginBottom: 20
  },
  tab: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#717883',
    backgroundColor : '#E5E7EB',
    borderRadius: 17,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  activeTab: {
    color: Colors.white,
    fontFamily: fonts.bold,
    backgroundColor : Colors.primary,
    borderRadius: 17,
    paddingHorizontal: 15,
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
    fontFamily: fonts.semibold,
  },

  recommendedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
});
