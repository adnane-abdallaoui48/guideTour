import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from './../constants/colors';
import { fonts } from '../../assets/styles/font';
import React from 'react';

const PlaceCard = React.memo(({ place, isFavorite, onPress, onToggleFavorite }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <Image source={{ uri: place.imageUrl }} style={styles.cardImage} />
      <View style={styles.favoriteIcon}>
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-outline'}
          size={28}
          onPress={onToggleFavorite}
          color={isFavorite ? Colors.primary : '#888'}
        />
      </View>
      <View style={styles.cardOverlay}>
        <Text style={styles.cardTitle} numberOfLines={1}>{place.name}</Text>
        
            {place.averageRating !== null && place.averageRating !== undefined
              ? 
                  <View style={styles.rating}>
                    <Ionicons name="star" size={18} color="gold" />
                    <Text style={styles.ratingText}>{place.averageRating.toFixed(1)}</Text>
                  </View>
              :  <Text style={styles.ratingText}>N/A</Text>}
        </View>

    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
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
  },
  ratingText: {
    fontSize: 14,
    color: Colors.white,
    marginLeft: 5,
    fontFamily: fonts.medium,
  },
  favoriteIcon: {
    position: 'absolute',
    right: 5,
    top: 12,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 2,
  },
});

export default PlaceCard;
