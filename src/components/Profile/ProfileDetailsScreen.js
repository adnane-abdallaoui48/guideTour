
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { fonts } from '../../../assets/styles/font';
import Colors from './../../constants/colors';
import { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ProfileDetailsScreen = ({route, navigation}) => {
 
  const { user } = route.params;
  const [lastName, setLastName] = useState(user.lastName || '');
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [email, setEmail] = useState(user.email || '');

  /*
  const handleSave = async () => {
  const updatedUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    username: user.username,  // valeur existante récupérée
    password: user.password || "" // ou mot de passe vide si tu ne modifies pas
  };


  try {
    const response = await fetch(`https://tonserveur.com/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedUser)
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Utilisateur mis à jour:", data);
      // Naviguer en arrière ou afficher un message de succès
      navigation.goBack();
    } else {
      console.error("Erreur API:", response.status);
    }
  } catch (error) {
    console.error("Erreur réseau:", error);
  }
};
*/
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
      </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../../assets/adnane.png')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIcon}>
              <Text style={styles.editText}>✎</Text>
            </TouchableOpacity>
          </View>
          <View>
             <Text style={styles.name}>{user.lastName} {user.firstName}</Text>
          </View>
        </View>

        <View style = {styles.firstLast}>
          <View style={[styles.infoRow, styles.inputC]}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={[styles.infoRow, styles.inputC]}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>


          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding : 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 50,
    padding: 10
  },
  header: {
    alignItems: 'center',
    marginTop : 60,
    marginBottom: 20,
  },
  
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
  },

  editText: {
    fontSize: 12,
    color: Colors.white,
  },
  name: {
    fontSize: 20,
    fontFamily : fonts.semibold, 
    marginTop: 8,
  },

  firstLast : {
    flexDirection : 'row',
    justifyContent : 'space-between'
  },
  inputC : {
    width : "45%"
  },
  infoRow: {
    paddingVertical: 12,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontFamily : fonts.medium
  },
  
  label : {
    fontFamily : fonts.semibold,
    marginBottom : 6
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.semibold
  },
});

export default ProfileDetailsScreen;