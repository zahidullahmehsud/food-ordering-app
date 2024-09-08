import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, SIZES, icons, images} from '../constants';
import {banners, categories, discountFoods, recommendedFoods} from '../data';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-virtualized-view';
import SubHeaderItem from '../components/SubHeaderItem';
import Category from '../components/Category';
import VerticalFoodCard from '../components/VerticalFoodCard';
import HorizontalFoodCard from '../components/HorizontalFoodCard';
import NearResturantCard from '../components/NearResturantCard';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import {BarIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authStorage from '../auth/storage';
import GetLocation from 'react-native-get-location';
import {sendFcmToken} from '../utils/sendFcmToken';
import useFCMNotifications from '../utils/ListenNotifications';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import LinearGradient from 'react-native-linear-gradient';
import AutoSlider from '../components/AutoSlider';
import Banner from '../components/Banner';
import AddressPromptModal from '../components/AddressPromptModal';

const Home = ({navigation, route}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [location, setLocation] = useState('Select Your Location');
  const [profileData, setProfileData] = useState(null);
  const [longitude, setLongitude] = useState('0');
  const [latitude, setLatitude] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [discountFoods, setDiscountFoods] = useState([]);
  const [resturentFoods, setResturentFoods] = useState([]);
  const [Address, setAddress] = useState([]);
  const [AddressCode, setAddressCode] = useState([]);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [basketCount, setBasketCount] = useState(0);
  const [vendorlatitude, setvendorlatitude] = useState();
  const [vendorlongitude, setvendorlongitude] = useState();
  const [favorites, setFavorites] = useState([]);
  const [foodFavourite, setFoodFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showIcon, setShowIcon] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [distances, setDistances] = useState({});
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  useEffect(() => {
    const fetchDistances = async () => {
      if (resturentFoods && resturentFoods.length > 0) {
        const distancePromises = resturentFoods.map(async item => {
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
  }, [latitude, longitude, resturentFoods]);

  sendFcmToken();
  // useFCMNotifications();

  useFocusEffect(
    React.useCallback(() => {
      loadBasketCount();
      fetchDataCustomer();
      checkForRelevantOrders();
      fetchDashboardData();
      fetchFavoriteItems();
    }, []),
  );

  const loadBasketCount = async () => {
    try {
      const storedCount = await AsyncStorage.getItem('basketCount');
      if (storedCount !== null) {
        setBasketCount(parseInt(storedCount, 10));
      } else {
        setBasketCount('');
      }
    } catch (error) {
      console.error('Error loading basket count:', error);
    }
  };

  const fetchPlaceDetails = async (latitude, longitude) => {
    const apiKey = 'AIzaSyCq5Y4F8m77wt929gwKepvFlO4aBLO7bt4'; // Make sure to replace YOUR_API_KEY with your actual Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.status === 'OK') {
        const formattedAddress = data.results[0].formatted_address;
        console.log('Place Name:', formattedAddress);
        setLocation(formattedAddress); // This updates the placeName state with the fetched location name
      } else {
        console.log('Error fetching place details');
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('Name farhan');

  //   }, []),
  // );

  const handleAddAddress = () => {
    // Navigate to the "Add Address" screen
    navigation.navigate('CheckoutOrdersAddress');
    setAddressModalVisible(false);
  };

  const fetchDataCustomer = async () => {
    setAddressModalVisible(false);
    try {
      const Token = await authStorage.getToken();
      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Customer',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: Token,
          },
        },
      );
      console.log('Status Code:', response.status);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      const addresses = jsonData.profile.addresses;
      // console.log('Customer get api =', JSON.stringify(jsonData));
      // console.log(
      //   'Customer get api address =',
      //   JSON.stringify(jsonData.profile.addresses),
      // );
      setProfileData(jsonData);
      const storedDefaultAddress = await AsyncStorage.getItem('defaultAddress');
      const selectedAddress = JSON.parse(storedDefaultAddress);

      if (selectedAddress) {
        console.log('Latitude:' + selectedAddress.latitude);
        console.log('Latitude:' + selectedAddress.longitude);
        setLocation(selectedAddress.address);
        setLatitude(selectedAddress.latitude);
        setLongitude(selectedAddress.longitude);
        setAddressCode(selectedAddress.code);
        latLongtoAsync(
          selectedAddress.latitude,
          selectedAddress.longitude,
          selectedAddress.code,
        );
        fetchData(
          selectedAddress.latitude,
          selectedAddress.longitude,
          selectedAddress.code,
        );
      } else {
        _getCurrentLocation();
        setAddressModalVisible(true);
        // setLocation(address.address);
        // setLatitude(address.latitude);
        // setLongitude(address.longitude);
        // setAddressCode(address.code);
        // latLongtoAsync(address.latitude, address.longitude, address.code);
        // fetchData(address.latitude, address.longitude, address.code);
      }

      if (jsonData.profile.addresses.length == 0) {
        setAddressModalVisible(true);
        _getCurrentLocation();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('error', error.message);
      setError(error);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (profileData) {
  //       const addresses = profileData.profile.addresses;

  //       // addresses.forEach((address, index) => {
  //       //   if (address.default === true) {
  //       //     fetchData(address.latitude, address.longitude, address.code);

  //       //     setLocation(address.address);
  //       //     setLatitude(address.latitude);
  //       //     setLongitude(address.longitude);
  //       //     setAddressCode(address.code);
  //       //   }
  //       // });
  //     }
  //   }, [profileData, latitude, latitude]),
  // );

  const fetchData = async (latitude, longitude, addressCode) => {
    try {
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);

      const queryParams = new URLSearchParams({
        Geolocation: `${latitude},${longitude}`,
      });

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      // const response = await fetch(
      //   `https://server.saugeendrives.com:9001/api/v1.0/Customer/dashboard?${queryParams.toString()}`,
      //   requestOptions,
      // );

      const response = await fetch(
        `https://server.saugeendrives.com:9001/api/v1.0/Customer/dashboard`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Log the entire jsonData to inspect its structure
      // console.log('Customer dashboard api = ', JSON.stringify(jsonData));
      if (jsonData.stores.length == 0) {
        setModalVisible(true);
        setErrorMessage('No near by Resturent found in select location');
      }
      // if (jsonData.items.length == 0) {
      //   setModalVisible(true);
      //   setErrorMessage('No Items found');
      // }

      // Extracting categories from jsonData
      const categories = jsonData.categories;

      setData(categories);
      setData(jsonData.categories);
      setDiscountFoods(jsonData.items);
      setResturentFoods(jsonData.stores);
      // if (restu) {
      //   alert('No near by Resturnet found in selected location');
      // }

      // console.log('categories', categories);
      // console.log('setDiscountFoods', jsonData.items);
      // console.log('setResturentFoods', jsonData.stores);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function _getCurrentLocation(addressCode = '1212122') {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        // console.log('current location :', location.latitude);
        fetchData(location.latitude, location.longitude);
        fetchPlaceDetails(location.latitude, location.longitude);
        latLongtoAsync(location.latitude, location.longitude, addressCode);
        //console.log('')
        // Call fetchPlaceDetails with the current location coordinates
        // fetchPlaceDetails(location.latitude, location.longitude);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }

  const latLongtoAsync = async (latitude, longitude, AddressCode) => {
    try {
      await AsyncStorage.setItem('latitude', latitude.toString());
      await AsyncStorage.setItem('longitude', longitude.toString());
      await AsyncStorage.setItem('AddressCode', AddressCode.toString());
      console.log('Latitude = ', latitude);
      console.log('Longitude = ', longitude);
      console.log('AddressCode = ', AddressCode);
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // setIsLoading(true);

  //     // loadFavorites();

  //   }, []),
  // );

  const checkForRelevantOrders = async () => {
    try {
      const ordersExistJSON = await AsyncStorage.getItem('OrdersExist');
      if (ordersExistJSON) {
        const ordersExist = JSON.parse(ordersExistJSON);
        setShowIcon(ordersExist.isExist);
      }
    } catch (error) {
      console.error('Error checking for relevant orders:', error);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const Token = await authStorage.getToken();
    const myHeaders = new Headers();
    myHeaders.append('Authorization', Token);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Customer/dashboard',
        requestOptions,
      );
      const result = await response.json();
      setDashboardData(result);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('permission===>', granted);
        setLocationPermissionGranted(true);
        // Call your location-related functions here
      } else {
        // console.log('permission===>', granted);
        console.log('Location permission denied');
        isLoading(false);
        // requestLocationPermission();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // const renderHeader = () => {
  //   const shortenAddress = address => {
  //     // This function will shorten the address
  //     if (address.length > 20) {
  //       return address.substring(0, 30) + '...';
  //     }
  //     return address;
  //   };
  //   return (
  //     <View style={styles.headerContainer}>
  //       <View style={styles.viewLeft}>
  //         {/* <Image
  //           source={images.user1}
  //           resizeMode='contain'
  //           style={styles.userIcon}
  //         /> */}
  //         <View style={styles.viewNameContainer}>
  //           <Text style={styles.greeeting}>Deliver To</Text>
  //           <TouchableOpacity
  //             onPress={() => navigation.navigate('CheckoutOrdersAddress')}>
  //             <View style={{flexDirection: 'row'}}>
  //               <Text style={{fontSize: 15, fontWeight: '700', color: 'black'}}>
  //                 {shortenAddress(location)}
  //               </Text>
  //               <FontAwesome
  //                 name="caret-down"
  //                 size={23}
  //                 color="rgb(250, 159, 28)"
  //                 style={{paddingLeft: 6}}
  //               />
  //             </View>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //       <View style={styles.viewRight}>

  //       {showIcon && (
  //         <TouchableOpacity onPress={() => navigation.navigate('PendingOrder')}>
  //           <Image
  //             source={icons.clock}
  //             resizeMode="contain"
  //             style={[styles.bookmarkIconn, {tintColor: 'white'}]}
  //           />
  //         </TouchableOpacity>
  //       )}

  //         <TouchableOpacity onPress={() => navigation.navigate('Favourite')}>
  //           <Image
  //             source={icons.heartOutline}
  //             resizeMode="contain"
  //             style={[styles.bookmarkIcon, {tintColor: COLORS.greyscale900}]}
  //           />
  //         </TouchableOpacity>

  //         <TouchableOpacity
  //           onPress={() => navigation.navigate('CheckoutOrdersCompleted')}>
  //           <Image
  //             source={images.Vector}
  //             resizeMode="contain"
  //             style={[styles.bellIcon, {tintColor: COLORS.greyscale900}]}
  //           />
  //           {basketCount > 0 && (
  //             <View style={styles.basketCountContainer}>
  //               <Text style={styles.basketCountText}>{basketCount}</Text>
  //             </View>
  //           )}
  //         </TouchableOpacity>
  //       </View>
  //       {/* <View style={styles.viewRight}>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate('Notifications')}>
  //           <Image
  //             source={images.basket}
  //             resizeMode="contain"
  //             style={[styles.bellIcon, {tintColor: COLORS.greyscale900}]}
  //           />
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate("Favourite")}>
  //           <Image
  //             source={icons.heartOutline}
  //             resizeMode='contain'
  //             style={[styles.bookmarkIcon, { tintColor: COLORS.greyscale900 }]}
  //           />
  //         </TouchableOpacity>
  //       </View> */}
  //     </View>
  //   );
  // };

  // const renderBannerItem = ({item}) => (
  //   <View style={styles.bannerContainer}>
  //     <View style={styles.bannerTopContainer}>
  //       <View>
  //         <Text style={styles.bannerDicount}>{item.discount} OFF</Text>
  //         <Text style={styles.bannerDiscountName}>{item.discountName}</Text>
  //       </View>
  //       <Text style={styles.bannerDiscountNum}>{item.discount}</Text>
  //     </View>
  //     <View style={styles.bannerBottomContainer}>
  //       <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
  //       <Text style={styles.bannerBottomSubtitle}>{item.bottomSubtitle}</Text>
  //     </View>
  //   </View>
  // );

  const renderHeader = () => {
    const shortenAddress = address => {
      if (address.length > 20) {
        return address.substring(0, 20) + '...';
      }
      return address;
    };

    return (
      <View style={styles.headerContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.greeeting}>Deliver To</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CheckoutOrdersAddress')}
            style={styles.addressButton}>
            <Text
              style={styles.addressText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {location}
            </Text>
            <FontAwesome
              name="caret-down"
              size={23}
              color="rgb(250, 159, 28)"
              style={styles.caretIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.iconsContainer}>
          {/* {showIcon ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('PendingOrder')}
              style={[
                styles.iconButton,
                {backgroundColor: 'red', borderRadius: 10},
              ]}>
              <Image
                source={icons.clock}
                resizeMode="contain"
                style={[styles.icon, {tintColor: 'white'}]}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )} */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Favourite')}
            style={styles.iconButton}>
            <Image
              source={icons.heartOutline}
              resizeMode="contain"
              style={[styles.icon, {tintColor: COLORS.black2}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CheckoutOrdersCompleted')}
            style={styles.iconButton}>
            <Image
              source={images.Vector}
              resizeMode="contain"
              style={[styles.icon, {tintColor: COLORS.greyscale900}]}
            />
            {basketCount > 0 && (
              <View style={styles.basketCountContainer}>
                <Text style={styles.basketCountText}>{basketCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const keyExtractor = item => item.id.toString();

  const handleEndReached = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
  };

  const renderDot = index => {
    return (
      <View
        style={[styles.dot, index === currentIndex ? styles.activeDot : null]}
        key={index}
      />
    );
  };

  /**
   * Render banner
   */
  // const renderBanner = () => {
  //   return (
  //     <View style={styles.bannerItemContainer}>
  //       <FlatList
  //         data={banners}
  //         renderItem={renderBannerItem}
  //         keyExtractor={keyExtractor}
  //         horizontal
  //         pagingEnabled
  //         showsHorizontalScrollIndicator={false}
  //         onEndReached={handleEndReached}
  //         onEndReachedThreshold={0.5}
  //         onMomentumScrollEnd={event => {
  //           const newIndex = Math.round(
  //             event.nativeEvent.contentOffset.x / SIZES.width,
  //           );
  //           setCurrentIndex(newIndex);
  //         }}
  //       />
  //       <View style={styles.dotContainer}>
  //         {banners.map((_, index) => renderDot(index))}
  //       </View>
  //     </View>
  //   );
  // };

  const renderBanner = () => {
    if (!dashboardData || !dashboardData.ads) return null;

    return (
      <View style={styles.bannerContainer}>
        <FlatList
          data={dashboardData.ads}
          renderItem={({item, index}) => (
            <View style={styles.bannerSlide}>
              <Image source={{uri: item.image}} style={styles.bannerImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bannerGradient}>
                <Text style={styles.bannerDescription}>{item.description}</Text>
              </LinearGradient>
            </View>
          )}
          keyExtractor={item => item.code}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          //  decelerationRate="fast"
          scrollEnabled
          snapToInterval={SIZES.width}
          onMomentumScrollEnd={event => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / SIZES.width,
            );
            setCurrentIndex(newIndex);
          }}
        />
        <View style={styles.dotContainer}>
          {dashboardData.ads.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };
  /**
   * Render search bar
   */
  const renderSearchBar = () => {
    const handleInputFocus = () => {
      // Redirect to another screen
      navigation.navigate('Search', {latitude: latitude, longitude: longitude});
    };

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Search');
        }}
        style={[
          styles.searchBarContainer,
          {
            backgroundColor: COLORS.secondaryWhite,
          },
        ]}>
        <TouchableOpacity>
          <Image
            source={icons.search2}
            resizeMode="contain"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Search"
          placeholderTextColor={COLORS.gray}
          style={styles.searchInput}
          onFocus={handleInputFocus}
        />
        {/* <TouchableOpacity>
          <Image
            source={icons.filter}
            resizeMode="contain"
            style={styles.filterIcon}
          />
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
  };

  /**
   * Render categories
   */
  const renderCategories = () => {
    return (
      <View>
        <SubHeaderItem
          title="Categories"
          navTitle="View all"
          onPress={() => navigation.navigate('Categories')}
        />
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={4} // Render two items per row
          renderItem={({item, index}) => (
            <Category
              name={item.name}
              // icon={item.icon}
              //description={item.description}
              icon={icons.burger}
              backgroundColor={COLORS.white}
              onPress={() =>
                navigation.navigate('CategoryItem', {
                  itemname: item.name,
                })
              }
            />
          )}
        />
      </View>
    );
  };

  // function calculateDistance(lat1, lon1, lat2, lon2) {
  //   const R = 6371; // Radius of the Earth in kilometers
  //   const dLat = (lat2 - lat1) * (Math.PI / 180);
  //   const dLon = (lon2 - lon1) * (Math.PI / 180);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(lat1 * (Math.PI / 180)) *
  //       Math.cos(lat2 * (Math.PI / 180)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const distance = R * c; // Distance in kilometers
  //   return Number(distance.toFixed(1)); // Convert to number with one decimal place
  // }

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
        setFoodFavorites(data.items);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching favorite items:', error);
    }
  };
  const handleFavoritePress = async item => {
    try {
      const Token = await authStorage.getToken();
      const isFavorite = foodFavourite.some(
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
        setFoodFavorites(prevFavorites =>
          prevFavorites.filter(fav => fav.code !== item.code),
        );
      } else {
        addToFavoriteMessage();
        // Fetch the updated item details from the API response
        const updatedItemResponse = await fetch(
          `https://server.saugeendrives.com:9001/api/v1.0/Customer/favourite-items/${item.code}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: Token,
            },
          },
        );
        if (updatedItemResponse.ok) {
          const updatedItem = await updatedItemResponse.json();
          setFoodFavorites(prevFavorites => [...prevFavorites, updatedItem]);
        } else {
          // If we can't fetch the updated item, add the original item
          setFoodFavorites(prevFavorites => [...prevFavorites, item]);
        }
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

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

  const saveFavorites = async newFavorites => {
    console.log('My Favroiut items is :', newFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // useFocusEffect(() => {
  //   // const loadFavorites =
  //   // loadFavorites();
  // }, [foodFavourite]);

  // useFocusEffect(
  //   React.useCallback(async () => {
  //     const storedFavorites = await AsyncStorage.getItem('CategoryItemsfav');
  //     if (storedFavorites) {
  //       setFoodFavorites(JSON.parse(storedFavorites));
  //     }
  //   }, []),
  // );

  // useFocusEffect(
  //   React.useCallback(() => {

  //   }, []),
  // );

  // const handleFavoritePress = async item => {
  //   let updatedFavorites;
  //   if (foodFavourite.some(favorite => favorite.code === item.code)) {
  //     removeFromFavoriteMessage();
  //     updatedFavorites = foodFavourite.filter(
  //       favorite => favorite.code !== item.code,
  //     );
  //   } else {
  //     addToFavoriteMessage();
  //     updatedFavorites = [...foodFavourite, item];
  //   }
  //   console.log('Update: ', updatedFavorites);
  //   setFoodFavorites(updatedFavorites);
  //   await AsyncStorage.setItem(
  //     'CategoryItemsfav',
  //     JSON.stringify(updatedFavorites),
  //   );
  // };

  const addToFavoriteMessage = () => {
    toast.success('Added to favorite', {
      duration: 2000,
      position: ToastPosition.BOTTOM,
      styles: {
        view: {
          backgroundColor: COLORS.primary,
          borderRadius: 5,
          // bottom: 30,
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
        newFavorites = prevFavorites.filter(
          fav => fav.code !== restaurant.code,
        );
        removeFromFavoriteMessage();
      } else {
        addToFavoriteMessage();
        newFavorites = [...prevFavorites, restaurant];
      }
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  // Render Near By Hotels
  const renderNearByResturant = () => {
    return (
      <View>
        <SubHeaderItem
          title="Near By Resturant!"
          navTitle="View all"
          onPress={() => navigation.navigate('NearByResturants')}
        />
        <View style={{backgroundColor: 'white', marginVertical: 3}}>
          <FlatList
            data={resturentFoods}
            keyExtractor={item => item.code}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              const distance = distances[item.code] || 9999; // Use 9999 as default if distance is not calculated
              const dChargesMin = item.deliveryChargesMinimum;
              const dChargesPK = item.deliveryChargesPerKm;
              const deliveryCharges = calculateDeliveryCharges(
                distance,
                dChargesPK,
                dChargesMin,
              );
              const isFavorite = favorites.some(fav => fav.code === item.code);

              // Only render restaurants with a valid distance
              if (distance < 9999) {
                return (
                  <View>
                    <NearResturantCard
                      name={item.name}
                      image={images.hamburger3}
                      distance={`${distance} km`}
                      price={deliveryCharges}
                      rating={item.rating}
                      isFavorite={isFavorite}
                      onPress={() =>
                        navigation.navigate('CategoryHamburger', {
                          vendorcode: item.code,
                          distance: distance,
                          deliveryCharges: deliveryCharges,
                        })
                      }
                      onFavoritePress={() => {
                        toggleFavorite({
                          ...item,
                          distance: distance,
                          deliveryCharges: deliveryCharges,
                        });
                      }}
                    />
                  </View>
                );
              }
              return null; // Don't render restaurants with invalid distances
            }}
          />
        </View>
      </View>
    );
  };
  //End Hotels

  /**
   * render discount foods
   */

  const renderDiscountedFoods = () => {
    return (
      <View>
        <SubHeaderItem
          title="Items!"
          navTitle="View all"
          onPress={() => navigation.navigate('DiscountFoods')}
        />
        <View style={{backgroundColor: 'white', marginVertical: 16}}>
          <FlatList
            data={discountFoods}
            keyExtractor={item => item.code}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              const isFavorite = foodFavourite.some(
                fav => fav.code === item.code,
              );
              return (
                <VerticalFoodCard
                  name={item.name}
                  vendorName={item.vendorStore.name}
                  image={item.logo}
                  isFavorite={isFavorite}
                  onPress={() =>
                    navigation.navigate('FoodDetailsAddItem', {
                      itemCode: item.code,
                    })
                  }
                  onFavoritePress={() => handleFavoritePress(item)}
                />
              );
            }}
          />
        </View>
      </View>
    );
  };

  /**
   * render recommended foods
   */
  const renderRecommendedFoods = () => {
    const [selectedCategories, setSelectedCategories] = useState(['1']);

    const filteredFoods = recommendedFoods.filter(
      food =>
        selectedCategories.includes('1') ||
        selectedCategories.includes(food.categoryId),
    );

    // Category item
    const renderCategoryItem = ({item}) => (
      <TouchableOpacity
        style={{
          backgroundColor: selectedCategories.includes(item.id)
            ? COLORS.primary
            : 'transparent',
          padding: 10,
          marginVertical: 5,
          borderColor: COLORS.primary,
          borderWidth: 1.3,
          borderRadius: 24,
          marginRight: 12,
        }}
        onPress={() => toggleCategory(item.id)}>
        <Text
          style={{
            color: selectedCategories.includes(item.id)
              ? COLORS.white
              : COLORS.primary,
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );

    // Toggle category selection
    const toggleCategory = categoryId => {
      const updatedCategories = [...selectedCategories];
      const index = updatedCategories.indexOf(categoryId);

      if (index === -1) {
        updatedCategories.push(categoryId);
      } else {
        updatedCategories.splice(index, 1);
      }

      setSelectedCategories(updatedCategories);
    };

    return (
      <View>
        <SubHeaderItem
          title="Recommended For You!😍"
          navTitle="See all"
          onPress={() => navigation.navigate('RecommendedFoods')}
        />
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={renderCategoryItem}
        />
        <View
          style={{
            backgroundColor: 'white',
            marginVertical: 16,
          }}>
          <FlatList
            data={filteredFoods}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <HorizontalFoodCard
                  name={item.name}
                  image={item.image}
                  distance={item.distance}
                  price={item.price}
                  fee={item.fee}
                  rating={item.rating}
                  numReviews={item.numReviews}
                  isPromo={item.isPromo}
                  onPress={() => navigation.navigate('FoodDetails')}
                />
              );
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <BarIndicator color={COLORS.primary} />
          </View>
        ) : (
          <>
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* {renderBanner()} */}
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Banner dashboardData={dashboardData} />
              </View>

              {renderSearchBar()}
              {renderCategories()}
              {renderNearByResturant()}
              {renderDiscountedFoods()}
              {/* {renderRecommendedFoods()} */}
            </ScrollView>
          </>
        )}
      </View>
      <Toasts />

      <ErrorModal
        visible={modalVisible}
        message={errorMessage}
        onClose={() => setModalVisible(false)}
      />

      <SuccessModal
        visible={successModalVisible}
        message={successMessage}
        onClose={() => {
          setSuccessModalVisible(false);
          navigation.navigate('Login');
        }}
      />

      <AddressPromptModal
        visible={addressModalVisible}
        // onClose={() => setAddressModalVisible(false)}
        title="Address not set"
        message="It looks like you haven’t set an address yet."
        buttonLabel="Select an address"
        // onButtonPress={handleAddAddress}
        // hasAddress={!!address}
        // address={address}
        secondaryAction={() => alert('Another action')}
        secondaryLabel="Do Later"
        handleAddAddress={handleAddAddress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginBottom: hp('5%'),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp('4%'),
    paddingTop: 12,
    //alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    width: '100%',
  },
  addressContainer: {
    flex: 1,
    marginRight: wp('2%'),
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: 'black',
    flex: 1,
  },

  caretIcon: {
    marginLeft: wp('2%'),
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: wp('4%'),
  },
  icon: {
    width: wp('5%'),
    height: wp('5%'),
  },

  userIcon: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('8%'),
  },
  viewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeeting: {
    fontSize: wp('3%'),
    fontFamily: 'Urbanist Regular',
    color: 'black',
    fontWeight: '600',
  },
  title: {
    fontSize: wp('5%'),
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
  },
  viewNameContainer: {
    marginLeft: wp('3%'),
    marginBottom: hp('2%'),
  },
  viewRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    height: wp('5%'),
    width: wp('5%'),
    tintColor: COLORS.black,
    marginRight: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  bookmarkIcon: {
    height: wp('5%'),
    width: wp('5%'),
    tintColor: COLORS.black,
    marginRight: wp('3%'),
  },
  bookmarkIconn: {
    height: wp('5%'),
    width: wp('5%'),
    marginRight: wp('3%'),
    backgroundColor: 'red',
    borderRadius: 10,
  },
  searchBarContainer: {
    // width: wp('92%'),
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    height: hp('6.5%'),
    marginVertical: hp('1%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  basketIcon: {
    width: wp('6%'),
    height: wp('6%'),
    tintColor: COLORS.greyscale900,
  },
  searchIcon: {
    height: wp('6%'),
    width: wp('6%'),
    tintColor: COLORS.gray,
  },
  searchInput: {
    flex: 1,
    fontSize: wp('4%'),
    fontFamily: 'Urbanist Regular',
    marginHorizontal: wp('2%'),
  },
  filterIcon: {
    width: wp('6%'),
    height: wp('6%'),
    tintColor: COLORS.primary,
  },
  // bannerContainer: {
  //   width: wp('92%'),
  //   height: hp('19%'),
  //   paddingHorizontal: wp('7%'),
  //   paddingTop: hp('3.5%'),
  //   borderRadius: wp('8%'),
  // },
  bannerContainer: {
    width: SIZES.width,
    height: hp(25),
  },
  bannerSlide: {
    width: SIZES.width,
    height: hp(25),
    position: 'relative',
  },
  bannerImage: {
    width: wp(100),
    height: hp(25),
    resizeMode: 'cover',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  bannerDescription: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },

  bannerTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerDicount: {
    fontSize: wp('3%'),
    fontFamily: 'Urbanist Medium',
    color: COLORS.white,
    marginBottom: hp('0.5%'),
  },
  bannerDiscountName: {
    fontSize: wp('4%'),
    fontFamily: 'Urbanist Bold',
    color: COLORS.white,
  },
  bannerDiscountNum: {
    fontSize: wp('11.5%'),
    fontFamily: 'Urbanist Bold',
    color: COLORS.white,
  },
  bannerBottomContainer: {
    marginTop: hp('1%'),
  },
  bannerBottomTitle: {
    fontSize: wp('3.5%'),
    fontFamily: 'Urbanist Medium',
    color: COLORS.white,
  },
  bannerBottomSubtitle: {
    fontSize: wp('3.5%'),
    fontFamily: 'Urbanist Medium',
    color: COLORS.white,
    marginTop: hp('0.5%'),
  },
  userAvatar: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
  },
  firstName: {
    fontSize: wp('4%'),
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.dark2,
    marginTop: hp('0.75%'),
  },
  bannerItemContainer: {
    width: '100%',
    paddingBottom: hp('1.25%'),
    backgroundColor: COLORS.primary,
    height: hp('21%'),
    borderRadius: wp('2.5%'),
  },
  basketCountContainer: {
    position: 'absolute',
    top: -hp('0.6%'),
    right: -wp('1.25%'),
    backgroundColor: COLORS.primary,
    borderRadius: wp('2.5%'),
    width: wp('5%'),
    height: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  basketCountText: {
    color: COLORS.white,
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.white,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
