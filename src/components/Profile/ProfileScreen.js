import { View, Text, StyleSheet, ScrollView, Image, Modal, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Cards from './Cards/Cards'
const ProfileScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [notifStatus, setNotifStatus] = useState("Allow");
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.compteContainer}>
            <Image source={require('../../../assets/men.jpg')} style={styles.compteImage} />
            <View>
                <Text style={styles.titleName}>Adnane Abdallaoui</Text>
                <Text style={styles.titleEmail}>adnane.abdallaoui@ump.ac.ma</Text>
            </View>  
        </View>

        <View style={styles.cardsStyle}>
            <Cards iconLibrary="FontAwesome5" iconName="user" name="Profil"/>
            <Cards iconLibrary="Ionicons" iconName="settings-outline" name="Paramètres" />

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Cards iconLibrary="Ionicons" iconName="notifications-outline" name={`Notification (${notifStatus})`} />
            </TouchableOpacity>
            <Cards iconLibrary="AntDesign" iconName="logout" name="Déconnexion" />
        </View>
        <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setNotifStatus("Allow"); setModalVisible(false); }}>
              <Text style={styles.modalText}>Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setNotifStatus("Mute"); setModalVisible(false); }}>
              <Text style={styles.modalText}>Mute</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    compteContainer : {
        marginTop: 50,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
   titleName: {
        fontSize: 20,
        fontWeight: 400,
        color: "#1F2937",
    },
    titleEmail : {
        color: "#6B7280"
    },
    compteImage : {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginRight: 20,
        },
        cardsStyle: {
            marginTop: 20,
        },
        
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 100
  },
  modalText: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#111827",
  },
})