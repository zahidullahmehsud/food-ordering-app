import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {ScrollView} from 'react-native-virtualized-view';
import VerticalFoodCard from '../components/VerticalFoodCard';
import {useNavigation} from '@react-navigation/native';
import {BarIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fetchCategoryItems, fetchFavoriteItems} from '../api/client';
import authStorage from '../auth/storage';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';

const CategoryItem = ({navigation, route}) => {
  const [discountFoods, setDiscountFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [para, setPara] = useState('');
  const {itemname} = route.params;
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setPara(itemname);

      const storedLatitude = await AsyncStorage.getItem('latitude');
      const storedLongitude = await AsyncStorage.getItem('longitude');

      setLatitude(storedLatitude);
      setLongitude(storedLongitude);

      console.log(storedLatitude);
      console.log(storedLongitude);
      console.log(itemname);

      try {
        const result = await fetchCategoryItems(
          itemname,
          storedLatitude,
          storedLongitude,
        );

        console.log('Items', result);

        setDiscountFoods(result.items);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('No item found, in this category');
        setModalVisible(true);
        setError(error);
        setDiscountFoods([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [para]); // Assuming itemname changes trigger this useEffect

  useEffect(async () => {
    const result = await fetchFavoriteItems();
    setFavorites(result);
  }, []);

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <BarIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header title="Items!" />
        {discountFoods.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={true}
            style={styles.scrollView}>
            <Text style={[styles.name, {color: COLORS.greyscale900}]}>
              {itemname}
            </Text>
            <FlatList
              data={discountFoods}
              keyExtractor={item => item.code} // Ensure the key is unique and a string
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              renderItem={({item, index}) => {
                return (
                  <VerticalFoodCard
                    key={index}
                    name={item.name}
                    image={item.logo}
                    price={item.amount}
                    vendorName={item.vendorStore.name}
                    isFavorite={favorites.some(fav => fav.code === item.code)}
                    code={item.code}
                    onPress={params =>
                      navigation.navigate('FoodDetailsAddItem', params)
                    }
                    onFavoritePress={() => handleFavoritePress(item)}
                  />
                );
              }}
            />
          </ScrollView>
        ) : (
          <></>
        )}
      </View>
      <ErrorModal
        visible={modalVisible}
        message={errorMessage}
        onClose={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
      />

      <SuccessModal
        visible={successModalVisible}
        message={successMessage}
        onClose={() => {
          setSuccessModalVisible(false);
        }}
      />

      <Toasts />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: wp('2%'),
  },
  name: {
    fontSize: wp('4%'),
    fontFamily: 'Urbanist-Bold',
    color: COLORS.greyscale900,
    fontWeight: 'bold',
    padding: hp('1%'),
    paddingVertical: hp('2%'),
  },
  container: {
    backgroundColor: 'red',
    // backgroundColor: COLORS.white,
    // padding: wp('4%'),
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
    padding: wp('2.5%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('2.5%'),
    backgroundColor: COLORS.secondaryWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginLeft: wp('2.5%'),
  },
  searchInput: {
    flex: 1,
    fontSize: wp('3.5%'),
  },
  filterIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  flatListContent: {
    paddingVertical: hp('2%'),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
});

export default CategoryItem;
