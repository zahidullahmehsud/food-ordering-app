import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import debounce from 'lodash.debounce';
import {COLORS} from '../constants';

const CustomPlacesAutocomplete = ({onPlaceSelect, apiKey}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchPlaces = async placeName => {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      placeName,
    )}&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        setResults(data.results);
      } else {
        console.log('Error searching for place');
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching for place:', error);
      setResults([]);
    }
  };

  const debouncedSearch = debounce(searchPlaces, 300);

  useEffect(() => {
    if (query.length > 2) {
      debouncedSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelectPlace = place => {
    const {formatted_address, geometry} = place;
    const {lat, lng} = geometry.location;
    onPlaceSelect({
      placeName: formatted_address,
      latitude: lat,
      longitude: lng,
    });
    setQuery(formatted_address);
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a place"
        value={query}
        onChangeText={setQuery}
        placeholderTextColor={COLORS.black}
      />
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={item => item.place_id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectPlace(item)}>
              <Text>{item.name}</Text>
              <Text style={styles.address}>{item.formatted_address}</Text>
            </TouchableOpacity>
          )}
          style={styles.resultsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    // zIndex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    color: COLORS.black,
    // borderColor: 'black',
  },
  resultsList: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    maxHeight: 200,
  },
  resultItem: {
    padding: 10,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  address: {
    fontSize: 12,
    color: 'gray',
  },
});

export default CustomPlacesAutocomplete;
