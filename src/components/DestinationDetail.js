
import { useEffect, useState, useRef, useCallback } from 'react';
import { View,  Text,  Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts } from '../../assets/styles/font';
import colors from '../constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal } from 'react-native';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import Map from './Map';
import { getAvisByLieu, postAvis, postRating, getAverageRatingByPlace, getRatingByUserAndPlace } from '../services/api'; 
import AvisCard from './AvisCard';
import Toast from 'react-native-toast-message';
import { Rating } from 'react-native-ratings';

export default function DestinationDetail({ route }) {
  const { lieu } = route.params;
  const inputRef = useRef(null);
  const navigation = useNavigation();

  const [showMap, setShowMap] = useState(false);
  const [avisList, setAvisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
 


  useEffect(() => {
    const timeout = setTimeout(() => setShowMap(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (showModal && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100); 
    }
  }, [showModal]);

    
  const fetchAvisList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAvisByLieu(lieu.id);
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAvisList(sorted);
    } catch (error) {
      console.error('Erreur fetch avis :', error.message);
    } finally {
      setLoading(false);
    }
  }, [lieu.id]);

  useFocusEffect(useCallback(() => {
      fetchAvisList();
    }, [fetchAvisList])
  );


  const handleSubmitReview = async () => {
  
  if (!reviewContent.trim()) {
    Toast.show({
      type: 'error',
      text1: 'Avis vide',
      text2: 'Veuillez écrire un avis avant de l’envoyer.',
    });
    return;
  }

  if (reviewRating < 1 || reviewRating > 5) {
    Toast.show({
      type: 'error',
      text1: 'Note invalide',
      text2: 'La note doit être comprise entre 1 et 5.',
    });
    return;
  }


  try {
    setSubmitting(true);
    await postAvis(lieu.id, reviewContent);
    await postRating(lieu.id, reviewRating);

    setReviewContent('');
    setReviewRating(0);
    setShowModal(false);

    await fetchAvisList();

    const res = await getAverageRatingByPlace(lieu.id);
    setAverageRating(parseFloat(res.data.toFixed(1))); 
    
    Toast.show({
      type: 'success',
      text1: 'Merci pour votre avis !',
      text2: 'Il a été ajouté avec succès.',
    });
  } catch (error) {
    console.error('Erreur en envoyant l’avis :', error.message);
    Toast.show({
      type: 'error',
      text1: 'Erreur',
      text2: "Une erreur s'est produite lors de l'envoi de l’avis.",
    });
  } finally {
    setSubmitting(false);
  }
};


  const renderAvis = ({ item }) => <AvisCard item={item}/>;

  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor:'white' }}>

      <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={navigation.goBack}>
        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>

      <Image source={{ uri: lieu.imageUrl }} style={styles.image} />

      <ScrollView style={styles.data} showsVerticalScrollIndicator={false} >
        <View style={styles.titleRating}>
          <Text style={styles.titleName}>{lieu.name}</Text>
          {lieu.averageRating !== null && lieu.averageRating !== undefined
              ? 
                  <View style={styles.rating}>
                    <Ionicons name="star" size={18} color="gold" />
                    <Text style={styles.ratingText}>{lieu.averageRating.toFixed(1)}</Text>
                  </View>
              :  <Text style={styles.ratingText}>N/A</Text>}
        </View>         

        <View style={styles.province}>
          <EvilIcons name="location" size={24} color="gray" style={styles.icon}/>
          <Text style={styles.ngPr}>{lieu.address}</Text>
        </View>

        <View style={styles.about}>
          <Text style={styles.aboutT}>Description</Text>
          <Text numberOfLines={5} style={styles.description}>
            {lieu.description}
          </Text>
        </View>

        {showMap && (
          <View style={styles.mapContainer}>
            <Text style={styles.aboutT}>Localisation</Text>
            <Map
              latitude={lieu.latitude}
              longitude={lieu.longitude}
              name={lieu.name}
              address={lieu.address}
            />
          </View>
        )}

        <View style={[styles.about, styles.bot]}>
          <View style={styles.addAvis}>
            <Text style={{fontFamily: fonts.semibold, fontSize: 17,}}>Avis</Text>
            <TouchableOpacity onPress={() => setShowModal(true)} style={{flexDirection : 'row', alignItems: 'center'}}>
              <FontAwesome5 name="comment" size={18} color={colors.primary} />
              <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize : 15, marginLeft : 5}}>Laisser un avis</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 10 }} />
          ) : avisList.length === 0 ? (
            <Text style={{ fontFamily: fonts.regular, color: 'gray' }}>Aucun avis pour ce lieu pour l'instant.</Text>
          ) : (
            <FlatList
              data={avisList}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              renderItem={renderAvis}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Votre Avis</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              multiline
              placeholder="Parlez de votre expérience aux autres..."
              value={reviewContent}
              onChangeText={setReviewContent}
            />
            <Text style={styles.Note}>Note</Text>
            <Rating
              type="star"
              ratingCount={5}
              imageSize={25}
              fractions={0} 
              startingValue={0}
              onFinishRating={(rating) => setReviewRating(Math.round(rating))}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButtonCancel, styles.modalButton]}
                onPress={() => {
                  setShowModal(false);
                  setReviewContent('');
                }}
              >
                <Text style={[styles.modalButtonTextAnnuler, styles.modalButtonText]}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor:
                        !reviewContent.trim() || submitting ? '#ccc' : colors.primary,
                    },
                  ]}
                  onPress={handleSubmitReview}
                  disabled={!reviewContent.trim() || submitting}
                >
                  <Text style={[styles.modalButtonTextEnvoyer, styles.modalButtonText]}>
                    {submitting ? 'Envoi...' : 'Envoyer'}
                  </Text>
              </TouchableOpacity>

              </View>
            </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 300,
  },
   inputT: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4
  },
  data: {
    position: 'relative',
    top: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    padding: 20,
  },
  titleRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems : 'center',
    marginBottom: 5
  },
  rating: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
    fontFamily: fonts.medium,
  },

  Note : {
    fontFamily: fonts.medium,
    textAlign : 'center',
    fontSize : 18,
    marginBottom : 4
  },
  titleName: {
    fontSize: 18,
    fontFamily: fonts.semibold,
  },
  description: {
    fontFamily: fonts.regular,
  },
  province: {
    flexDirection: 'row',
    paddingRight: 10
  },
  ngPr: {
    fontFamily: fonts.regular
  },
  about: {
    marginTop: 25,
    marginBottom: 20
  },
  aboutT: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    marginBottom: 10
  },
  bot : {
    marginBottom : 30
  },
  addAvis : {
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    marginBottom : 13
  },
  icon : {
    marginLeft : -6
  },
  mapContainer: {
    marginTop: 15,
    marginBottom : 10
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
    flex : 1
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.medium,
    marginBottom: 10,
  },

  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    fontFamily: fonts.regular,
    marginBottom: 15,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20
  },

  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    width : '48%',

  },
  modalButtonCancel : {
    borderWidth : 1,
    borderColor: '#ccc',
  },
  modalButtonText : {
    fontFamily: fonts.semibold,
  textAlign : 'center'
  },
  modalButtonTextAnnuler: {
    color: '#000',
  },
  modalButtonTextEnvoyer : {
    color: '#fff',
  }

});

