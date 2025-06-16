
import {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { fonts } from '../../assets/styles/font';
import Colors from './../constants/colors';
import { getAllEvents } from '../services/api';
import { ScrollView } from 'react-native';

const Tabs = ['Tous', 'Culture', 'Musique', 'Sport'];
const EventScreen = () => {
  const [activeTab, setActiveTab] = useState('Tous');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortEventsByDate = (eventsArray) => {
  return [...eventsArray].sort((a, b) => new Date(b.date) - new Date(a.date));
};


useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      const sorted = sortEventsByDate(response.data);
      setEvents(sorted);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);


  const handleTabChange = (tab) => {
      if (tab !== activeTab) {
        setActiveTab(tab);
      }
  };
 const filterEventsCategory = events.filter((event) => {
  return activeTab === 'Tous' || event.category?.toLowerCase() === activeTab.toLowerCase();
});

  const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EventDetail', { event: item })}>
          <Image source={{uri : item.imageUrl}} style={styles.cardImage} />
          <View style={styles.cardOverlay}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDate}>{item.date}</Text>
            <Text style={styles.cardCategory}>{item.location}</Text>
          </View>
        </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{paddingHorizontal: 15 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Événements</Text>
      </View>
      </View>
      <ScrollView horizontal style={styles.tabs} showsHorizontalScrollIndicator={false}>
        {Tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => handleTabChange(tab)}>
            <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

        <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filterEventsCategory}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    marginTop: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.medium,
  },
  
  tabs: {
    paddingHorizontal: 15,
    paddingVertical: 10, 
    maxHeight: 55, 
  },

  tab: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#717883',
    backgroundColor : '#E5E7EB',
    borderRadius: 17,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  activeTab: {
    color: Colors.white,
    fontFamily: fonts.bold,
    backgroundColor : Colors.primary,
    borderRadius: 17,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  card: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: '100',
  },
  cardOverlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    
  },
  cardDate: {
    fontSize: 14,
    color: '#858B96',
    marginTop: 4,
  },
  cardCategory: {
    fontSize: 14,
    color: '#858B96',
    marginTop: 4,
  },

});

export default EventScreen;

