// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   Text,
//   Alert,
// } from 'react-native';
// import { COLORS, icons, images } from '../constants';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from '../components/Header';
// import { ScrollView } from 'react-native-virtualized-view';
// import VerticalFoodCard from '../components/VerticalFoodCard';
// import { useNavigation } from '@react-navigation/native';
// import { BarIndicator } from 'react-native-indicators';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const DiscountFoods = () => {
//   const [discountFoods, setDiscountFoods] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [para, setPara] = useState('');
//   const navigation = useNavigation();
//   const [searchValue, setSearchValue] = useState('');
//   const [longitude, setLongitude] = useState();
//   const [latitude, setLatitude] = useState();
//   const [favorites, setFavorites] = useState([]);

//   useEffect(() => {
//     loadFavorites();
//   }, []);

//   const loadFavorites = async () => {
//     try {
//       const storedFavorites = await AsyncStorage.getItem('favorites');
//       if (storedFavorites !== null) {
//         setFavorites(JSON.parse(storedFavorites));
//       }
//     } catch (error) {
//       console.error('Error loading favorites:', error);
//     }
//   };

//   const saveFavorites = async (newFavorites) => {
//     try {
//       await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
//     } catch (error) {
//       console.error('Error saving favorites:', error);
//     }
//   };

//   const toggleFavorite = (item) => {
//     setFavorites(prevFavorites => {
//       const isCurrentlyFavorite = prevFavorites.some(fav => fav.code === item.code);
//       let newFavorites;
//       if (isCurrentlyFavorite) {
//         newFavorites = prevFavorites.filter(fav => fav.code !== item.code);
//       } else {
//         newFavorites = [...prevFavorites, item];
//       }
//       saveFavorites(newFavorites);
//       return newFavorites;
//     });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const storedLatitude = await AsyncStorage.getItem('latitude');
//       const storedLongitude = await AsyncStorage.getItem('longitude');

//       if (!storedLatitude || !storedLongitude) {
//         Alert.alert('Oops', 'Please ensure you have set your destination.');
//         return;
//       }

//       setLatitude(parseFloat(storedLatitude));
//       setLongitude(parseFloat(storedLongitude));

//       const queryParams = new URLSearchParams({
//         SearchKey: para,
//         Geolocation: `${storedLatitude},${storedLongitude}`,
//       });

//       try {
//         const response = await fetch(
//           `https://server.saugeendrives.com:9001/api/v1.0/Item?${queryParams.toString()}`,
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           },
//         );

//         if (!response.ok) {
//           setDiscountFoods([]);
//           throw new Error('Search item not found');
//         }

//         const jsonData = await response.json();
//         setDiscountFoods(jsonData.items);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         Alert.alert('Oops', error.message);
//         setError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadFavorites();
//     fetchData();
//   }, [para]);

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <BarIndicator color={COLORS.primary} />
//       </View>
//     );
//   }

//   const handleSearchIconPress = () => {
//     setPara(searchValue); // Update para with searchValue
//   };

//   const renderSearchBar = () => {
//     return (
//       <View
//         style={[
//           styles.searchBarContainer,
//           {
//             backgroundColor: COLORS.secondaryWhite,
//           },
//         ]}>
//         <TextInput
//           placeholder="Search"
//           placeholderTextColor={COLORS.gray}
//           style={styles.searchInput}
//           value={searchValue}
//           onChangeText={setSearchValue} // Update state on input change
//         />
//         <TouchableOpacity onPress={handleSearchIconPress}>
//           <Image
//             source={icons.search2}
//             resizeMode="contain"
//             style={styles.searchIcon}
//           />
//         </TouchableOpacity>
//         {/* <Image
//           source={icons.filter}
//           resizeMode="contain"
//           style={styles.filterIcon}
//         /> */}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
//       <View style={[styles.container, {backgroundColor: COLORS.white}]}>
//         <Header title="All Items!" />
//         {renderSearchBar()}
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           style={styles.scrollView}>
//           <FlatList
//             data={discountFoods}
//             keyExtractor={item => item.id}
//             numColumns={2}
//             columnWrapperStyle={{gap: 16}}
//             showsVerticalScrollIndicator={false}
//             renderItem={({item}) => (
//               <VerticalFoodCard
//                 name={item.name}
//                 vendorName={item.vendorStore.name}
//                 image={item.logo}
//                 price={item.amount}
//                 code={item.code}
//                 onPress={(params) => navigation.navigate('FoodDetailsAddItem', params)}
//                 onFavoritePress={() => toggleFavorite(item)}
//                 isFavorite={favorites.some(fav => fav.code === item.code)}
//               />
//             )}
//           />
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   area: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     padding: 16,
//   },
//   scrollView: {
//     marginVertical: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   searchBarContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 20,
//   },

//   loadingContainer:{
//     flex:1,
//     justifyContent:'center',
//     alignItems:'center',
//   },
//   searchIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//   },
//   filterIcon: {
//     width: 20,
//     height: 20,
//     marginLeft: 10,
//   },
// });

// export default DiscountFoods;

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
import VerticalFoodCard from '../components/VerticalFoodCard';
import {useNavigation} from '@react-navigation/native';
import {BarIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorModal from '../components/ErrorModal';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import authStorage from '../auth/storage';

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

  useEffect(() => {
    fetchFavoriteItems();
  }, []);

  const fetchFavoriteItems = async () => {
    try {
      const Token = await authStorage.getToken();
      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Customer/favourite-items',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: Token,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch favorite items');
      }
      const data = await response.json();
      if (data.code === 'OK' && Array.isArray(data.items)) {
        setFavorites(data.items);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching favorite items:', error);
    }
  };

  const addToFavoriteMessage = () => {
    toast.success('Added to favorite', {
      duration: 2000,
      position: ToastPosition.BOTTOM,
      styles: {
        view: {
          backgroundColor: COLORS.primary,
          borderRadius: 5,
        },
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
      styles: {
        view: {
          backgroundColor: COLORS.red,
          borderRadius: 5,
        },
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

  const handleFavoritePress = async item => {
    try {
      const Token = await authStorage.getToken();
      const isFavorite = favorites.some(
        favorite => favorite.code === item.code,
      );
      const url = `https://server.saugeendrives.com:9001/api/v1.0/Customer/favourite-items/${item.code}`;
      const method = isFavorite ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: Token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      if (isFavorite) {
        removeFromFavoriteMessage();
        setFavorites(prevFavorites =>
          prevFavorites.filter(fav => fav.code !== item.code),
        );
      } else {
        addToFavoriteMessage();
        setFavorites(prevFavorites => [...prevFavorites, item]);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedLatitude = await AsyncStorage.getItem('latitude');
      const storedLongitude = await AsyncStorage.getItem('longitude');

      if (!storedLatitude || !storedLongitude) {
        Alert.alert('Oops', 'Please ensure you have set your destination.');
        return;
      }

      setLatitude(parseFloat(storedLatitude));
      setLongitude(parseFloat(storedLongitude));

      const queryParams = new URLSearchParams({
        SearchKey: para,
        Geolocation: `${storedLatitude},${storedLongitude}`,
      });

      try {
        const response = await fetch(
          `https://server.saugeendrives.com:9001/api/v1.0/Item?${queryParams.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          setDiscountFoods([]);
          setErrorMessage('No items found');
          setModalVisible(true);
        }

        const jsonData = await response.json();
        setDiscountFoods(jsonData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Oops', error.message);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteItems();
    fetchData();
  }, [para]);

  // ... (rest of the component code remains the same)

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header title="All Items!" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <FlatList
            data={discountFoods}
            keyExtractor={item => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <VerticalFoodCard
                name={item.name}
                vendorName={item.vendorStore.name}
                image={item.logo}
                price={item.amount}
                code={item.code}
                onPress={params =>
                  navigation.navigate('FoodDetailsAddItem', params)
                }
                onFavoritePress={() => handleFavoritePress(item)}
                isFavorite={favorites.some(fav => fav.code === item.code)}
              />
            )}
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
    paddingVertical: 15,
    padding: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 5,
    borderRadius: 10,
    margin: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
