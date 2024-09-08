// components/AddNewAddress/Map.js
import React, {useRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps';

const Map = ({currentLocation, selectedCoordinates, fetchPlaceDetails}) => {
  const mapViewRef = useRef(null);

  return (
    <MapView
      ref={mapViewRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: currentLocation ? currentLocation.latitude : 37.78825,
        longitude: currentLocation ? currentLocation.longitude : -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
      {selectedCoordinates && (
        <Marker
          coordinate={{
            latitude: selectedCoordinates.latitude,
            longitude: selectedCoordinates.longitude,
          }}
          draggable
          onDragEnd={e => {
            const newCoordinates = e.nativeEvent.coordinate;
            fetchPlaceDetails(
              newCoordinates.latitude,
              newCoordinates.longitude,
            );
            mapViewRef.current.animateToRegion({
              latitude: newCoordinates.latitude,
              longitude: newCoordinates.longitude,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0121,
            });
          }}>
          <Callout tooltip>
            <View>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>User Address</Text>
              </View>
              <View style={styles.arrowBorder} />
              <View style={styles.arrow} />
            </View>
          </Callout>
        </Marker>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  bubble: {
    backgroundColor: 'white',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleText: {
    fontWeight: 'bold',
    color: 'black',
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: 'white',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: 'white',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
});

export default Map;
