import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Linking,
  FlatList,
  ToastAndroid,
  Alert,
  Animated,
} from 'react-native';
import {COLORS, SIZES, icons} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-virtualized-view';
import PaymentMethodItem from '../components/PaymentMethodItem';

import authStorage from '../auth/storage';
import {BarIndicator} from 'react-native-indicators';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Header from '../components/Header';
import OrderSummaryCard from '../components/OrderSummaryCard';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReverseProgressBar from '../components/ReverseProgressBar';
import ProgressBar from 'react-native-progress/Bar';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';
import {stat} from 'react-native-fs';

const PendingOrder = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [latitude, setlatitude] = useState(null);
  const [longitude, setlongitude] = useState(null);
  const refRBSheet = useRef(null);
  const [showFirstIndicator, setShowFirstIndicator] = useState(true);
  const [showSecondIndicator, setShowSecondIndicator] = useState(false);
  const [showThirdIndicator, setShowThirdIndicator] = useState(false);
  const [showFirstTick, setShowFirstTick] = useState(false);
  const [showSecondTick, setShowSecondTick] = useState(false);
  const [showThirdTick, setShowThirdTick] = useState(false);
  const [firstCardColor, setFirstCardColor] = useState('#009900');
  const [secondCardColor, setSecondCardColor] = useState('#009900');
  const styles1 = getstyles1(firstCardColor, secondCardColor);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isVendorRequestAccepted, setisVendorRequestAccepted] = useState(false);
  const [restaurantCheckInterval, setRestaurantCheckInterval] = useState(null);
  const [riderCheckInterval, setRiderCheckInterval] = useState(null);
  // const [ordersCode, setordersCode] = useState(null);
  // const [vendorCode, setvendorCode] = useState(null);
  const [IscheckboxChecked, setIscheckboxChecked] = useState(false);
  const [isOrderReady, setIsOrderReady] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethodCode, setSelectedPaymentMethodCode] =
    useState(null);
  const [tipAmount, setTipAmount] = useState(route.params?.tipAmount || 0);
  //const { ordersCode, vendorCode} = route.params;
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [shouldCheckStatus, setShouldCheckStatus] = useState(true);
  const [status, setStatus] = useState('New');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progressBarWidth] = useState(new Animated.Value(100));
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const totalDuration = 45; // total countdown duration in seconds
  const [countdown, setCountdown] = useState(totalDuration);
  const [countdown2, setCountdown2] = useState(totalDuration);
  const [progress, setProgress] = useState(1);
  const [progress2, setProgress2] = useState(1);
  const [cancellationReasons, setcancellationReasons] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (countdown > 0) {
        const timer = setInterval(() => {
          setCountdown(prevCountdown => {
            const newCountdown = prevCountdown - 1;
            setProgress(newCountdown / totalDuration);
            return newCountdown;
          });
        }, 1000);

        return () => clearInterval(timer);
      } else {
      }
    }

    fetchReasonCode();
  }, [countdown, isLoading]);

  const timeUp = () => {
    alert('Time is up');
  };

  useEffect(() => {
    if (!isLoading && confirmedOrder) {
      if (countdown2 > 0) {
        const timer = setInterval(() => {
          setCountdown2(prevCountdown => {
            const newCountdown = prevCountdown - 1;
            setProgress2(newCountdown / totalDuration);
            return newCountdown;
          });
        }, 1000);

        return () => clearInterval(timer);
      } else {
      }
    }
  }, [isLoading, countdown2, confirmedOrder]);

  const fetchReasonCode = async () => {
    try {
      const storedLatitude = await AsyncStorage.getItem('latitude');
      const storedLongitude = await AsyncStorage.getItem('longitude');

      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);

      const queryParams = new URLSearchParams({
        Geolocation: `${storedLatitude},${storedLongitude}`,
      });

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        `https://server.saugeendrives.com:9001/api/v1.0/Customer/dashboard?${queryParams.toString()}`,
        requestOptions,
      );

      const jsonData = await response.json();

      console.log('Customer dashboard api = ', jsonData.cancellationReasons);
      console.log('Customer dashboard api = ', jsonData);
      setcancellationReasons(jsonData.cancellationReasons);

      if (!response.ok) {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handelCancelOrder = async (orderCode, status) => {
    try {
      const userKey = 'setUser';
      const storeUser = await AsyncStorage.getItem(userKey);
      if (storeUser) {
        const parsedUser = JSON.parse(storeUser);
        console.log('User retrieved successfully:', parsedUser);

        const Token = await authStorage.getToken();
        const myHeaders = new Headers();

        myHeaders.append('Authorization', Token);
        // Add this line to set the Content-Type header
        myHeaders.append('Content-Type', 'application/json');
        var raw;

        if (status === 'rider') {
          raw = JSON.stringify({
            code: cancellationReasons[1].code,
            reason: cancellationReasons[1].name,
            token: {
              userType: parsedUser.userType,
              unique_name: parsedUser.unique_name,
              email: parsedUser.email,
              identificationCode: parsedUser.identificationCode,
            },
          });

          setSuccessMessage('Rider not available');
        } else if (status === 'restuarant') {
          raw = JSON.stringify({
            code: cancellationReasons[2].code,
            reason: cancellationReasons[2].name,
            token: {
              userType: parsedUser.userType,
              unique_name: parsedUser.unique_name,
              email: parsedUser.email,
              identificationCode: parsedUser.identificationCode,
            },
          });

          setSuccessMessage('Restaurant did not accept the order');
        }

        const requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        const response = await fetch(
          `https://server.saugeendrives.com:9001/api/v1.0/Order/${orderCode}`,
          requestOptions,
        );

        const jsonData = await response.json();
        console.log('Response ==>', jsonData);
        if (response.ok) {
          setSuccessModalVisible(true);
        } else {
          // Add this to handle non-OK responses
          console.log(
            `Error: ${response.status} - ${
              jsonData.message || 'Unknown error'
            }`,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Order?PaymentStatus=Unpaid',
        requestOptions,
      );
      const result = await response.json();

      if (response.ok) {
        // console.log("Order's get api result ", result);
        return result.orders;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const checkAndUpdateOrders = async () => {
    console.log('checkAndUpdateOrders function');
    const newOrders = await fetchOrders();
    if (newOrders) {
      // Filter orders to only include those with the relevant statuses
      const relevantOrders = newOrders.filter(order =>
        ['New', 'Confirmed', 'RiderAssigned'].includes(order.status),
      );

      setOrders(relevantOrders);

      // Check if any order has the status we're looking for
      const hasRelevantStatus = newOrders.some(order =>
        ['New', 'Confirmed', 'RiderAssigned'].includes(order.status),
      );
      await AsyncStorage.setItem(
        'OrdersExist',
        JSON.stringify({isExist: hasRelevantStatus}),
      );

      if (!hasRelevantStatus) {
        // If no orders have the relevant status, clear the interval
        clearInterval(intervalId);
      }
    }
  };

  useEffect(() => {
    let intervalId;

    const startInterval = () => {
      // Fetch orders immediately
      intervalId = setInterval(checkAndUpdateOrders, 2000);
    };

    startInterval();

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // const checkOrderStatusforResturant = async () => {
  //     if (!ordersCode) {
  //         return;
  //     }

  //     try {
  //         const Token = await authStorage.getToken();
  //         const myHeaders = new Headers();
  //         myHeaders.append('Authorization', Token);
  //         myHeaders.append('Content-Type', 'application/json');

  //         const requestOptions = {
  //             method: 'GET',
  //             headers: myHeaders,
  //             redirect: 'follow',
  //         };

  //         const response = await fetch(
  //             `https://server.saugeendrives.com:9001/api/v1.0/Order?code=${ordersCode}`,
  //             requestOptions,
  //         );
  //         const resultText = await response.text();
  //         const result = JSON.parse(resultText);

  //         if (result.orders && result.orders.length > 0) {
  //             const newStatus = result.orders[0].status;
  //             console.log("Status = ", newStatus)

  //             if (newStatus !== status) {
  //                 setStatus(newStatus);

  //                 if (newStatus === 'Confirmed') {
  //                     setShowFirstIndicator(false);
  //                     setShowFirstTick(true);
  //                     console.log('Order has been accepted by the restaurant');
  //                     setFirstCardColor('#6699ff');
  //                     setShowSecondIndicator(true);
  //                 }

  //                 if (newStatus === 'RiderAssigned') {
  //                     setShowFirstIndicator(false);
  //                     setShowFirstTick(true);
  //                     setFirstCardColor('#6699ff');
  //                     setShowSecondIndicator(true);
  //                     console.log('Order has been accepted by the rider');
  //                     setSecondCardColor('#6699ff');
  //                     setShowSecondIndicator(false);
  //                     setShowSecondTick(true);

  //                     // Stop further checks
  //                     return;
  //                 }
  //             }
  //         } else {
  //             console.log('No orders found in the response');
  //         }
  //     } catch (error) {
  //         console.error('Error in checkOrderStatus:', error);
  //     }

  //     // Schedule the next check after 5 seconds, but only if we haven't reached "RiderAssigned"
  //     if (status !== 'RiderAssigned') {
  //         checkOrderStatusforResturant();

  //     }
  // };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <BarIndicator color={COLORS.primary} />
      </View>
    );
  }

  const renderProgressBar = () => {
    return (
      <View style={styles.progressView}>
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            width={250}
            height={20}
            color="green"
            unfilledColor="#e0e0e0"
            borderWidth={1}
            borderColor="#000"
            style={styles.progressBar}
          />
          <View style={styles.progressTextContainer}>
            <Text style={styles.timerText}>
              {countdown} waiting for restuarent
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderOrderItems = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemAmount}>Amount: ${item.amount.toFixed(2)}</Text>
      </View>
    );
  };

  const renderStatusContainers = order => {
    // if (order.status === 'New') {
    //   console.log(order.code);
    // }

    if (order.status === 'New' && countdown <= 0) {
      handelCancelOrder(order.code, 'restuarant');
    }
    if (order.status == 'Confirmed') {
      setConfirmedOrder(true);
      // handelCancelOrder(order.code, 'rider');
    }
    return (
      <View style={styles.statusContainers}>
        <View style={[styles.statusContainer]}>
          {/* <Text style={styles.statusText}>
            Sending request to restaurant...
          </Text> */}
          {order.status === 'New' && countdown > 0 ? (
            // <ActivityIndicator color="white" style={styles.indicator} />
            // renderProgressBar()
            <View>
              <ProgressBar
                progress={progress}
                width={wp(85)}
                height={wp(10)}
                color="green"
                unfilledColor="#e0e0e0"
                //borderColor="#000"
                style={styles.progressBar}
              />
              <View style={styles.progressTextContainer}>
                <Text style={styles.timerText}>
                  {countdown} Waiting for Restuarant
                </Text>
              </View>
            </View>
          ) : order.status == 'Confirmed' || order.status == 'RiderAssigned' ? (
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../assets/images/tick.png')}
                style={styles.tickIcon}
              />
              <Text style={{color: COLORS.black}}>
                Order confirmed from restaurant
              </Text>
            </View>
          ) : (
            <Text>Waiting for rider {order.status}</Text>

            // alert('order canceled')
          )}
        </View>
        <View style={[styles.statusContainer]}>
          {
            order.status == 'Confirmed' &&
            order.status != 'RiderAssigned' &&
            countdown2 > 0 ? (
              <View>
                <ProgressBar
                  progress={progress2}
                  width={wp(85)}
                  height={wp(10)}
                  color="green"
                  unfilledColor="#e0e0e0"
                  //borderColor="#000"
                  style={styles.progressBar}
                />
                <View style={styles.progressTextContainer}>
                  <Text style={styles.timerText}>
                    {countdown2} Finding your nearby driver...
                  </Text>
                </View>
              </View>
            ) : order.status == 'RiderAssigned' ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginRight: 90,
                }}>
                <Image
                  source={require('../assets/images/tick.png')}
                  style={styles.tickIcon}
                />
                <Text style={{color: COLORS.black}}>Rider is Assigned</Text>
              </View>
            ) : order.status === 'Confirmed' ? (
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/images/cross.png')}
                  style={styles.crossIcon}
                />
                <Text style={{color: COLORS.black}}>
                  Rider did not accept the order
                </Text>
              </View>
            ) : (
              <Text style={{color: COLORS.black}}>Waitig for Rider</Text>
            )

            // alert('order canceled')
          }
        </View>
        <View
          style={[
            styles.separateLine,
            {
              backgroundColor: COLORS.grayscale200,
            },
          ]}
        />
      </View>
    );
  };

  const renderOrder = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.orderCard,
          {
            backgroundColor:
              item.status === 'RiderAssigned' ? Colors.grayscale400 : 'white',
          },
        ]}
        onPress={() => {}}>
        <Text style={styles.orderNumber}>Order Number: {item.number}</Text>
        {/* {renderProgressBar()} */}
        <FlatList
          data={item.items}
          renderItem={renderOrderItems}
          keyExtractor={(item, index) => index.toString()}
        />
        {renderStatusContainers(item)}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Pending Orders" />
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item, index) => index.toString()}
      />
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
          navigation.navigate('Home');
        }}
      />
    </SafeAreaView>
  );
};

const getstyles1 = (firstCardColor, secondCardColor, thirdCardColor) =>
  StyleSheet.create({
    cash: {
      marginLeft: wp('4%'),
      color: 'white',
    },

    cashTypo: {
      textAlign: 'left',
      marginLeft: wp('4%'),
      fontSize: wp('4.5%'),
      fontFamily: 'Roboto-Bold',
      fontWeight: '600',
      flex: 1,
    },

    cardSpaceBlock: {
      paddingBottom: hp('3%'),
      paddingRight: wp('4%'),
      paddingTop: hp('3%'),
      paddingLeft: wp('6%'),
      alignItems: 'center',
      flexDirection: 'row',
      width: wp('90%'),
      borderRadius: wp('3%'),
    },
    cardPayment: {
      borderColor: '#e9eaeb',
      borderWidth: 1,
      borderStyle: 'solid',
      backgroundColor: firstCardColor,
      marginBottom: hp('2.5%'),
    },
    cardPayment1: {
      borderColor: '#e9eaeb',
      borderWidth: 1,
      borderStyle: 'solid',
      backgroundColor: secondCardColor,
      marginBottom: hp('2.5%'),
    },
    space: {
      alignSelf: 'stretch',
      backgroundColor: '#d9d9d9',
      height: hp('5%'),
      marginTop: hp('1.5%'),
      opacity: 0,
    },
    list: {
      top: hp('2%'),
      height: hp('25%'),
    },
  });

const styles = StyleSheet.create({
  separateLine: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: hp(2),
    paddingLeft: 10,
  },
  orderCard: {
    marginHorizontal: wp('4%'),
    marginTop: wp('4%'),
    elevation: 1,
  },
  orderNumber: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    color: COLORS.primary,
  },
  orderNumberr: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: COLORS.gray2,
  },
  itemContainer: {
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  itemName: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  itemQuantity: {
    fontSize: wp('3.5%'),
    color: COLORS.gray,
  },
  itemAmount: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusContainers: {
    marginTop: hp('2%'),
    marginHorizontal: 12,
  },
  statusContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    // padding: wp('3%'),
    // borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  statusText: {
    color: COLORS.white,
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  indicator: {
    marginLeft: wp('2%'),
  },
  tickIcon: {
    width: wp('5%'),
    height: wp('5%'),
  },
  crossIcon: {
    width: wp('5%'),
    height: wp('5%'),
  },
  progressView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    borderRadius: 5,
  },
  progressTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('80%'), // Same width as the ProgressBar
    height: 40, // Same height as the ProgressBar
    borderRadius: 5,
  },
  timerText: {
    fontSize: 15,
    color: '#fff',
  },
});

export default PendingOrder;
