import React from 'react';
import { View, Text } from 'react-native';

export default function DetailsScreen() {
  return (
    <View>
      <Text>Écran Détails</Text>
    </View>
  );
}

// import React, {useState, useEffect} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function HomeScreen() {
//   const [user, setUser] = useState(null);
//   const token = AsyncStorage.getItem("token");
//   // useEffect(() => {s
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
//
//       </View>
//     </View>
//   );
// }