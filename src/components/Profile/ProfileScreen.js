import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Modal, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../useUser';
import Cards from './Cards/Cards';
import colors from '../../constants/colors';
import { fonts } from '../../../assets/styles/font';
import { handleLogout } from '../LogOut';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, loading } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [notifStatus, setNotifStatus] = useState('Allow');

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.compteContainer}>
        <Image source={require('../../../assets/adnane.png')} style={styles.compteImage} />
        <View>
          {user && (
            <>
              <Text style={styles.titleName}>{user.username}</Text>
              <Text style={styles.titleEmail}>{user.email}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.cardsStyle}>
        <Cards
          iconLibrary="FontAwesome5"
          iconName="user"
          name="Profil"
          onPress={() => navigation.navigate('ProfileDetails', { user })}
        />
        <Cards iconLibrary="Ionicons" iconName="settings-outline" name="Paramètres" />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Cards iconLibrary="Ionicons" iconName="notifications-outline" name={`Notification (${notifStatus})`} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLogout(navigation)}>
          <Cards iconLibrary="AntDesign" iconName="logout" name="Déconnexion" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setNotifStatus('Allow'); setModalVisible(false); }}>
              <Text style={styles.modalText}>Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setNotifStatus('Mute'); setModalVisible(false); }}>
              <Text style={styles.modalText}>Mute</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 10 },
  compteContainer: { marginTop: 50, padding: 20, flexDirection: 'row', alignItems: 'center' },
  titleName: { fontSize: 20, fontFamily: fonts.semibold, color: '#1F2937' },
  titleEmail: { color: '#6B7280', fontFamily: fonts.regular, fontSize: 13 },
  compteImage: { width: 70, height: 70, borderRadius: 50, marginRight: 20 },
  cardsStyle: { marginTop: 20 },
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'flex-end', padding: 20, backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    backgroundColor: '#fff', borderRadius: 10, padding: 15, width: 120,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
    elevation: 5, marginTop: 100,
  },
  modalText: { fontSize: 16, paddingVertical: 10, color: '#111827' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
});
