
// import React, {useState, useEffect} from 'react';
// import {View, Text } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LogOut from './LogOut';

// export default function HomeScreen() {
//   const [user, setUser] = useState(null);
//   const token = AsyncStorage.getItem("token");
//   // useEffect(() => {
//   //   const fetchUser = async () => {
//   //     const token = await AsyncStorage.getItem("token");
//   //     if (!token) return;

//   //     try {
//   //       const response = await fetch(" https://17c6-41-248-88-254.ngrok-free.app/users/me", {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`
//   //         }
//   //       });
//   //       const data = await response.json();
//   //       setUser(data);
//   //     } catch (error) {
//   //       console.error("Erreur lors de la récupération du profil", error);
//   //     }
//   //   };

//   //   fetchUser();
//   // }, []);

//   return (
//     <View>
//       <Text>Accueil</Text>
//        <View>
//           {/* {user ? (
//             <Text>Bienvenue {user.firstName} {user.lastName}</Text>
//           ) : (
//             <Text>Chargement...</Text>
//           )} */}
//           <LogOut />
//       </View>
//     </View>
//   );
// }
import { Text,
  View, 
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
 } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const HomeScreeno = ({ navigation }) => {
const [activeTab, setActiveTab] = useState("Places");
const [favorites, setFavorites] = useState([]);

const toggleFavorite = (title) => {
  if (favorites.includes(title)) {
    setFavorites(favorites.filter((fav) => fav !== title));
  } else {
    setFavorites([...favorites, title]);
  }
};
const popularPlaces = [
  {
    title: "Litchina",
    rating: 4.2,
    image: require("../assets/litch.jpg"),
  },
  {
    title: "La Grotte du Chameau",
    rating: 4.2,
    image: require("../assets/Grottechameau.jpg"),
  },
];
const recommendedPlaces = [
  {
    title: "Cap de l’Eau",
    image: require("../assets/raslma.jpg"),
  },
  {
    title: "Plage de Marsa Ben M’Hidi",
    image: require("../assets/BenMhedi.jpg"),
  },
];
  return (
    <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.titleBerkane}>Berkane</Text>
      {/* <View style={styles.locationContainer}>
        <Ionicons name="location-sharp" size={14} color="orange" />
        <Text style={styles.locationText}>Berkane</Text>
      </View> */}
    </View>

    <View style={styles.searchBar}>
      <Ionicons name="search" size={20} color="#aaa" />
      <TextInput placeholder="Search" style={styles.searchInput} />
    </View>

    {/* 🔘 BOUTON "Voir la carte" */}
    <TouchableOpacity
      style={styles.mapButton}
      onPress={() => navigation.navigate("MapScreen")}
    >
      <Ionicons name="map" size={24} color="white" />
      <Text style={styles.mapButtonText}>Voir la carte</Text>
    </TouchableOpacity>

    <View style={styles.tabs}>
      {["Places", "Hotels", "Food"].map((tab) => (
        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
          <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Popular</Text>
      <TouchableOpacity>
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {popularPlaces.map((item, index) => {
        const isFavorite = favorites.includes(item.title);

        return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate("DetailsScreen", { place: item })
            }
          >
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color="gold" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <MaterialIcons
                name={isFavorite ? "favorite" : "favorite-border"}
                size={20}
                color="white"
                style={styles.favoriteIcon}
                onPress={() => toggleFavorite(item.title)}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>

    <Text style={styles.sectionTitle}>Recommended</Text>
    <View style={styles.recommendedContainer}>
      {recommendedPlaces.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.recommendedCard}
          onPress={() => navigation.navigate("DetailsScreen", { place: item })}
        >
          <Image source={item.image} style={styles.recommendedImage} />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
  )
}

export default HomeScreeno;

const styles = StyleSheet.create({
container: {
  padding: 20,
  backgroundColor: "#fff",
  flex: 1,
},
header: {
  marginTop : 47
},
title: {
  fontSize: 18,
  fontFamily : "arial"

},
titleBerkane: {
  fontSize: 32,
  fontWeight: "bold",
},
// locationContainer: {
//   flexDirection: "row",
//   alignItems: "center",
// },
locationText: {
  marginLeft: 4,
  color: "orange",
  fontWeight: "600",
},
searchBar: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#f1f1f1",
  borderRadius: 12,
  paddingHorizontal: 10,
  marginVertical: 15,
  height: 45,
},
searchInput: {
  marginLeft: 10,
  fontSize: 16,
  flex: 1,
},
mapButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "orange",
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
},
mapButtonText: {
  color: "white",
  marginLeft: 8,
  fontWeight: "bold",
},
tabs: {
  flexDirection: "row",
  marginBottom: 10,
},
tab: {
  marginRight: 20,
  fontSize: 16,
  color: "#888",
},
activeTab: {
  color: "orange",
  fontWeight: "bold",
},
section: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 15,
  marginBottom: 10,
},
sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
},
seeAll: {
  color: "orange",
  fontSize: 14,
},
card: {
  width: 160,
  height: 200,
  borderRadius: 16,
  marginRight: 15,
  overflow: "hidden",
  position: "relative",
},
cardImage: {
  width: "100%",
  height: "100%",
},
cardOverlay: {
  position: "absolute",
  bottom: 0,
  padding: 10,
  backgroundColor: "rgba(0,0,0,0.4)",
  width: "100%",
},
cardTitle: {
  color: "white",
  fontWeight: "bold",
},
rating: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
},
ratingText: {
  color: "white",
  marginLeft: 4,
},
favoriteIcon: {
  position: "absolute",
  top: 10,
  right: 10,
},
recommendedContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 10,
},
recommendedCard: {
  width: "48%",
},
recommendedImage: {
  width: "100%",
  height: 120,
  borderRadius: 12,
  marginBottom: 5,
},
});
