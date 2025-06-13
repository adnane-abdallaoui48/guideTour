import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { fonts } from '../../assets/styles/font';
import React from 'react';
const RecommendedCard = React.memo(({ place, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.recommendedCard}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image source={{ uri: place.imageUrl }} style={styles.recommendedImage} />
      <Text style={styles.recommendedTitle} numberOfLines={1}>{place.name}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  recommendedCard: {
    width: 191,
    marginRight: 15,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 5,
  },
  recommendedTitle: {
    fontFamily: fonts.medium,
  },
});

export default RecommendedCard;
