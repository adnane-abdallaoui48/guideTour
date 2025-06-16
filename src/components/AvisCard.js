import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { fonts } from '../../assets/styles/font';

export default function AvisCard({ item }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.user.username?.[0]?.toUpperCase()}
          </Text>
        </View>
        <View style={styles.reviewInfo}>
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.reviewContent}>{item.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  
  reviewCard: {
    marginBottom: 17,
    paddingBottom : 10,
    borderBottomWidth : 1,
    borderBottomColor : '#ddd',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  avatar: {
    backgroundColor: '#dfb',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 12,
    fontFamily : fonts.bold,
    color: '#2C3E50',
  },
  rating: {
    flexDirection: 'row',
  },
  reviewInfo: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    marginBottom: 2,
    fontFamily : fonts.bold
  },
  date: {
    fontSize: 12,
    color: '#888',
    fontFamily : fonts.medium
  },
  reviewContent: {
    fontSize: 14,
    color: '#333',
    fontFamily: fonts.regular,
    marginLeft: 45,
  },


  
});


