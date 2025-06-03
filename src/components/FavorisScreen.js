import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import images from './../Images';
import { fonts } from '../../assets/styles/font';

export default function FavorisScreen() {

  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([
    {
      id: '1',
      name: 'Marina Saïdia',
      imageUrl: '../assets/images/plageSaidia.jpg',
      description: 'Un port de plaisance moderne situé sur la côte méditerranéenne du Maroc.',
    },
    {
      id: '2',
      name: 'Plage de Tanger',
      imageUrl: 'plageTanger',
      description: 'Une plage magnifique avec du sable fin et une eau claire.',
    },
  ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DestinationDetail', { lieu: item })}
    >
      <Image source={images['marinaSaidia.jpg']} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.fav}>
         <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
          </TouchableOpacity>
         <Text style={styles.favT}>Mes favoris</Text>
      </View>
      
      <View style={styles.container}>
        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>Aucun favori pour le moment.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
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
  fav : {
    marginTop : 50,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems : "center"
  },
  favT: {
    fontFamily: fonts.semibold,
    fontSize: 25,
    marginLeft: 30
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#f9f9f9",
    borderRadius: 50,
    padding: 10
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    marginTop : 20,
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
});
/*
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useUser } from './useUser';

const FavoritesScreen = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useUser()
  useEffect(() => {
    fetch(`https://7702-160-178-143-5.ngrok-free.app/favorites/${user.id}`)
      .then(response => response.json())
      .then(data => {
        setFavorites(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur:', error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Aucun favori trouvé.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <Text style={styles.title}>{item.placeName}</Text>
           
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  favoriteItem: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  title: { fontSize: 16, fontWeight: 'bold' },
});

export default FavoritesScreen;
*/

