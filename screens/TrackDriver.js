import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import Header from '../components/Header';
import MapView, {
  Marker,
  Callout,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import {mapStandardStyle} from '../data/mapData';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapViewDirections from 'react-native-maps-directions'; // Import MapViewDirections
import driverMarkerImage from '../assets/images/car.png';
import restaurantMarkerImage from '../assets/images/shopAround.png';
import authStorage from '../auth/storage';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BarIndicator} from 'react-native-indicators';
import HeaderForTracking from '../components/HeaderForTracking';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const TrackDriver = ({navigation, route}) => {
  const [directionModalVisible, setDirectionModalVisible] = useState(true);
  const refRBSheet = useRef();
  const Latitude = parseFloat(route.params.Latitude);
  const Longitude = parseFloat(route.params.Longitude);
  const [firstStoreLatitude, setFirstStoreLatitude] = useState();
  const [firstStoreLongitude, setFirstStoreLongitude] = useState();
  const [remainingTime, setRemainingTime] = useState(120); //= 2 minutes
  const timerRef = useRef(null);
  const {ordersCode, vendorCode} = route.params;
  const isFocused = useIsFocused();
  const [restaurantLatitude, setRestaurantLatitude] = useState(0);
  const [restaurantLongitude, setRestaurantLongitude] = useState(0);
  const [driverLatitude, setdriverLatitude] = useState(0);
  const [driverLongitude, setdriverLongitude] = useState(0);
  const [locationInterval, setLocationInterval] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const statusIcons = [
    {status: 'Confirmed', icon: icons.restaurant_green},
    {status: 'RiderAssigned', icon: icons.user_green},
    {status: 'Prepairing', icon: icons.package_green}, // This will cover both Preparing and ReadyToDeliver
    {status: 'RiderPicked', icon: icons.motorbike_green},
    {status: 'RiderArrivedAtDestination', icon: icons.location_green}, // This will cover both RiderArrivedAtDestination and Delivered
  ];
  const [isLoading, setIsLoading] = useState(true);

  const [isDisabled, setIsDisabled] = useState(false);
  console.log(Latitude);
  console.log(Longitude);
  console.log('Order code  = ', ordersCode);
  console.log('vendor code  = ', vendorCode);

  // useEffect(() => {
  //   if (orderStatus.statu !== 'New') {
  //     setIsDisabled(true);
  //   }
  // }, [orderStatus]);

  useEffect(() => {
    refRBSheet.current.open();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    // startTimer();
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    const Token = await authStorage.getToken();
    const myHeaders = new Headers();
    myHeaders.append('Authorization', Token);
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    try {
      const apiUrl = `https://server.saugeendrives.com:9001/api/v1.0/VendorStore?Code=${vendorCode}`;
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.text();
      const parsedResult = JSON.parse(result);
      console.log(' VendorStore get api result= ', parsedResult);
      const stores = parsedResult.stores;
      const firstStoreLatitude = parseFloat(stores[0]?.latitude || 0);
      const firstStoreLongitude = parseFloat(stores[0]?.longitude || 0);

      // setFirstStoreLatitude(firstStoreLatitude);
      // setFirstStoreLongitude(firstStoreLongitude);
      // console.log(`First Store Latitude: ${firstStoreLatitude}`); // `${latitude}`
      // console.log(`First Store Longitude: ${firstStoreLongitude}`);
      setRestaurantLatitude(firstStoreLatitude);
      setRestaurantLongitude(firstStoreLongitude);
    } catch (error) {
      console.error('errrrrrorrrr = ', error);
    }
  };

  const orderTrackingApi = async () => {
    const Token = await authStorage.getToken();
    const myHeaders = new Headers();
    myHeaders.append('Authorization', Token);
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    try {
      const apiUrl = `https://server.saugeendrives.com:9001/api/v1.0/Order/${ordersCode}/tracking`;
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      console.log('Order tracking api result = ', result);
      const trackingData = result.tracking[0];

      setdriverLatitude(trackingData.latitude);
      setdriverLongitude(trackingData.longitude);

      // Calculate distance between driver and user
      // const distance = calculateDistance(
      //   trackingData.latitude,
      //   trackingData.longitude,
      //   Latitude,
      //   Longitude
      // );

      // if (distance < 0.1) {
      //  // showAlert();

      //   if (locationInterval) {
      //     clearInterval(locationInterval);
      //   }
      // }

      // console.log('Order tracking api result=', result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let interval;

    if (isFocused) {
      interval = setInterval(() => {
        orderTrackingApi();
        // checkOrderStatus();
      }, 3000);
      setLocationInterval(interval);
    }

    // Clean up the interval when the component unmounts or loses focus
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isFocused]);

  useEffect(() => {
    // refRBSheet.current.open();
    // setIsLoading(true);

    const statusInterval = setInterval(() => {
      checkOrderStatus();
    }, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(statusInterval);
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime === 0) {
          clearInterval(timerRef.current);
          // showAlert(); // Call the function to show the alert
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Decrease the remaining time every second
  };

  const shouldBeColored = status => {
    const statusOrder = [
      'Confirmed',
      'RiderAssigned',
      'Prepairing',
      'ReadyToDeliver',
      'RiderPicked',
      'RiderArrivedAtDestination',
      'Delivered',
    ];
    const statusIndex = statusOrder.indexOf(status);
    const currentStatusIndex = statusOrder.indexOf(orderStatus.status);

    if (
      status === 'Prepairing' &&
      (orderStatus.status === 'Prepairing' ||
        orderStatus.status === 'ReadyToDeliver')
    ) {
      return true;
    }

    if (
      status === 'RiderArrivedAtDestination' &&
      (orderStatus.status === 'RiderArrivedAtDestination' ||
        orderStatus.status === 'Delivered')
    ) {
      return true;
    }

    return statusIndex <= currentStatusIndex && currentStatusIndex !== -1;
  };

  const getGrayIcon = status => {
    switch (status) {
      case 'Confirmed':
        return icons.restuarant_black;
      case 'RiderAssigned':
        return icons.user_black;
      case 'Prepairing':
        return icons.package_black;
      case 'RiderPicked':
        return icons.motorbike_black;
      case 'RiderArrivedAtDestination':
        return icons.location_black;
      default:
        return icons.restuarant_black;
    }
  };

  const getStatus = index => {
    switch (index) {
      case 0:
        return 'Confirmed';
      case 1:
        return 'Assigned';
      case 2:
        return 'Prepairing';
      case 3:
        return 'Picked';
      case 4:
        return 'Arrived';
      default:
        return '';
    }
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  const checkOrderStatus = async () => {
    try {
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        `https://server.saugeendrives.com:9001/api/v1.0/Order?code=${ordersCode}`,
        requestOptions,
      );
      const resultText = await response.text();
      const result = JSON.parse(resultText);

      if (result.orders && result.orders.length > 0) {
        setIsLoading(false);
        const statuscheck = result.orders[0];
        // console.log('Current order status:', statuscheck); // Add this log
        setOrderStatus(statuscheck); // Update the order status state

        if (statuscheck === 'Delivered') {
          showAlert();
        }
      } else {
        console.log('No orders found in the response');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in checkOrderStatus:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = () => {
    Alert.alert(
      'Note',
      'The driver has arrived at your destination!',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('RateTheDriver', {ordersCode: ordersCode});
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderRiderInfo = () => {
    return (
      <View style={styles.orderStatusContainer}>
        <View style={styles.driverLeftInfo}>
          <Image
            source={icons.userDefault2}
            style={styles.riderImage}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.driverName,
              {
                color: COLORS.greyscale900,
              },
            ]}>
            {orderStatus.riderProfile?.fullName.length > 20
              ? `${orderStatus.riderProfile?.fullName.substring(0, 27)}...`
              : orderStatus.riderProfile?.fullName}
          </Text>
        </View>
        <View style={styles.driverRightContainer}>
          <View
            // onPress={() => {
            //   refRBSheet.current.close();
            //   navigation.navigate('WhatsYourMood');
            // }}
            style={styles.driverRightReview}>
            <Image
              source={icons.star2}
              resizeMode="contain"
              style={styles.starIcon}
            />
            <Text
              style={[
                styles.starNum,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              {orderStatus.riderRating == null ? 0 : orderStatus.riderRating}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        {/* {renderDirectionModal()} */}
        <View style={[styles.headerContainer, {backgroundColor: COLORS.white}]}>
          <HeaderForTracking title="Track Your Order" />
        </View>

        <TouchableOpacity
          onPress={() => {
            refRBSheet.current.open();
          }}
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            zIndex: 999,
          }}>
          <Image
            source={require('../assets/images/up-arrow.png')}
            style={{
              width: 35,
              height: 30,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>

        <MapView
          style={styles.mapContainer}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStandardStyle}
          userInterfaceStyle="dark"
          initialRegion={{
            latitude: Latitude,
            longitude: Longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
              latitude: Latitude, //User's lat
              longitude: Longitude, //User's long
            }}
            image={icons.mapsOutline}
            title="Move"
            description="Address"
            onPress={() => console.log('')}>
            <Callout tooltip>
              <View>
                <View style={styles.bubble}>
                  <Text
                    style={{
                      ...FONTS.body4,
                      fontWeight: 'bold',
                      color: COLORS.black,
                    }}>
                    Your location
                  </Text>
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
          </Marker>

          <Marker
            coordinate={{
              latitude: parseFloat(driverLatitude), // driverLatitude
              longitude: parseFloat(driverLongitude), // driverLongitude
            }}
            title="Driver Location"
            description="Driver's current location"
            anchor={{x: 0.5, y: 0.5}} // Anchor point of the marker image
            flat={true} // Disables the 3D effect, making the marker image flat
          >
            <Image
              source={icons.rider_location}
              style={{width: 30, height: 30, resizeMode: 'contain'}} // Adjust width and height as needed
            />
          </Marker>

          <Marker
            coordinate={{
              latitude: parseFloat(restaurantLatitude), // Adjust the latitude value as needed
              longitude: parseFloat(restaurantLongitude), // Adjust the longitude value as needed
            }}
            title="Resturant"
            description="Abc resturant"
            flat={true}
            anchor={{x: 0.5, y: 0.5}}>
            <Image
              source={restaurantMarkerImage}
              style={{width: 30, height: 30, resizeMode: 'contain'}} // Adjust width and height as needed
            />
          </Marker>

          <MapViewDirections
            origin={{
              latitude: parseFloat(driverLatitude), // driverLatitude
              longitude: parseFloat(driverLongitude), // driverLongitude
            }}
            destination={{
              latitude: parseFloat(restaurantLatitude), // restaurantLatitude
              longitude: parseFloat(restaurantLongitude), // restaurantLongitude
            }}
            apikey="AIzaSyCq5Y4F8m77wt929gwKepvFlO4aBLO7bt4" // Replace with your Google Maps API key
            strokeWidth={3}
            strokeColor="green"
          />

          <MapViewDirections
            origin={{
              latitude: parseFloat(restaurantLatitude), // restaurantLatitude
              longitude: parseFloat(restaurantLongitude), // restaurantLongitude
            }}
            destination={{
              latitude: Latitude, // userLatitude
              longitude: Longitude, // userLongitude
            }}
            apikey="AIzaSyCq5Y4F8m77wt929gwKepvFlO4aBLO7bt4" // Replace with your Google Maps API key
            strokeWidth={3}
            strokeColor="green"
          />
        </MapView>

        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true} // Disable default drag down close
          closeOnPressMask={true} // Disable default mask close
          height={SCREEN_HEIGHT}
          draggableIcon={true}
          draggable={isLoading ? false : true}
          dragOnContent={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0)',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              borderTopRightRadius: 32,
              borderTopLeftRadius: 32,
              height: 300,
              backgroundColor: COLORS.white,
              justifyContent: isLoading ? 'center' : 'flex-start',
            },
          }}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <BarIndicator color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.bottomContainer}>
              {orderStatus.status === 'New' ? (
                <View style={styles.restuarantStatusContainer}>
                  <Text style={{color: COLORS.grayscale700}}>
                    Waiting for Restaurant ...
                  </Text>
                </View>
              ) : orderStatus.status === 'Confirmed' ? (
                <View style={styles.findingRiderContainer}>
                  <Image
                    source={icons.userDefault2}
                    style={styles.riderImage}
                    resizeMode="contain"
                  />
                  <Text style={{marginLeft: 10, color: COLORS.grayscale700}}>
                    Finding Driver ...
                  </Text>
                </View>
              ) : (
                renderRiderInfo()
              )}
              <View style={styles.bottomTopContainer}>
                <View style={styles.statusIconsContainer}>
                  {statusIcons.map((item, index) => {
                    const isColored = shouldBeColored(item.status);
                    const isLastIcon = index === statusIcons.length - 1;
                    return (
                      <React.Fragment key={index}>
                        <View style={styles.statusIconWrapper}>
                          <Image
                            source={
                              isColored ? item.icon : getGrayIcon(item.status)
                            }
                            style={styles.statusIcon}
                          />
                          <Text
                            style={{
                              color: COLORS.black,
                              fontSize: SIZES.body2 - 12,
                            }}>
                            {getStatus(index)}
                          </Text>
                        </View>
                        {!isLastIcon && (
                          <View
                            style={[
                              styles.statusLine,
                              {
                                backgroundColor: shouldBeColored(
                                  statusIcons[index + 1].status,
                                )
                                  ? COLORS.primary
                                  : COLORS.grayscale400,
                              },
                            ]}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
              {/* <View style={styles.separateLine} /> */}

              {/* <View style={styles.driverInfoContainer}>
              <View style={styles.driverLeftInfo}>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.close();
                    navigation.navigate("DriverDetails")
                  }}>
                  <Image
                    source={images.user2}
                    resizeMode='contain'
                    style={styles.driverImage}
                  />
                </TouchableOpacity>
                <View>
                  <Text
                    style={[
                      styles.driverName,
                      {
                        color: COLORS.greyscale900,
                      },
                    ]}>
                    Daniel Austin
                  </Text>
                  <Text
                    style={[
                      styles.driverCar,
                      {
                        color: COLORS.grayscale700,
                      },
                    ]}>
                    Mercedes-Benz E-class
                  </Text>
                </View>
              </View>
              <View style={styles.driverRightContainer}>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.close();
                    navigation.navigate('WhatsYourMood');
                  }}
                  style={styles.driverRightReview}>
                  <Image
                    source={icons.star2}
                    resizeMode="contain"
                    style={styles.starIcon}
                  />
                  <Text
                    style={[
                      styles.starNum,
                      {
                        color: COLORS.greyscale900,
                      },
                    ]}>
                    4.8
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.taxiID,
                    {
                      color: COLORS.greyscale900,
                    },
                  ]}>
                  HSW 4736 XK
                </Text>
              </View>
            </View> */}

              {/* <View style={styles.separateLine} /> */}

              {/* <View style={styles.locationItemContainer}>
              <View style={styles.locationItemRow}>
                <View style={styles.locationIcon1}>
                  <View style={styles.locationIcon2}>
                    <Image
                      source={icons.location2}
                      resizeMode='contain'
                      style={styles.locationIcon3}
                    />
                  </View>
                </View>
                <View>
                  <Text style={[styles.baseLocationName, {
                    color: COLORS.greyscale900
                  }]}>
                    Soft Bank Buildings
                  </Text>
                  <Text style={[styles.baseLocationAddress, {
                    color: COLORS.greyScale800
                  }]}>
                    26 States St. Daphne, AL 36526
                  </Text>
                </View>
              </View>
              <Text style={[styles.locationDistance, {
                color: COLORS.greyscale900
              }]}>4 Km</Text>
            </View> */}

              {/* <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.close();
                  setDirectionModalVisible(true)
                }}
                style={[styles.actionBtn, {
                  backgroundColor: COLORS.tansparentPrimary
                }]}>
                <Image
                  source={icons.close}
                  resizeMode='contain'
                  style={[styles.actionIcon, {
                    tintColor: COLORS.black
                  }]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.close();
                  navigation.navigate("Chat")
                }}
                style={styles.actionBtn}>
                <Image
                  source={icons.chat}
                  resizeMode='contain'
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.close();
                  navigation.navigate("Call")
                }}
                style={styles.actionBtn}>
                <Image
                  source={icons.telephone}
                  resizeMode='contain'
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
            </View> */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 20,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                    fontWeight: '600',
                  }}>
                  Estimated Delivery Time{' '}
                </Text>
                <Text style={{color: COLORS.black}}>...</Text>
              </View>

              {/* 
            <TouchableOpacity
              style={{
                marginTop: 40,
                backgroundColor: isDisabled
                  ? COLORS.grayscale400
                  : COLORS.primary,
                height: hp(6),
                justifyContent: 'center',
                alignItems: 'center',
                width: '95%',
                borderRadius: 15,
              }}
              disabled={isDisabled}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '400'}}>
                Cancel Order
              </Text>
            </TouchableOpacity> */}
            </View>
          )}
        </RBSheet>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    padding: 16,
    zIndex: 99999,
    backgroundColor: COLORS.white,
  },
  bottomContainer: {
    // position: 'absolute',
    // bottom: 0,
    // height: 250,
    // right: 0,
    // left: 0,
    width: '100%',
    paddingHorizontal: 16,
    // alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  btn: {
    width: SIZES.width - 32,
    marginTop: 12,
  },
  locationMapContainer: {
    height: 226,
    width: '100%',
    borderRadius: 12,
    marginVertical: 16,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.dark2,
  },
  viewMapContainer: {
    height: 50,
    backgroundColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 'auto',
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  bottomTopContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    width: '100%',
    marginTop: 22,
  },
  bottomTopTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
  },
  bottomTopSubtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: 'Urbanist Regular',
  },
  separateLine: {
    height: 0.4,
    width: SIZES.width - 32,
    backgroundColor: COLORS.greyscale300,
    marginVertical: 12,
  },
  addressItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  addressItemLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverInfoContainer: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverLeftInfo: {
    flexDirection: 'row',
    marginLeft: wp(2),
    alignItems: 'center',
  },
  driverImage: {
    width: 52,
    height: 52,
    borderRadius: 999,
    marginRight: 12,
  },
  driverName: {
    fontSize: 14,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    marginLeft: wp(2),
  },
  driverCar: {
    fontSize: 14,
    color: COLORS.grayscale700,
    fontFamily: 'Urbanist Regular',
    marginTop: 6,
  },
  driverRightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: wp(1),
  },
  driverRightReview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    height: hp(4),
    width: wp(4),
    tintColor: COLORS.primary,
    marginRight: 3,
  },
  starNum: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: 'Urbanist Regular',
  },
  taxiID: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: 'Urbanist Medium',
    marginTop: 6,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 22,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: 12,
  },
  actionIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  locationItemContainer: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationIcon1: {
    height: 52,
    width: 52,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon2: {
    height: 36,
    width: 36,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon3: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
  },
  baseLocationName: {
    fontSize: 17,
    color: COLORS.greyscale900,
    fontFamily: 'Urbanist Bold',
  },
  baseLocationAddress: {
    fontSize: 14,
    color: COLORS.greyScale800,
    fontFamily: 'Urbanist Regular',
    marginTop: 8,
  },
  arrowIconContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  arrowIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.black,
  },
  locationDistance: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: 'Urbanist Medium',
  },
  locationItemRow: {
    flexDirection: 'row',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Urbanist Regular',
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: 12,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.56)',
  },
  modalSubContainer: {
    height: 520,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22,
  },
  successBtn: {
    width: '100%',
    marginTop: 12,
    borderRadius: 32,
  },
  receiptBtn: {
    width: '100%',
    marginTop: 12,
    borderRadius: 32,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary,
  },
  editPencilIcon: {
    width: 42,
    height: 42,
    tintColor: COLORS.white,
    zIndex: 99999,
    position: 'absolute',
    top: 58,
    left: 58,
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -999,
  },
  happyMood: {
    fontSize: 154,
  },
  statusIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusIconWrapper: {
    alignItems: 'center',
    width: '12%',
  },
  statusIcon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },
  statusText: {
    ...FONTS.caption,
    marginTop: 5,
    textAlign: 'center',
    fontSize: 10,
  },
  statusLine: {
    height: 2,
    width: '10%', // Adjust this value to fit your layout
  },
  restuarantStatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.grayscale100,
    height: hp(7),
    width: wp(90),
    borderRadius: 30,
  },
  orderStatusContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: COLORS.grayscale100,
    height: hp(7),
    width: wp(90),
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  findingRiderContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: COLORS.grayscale100,
    height: hp(7),
    width: wp(90),
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  riderImage: {
    height: hp(10),
    width: wp(10),
  },
});

export default TrackDriver;
