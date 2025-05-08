import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const users = [
  { id: '1', name: 'Adnane', age: 22 },
  { id: '2', name: 'Karim', age: 25 },
  { id: '3', name: 'Leila', age: 20 }
];

const FavoritesScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.age}>Âge: {item.age}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
     </SafeAreaView>
  )
}

export default FavoritesScreen
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#eee',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 16,
    color: '#555',
  },
});
