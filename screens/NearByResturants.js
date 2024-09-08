import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  Alert,
} from 'react-native';
import {COLORS, icons, images} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {ScrollView} from 'react-native-virtualized-view';
import ResturentFoodCard from '../components/ResturentFoodCard';
import {useNavigation} from '@react-navigation/native';
import {BarIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorModal from '../components/ErrorModal';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';

const DiscountFoods = () => {
  const [discountFoods, setDiscountFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [para, setPara] = useState('');
  const navigation = useNavigation();
  const [searchValue, setSearchValue] = useState('');
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [distances, setDistances] = useState({});

  useEffect(() => {
    const fetchDistances = async () => {
      if (discountFoods && discountFoods.length > 0) {
        const distancePromises = discountFoods.map(async item => {
          const distance = await calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            parseFloat(item.latitude),
            parseFloat(item.longitude),
          );
          return {[item.code]: distance};
        });

        const distanceResults = await Promise.all(distancePromises);
        const distanceMap = Object.assign({}, ...distanceResults);
        setDistances(distanceMap);
      }
    };

    fetchDistances();
  }, [discountFoods, latitude, longitude]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedLatitude = await AsyncStorage.getItem('latitude');
      const storedLongitude = await AsyncStorage.getItem('longitude');

      if (!storedLatitude || !storedLongitude) {
        Alert.alert(
          'Missing Location Data',
          'Please ensure you have saved your location data.',
        );
        return; // Exit the function early if location data is missing
      }

      setLatitude(parseFloat(storedLatitude));
      setLongitude(parseFloat(storedLongitude));

      const queryParams = new URLSearchParams({
        Geolocation: `${storedLatitude},${storedLongitude}`,
      });

      try {
        // const response = await fetch(
        //   `https://server.saugeendrives.com:9001/api/v1.0/VendorStore?${queryParams.toString()}`,
        //   {
        //     method: 'GET',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   },
        // );

        const response = await fetch(
          `https://server.saugeendrives.com:9001/api/v1.0/VendorStore`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          setDiscountFoods([]);
          setErrorMessage('No restaurant found in your area');
          setModalVisible(true);
          // throw new Error('No restaurant found in your area');
        }

        const jsonData = await response.json();
        console.log('Results--->', jsonData);

        setDiscountFoods(jsonData.stores);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Oops', error.message);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    loadFavorites();
  }, [para]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <BarIndicator color={COLORS.primary} />
      </View>
    );
  }

  // const handleSearchIconPress = () => {
  //   setPara(searchValue); // Update para with searchValue
  // };

  async function calculateDistance(lat1, lon1, lat2, lon2) {
    const apiKey = 'AIzaSyCq5Y4F8m77wt929gwKepvFlO4aBLO7bt4';
    const origin = `${lat1},${lon1}`;
    const destination = `${lat2},${lon2}`;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&mode=driving&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        const distance = data.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
        return Number(distance.toFixed(1)); // Convert to number with one decimal place
      } else {
        console.log('No route found or invalid response:', data);
        return 9999; // Return a large distance value to indicate no route or very far
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 9999; // Return a large distance value in case of any error
    }
  }
  const calculateDeliveryCharges = (distance, dChargesPK, dChargesMin) => {
    const dCharges = dChargesPK * distance;

    if (dCharges < dChargesMin) {
      return parseFloat(dChargesMin.toFixed(2)); // Minimum charge for distances less than 1 km
    } else {
      return parseFloat(dCharges.toFixed(2));
    }
  };

  const saveFavorites = async newFavorites => {
    console.log('My Favourite items is :', newFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };
  const addToFavoriteMessage = () => {
    toast.success('Added to favorite', {
      duration: 2000,
      position: ToastPosition.BOTTOM,
      icon: '✔',
      styles: {
        view: {
          backgroundColor: COLORS.primary,
          borderRadius: 5,
        },
        // pressable: ViewStyle,
        text: {
          color: 'white',
          fontWeight: '600',
        },
        indicator: {
          backgroundColor: 'white',
        },
      },
    });
  };
  const removeFromFavoriteMessage = () => {
    toast.success('Removed from favorite', {
      duration: 2000,
      position: ToastPosition.BOTTOM,
      icon: '✖',
      styles: {
        view: {
          backgroundColor: COLORS.red,
          borderRadius: 5,
        },
        // pressable: ViewStyle,
        text: {
          color: 'white',
          fontWeight: '600',
        },
        indicator: {
          backgroundColor: 'white',
        },
      },
    });
  };

  const toggleFavorite = restaurant => {
    setFavorites(prevFavorites => {
      const isCurrentlyFavorite = prevFavorites.some(
        fav => fav.code === restaurant.code,
      );
      let newFavorites;
      if (isCurrentlyFavorite) {
        removeFromFavoriteMessage();
        newFavorites = prevFavorites.filter(
          fav => fav.code !== restaurant.code,
        );
      } else {
        addToFavoriteMessage();
        newFavorites = [...prevFavorites, restaurant];
      }
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };
  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header title="Near By Resturent" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <FlatList
            data={discountFoods}
            keyExtractor={item => item.code}
            numColumns={2}
            columnWrapperStyle={{gap: 6}}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const distance = distances[item.code] || 0;
              const dChargesMin = item.deliveryChargesMinimum;
              const dChargesPK = item.deliveryChargesPerKm;
              const deliveryCharges = calculateDeliveryCharges(
                distance,
                dChargesPK,
                dChargesMin,
              );
              console.log(
                `Distance: ${distance}, Delivery Charges: ${deliveryCharges}`,
              );
              const isFavorite = favorites.some(fav => fav.code === item.code);

              return (
                <ResturentFoodCard
                  name={item.name}
                  image={images.hamburger3}
                  //  description={item.description}
                  isFavorite={isFavorite}
                  distance={distance}
                  deliveryCharges={deliveryCharges}
                  onPress={() =>
                    navigation.navigate('CategoryHamburger', {
                      vendorcode: item.code,
                      distance: distance,
                      deliveryCharges: deliveryCharges,
                    })
                  }
                  onFavoritePress={() =>
                    toggleFavorite({
                      ...item,
                      // distance: `${distance} km`,
                      // deliveryCharges: deliveryCharges
                    })
                  }
                />
              );
            }}
          />
        </ScrollView>
      </View>
      <Toasts />

      <ErrorModal
        visible={modalVisible}
        message={errorMessage}
        onClose={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 5,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  filterIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
});

export default DiscountFoods;
