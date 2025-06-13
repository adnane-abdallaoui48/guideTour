import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function Map({ latitude, longitude, name, address }) {
  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE} 
        style={styles.map}
        customMapStyle={mapStyle} 
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}

      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={name}
          description={address}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
    height: 250, // plus grand
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

// Exemple de style de carte "moderne"
const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#ebe3cd' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#523735' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#f5f1e6' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c9b2a6' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#dfd2ae' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#a5b076' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#f5f1e6' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#f8c967' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b9d3c2' }],
  },
];

