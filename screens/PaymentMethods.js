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
  BackHandler,
} from 'react-native';
import {COLORS, SIZES, icons} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {ScrollView} from 'react-native-virtualized-view';
import PaymentMethodItem from '../components/PaymentMethodItem';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import authStorage from '../auth/storage';
import {BarIndicator} from 'react-native-indicators';
import {WebView} from 'react-native-webview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import BottomSheet from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import Icon from 'react-native-vector-icons/Ionicons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const PaymentMethods = ({navigation, route}) => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [IscheckboxChecked, setIscheckboxChecked] = useState(false);
  const [isOrderReady, setIsOrderReady] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethodCode, setSelectedPaymentMethodCode] =
    useState(null);
  // const [tipAmount, setTipAmount] = useState(route.params?.tipAmount || 0);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const {ordersCode, vendorCode, tipAmount} = route.params;
  const [showWebView, setShowWebView] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(true);

  console.log('ordersCode = ', ordersCode);
  console.log('vendorCode = ', vendorCode);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPaymentMethods();
      fetchStoredLocationfromAsync();
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = async () => {
        navigation.navigate('CheckoutOrdersCompleted', {
          isPaymentSuccessfull: false,
        });
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  //   useFocusEffect(
  //     React.useCallback(() => {
  //     const errorToastMessage = async ()=>{

  //       try {

  //           const Token = await authStorage.getToken();
  //           const myHeaders = new Headers();
  //           myHeaders.append("Authorization", Token);

  //           const urlWithParams = `https://server.saugeendrives.com:9001/api/v1.0/Order?Code=${ordersCode}`;

  //           const requestOptions = {
  //             method: "GET",
  //             headers: myHeaders,
  //             redirect: "follow"
  //           };

  //           const response = await fetch(urlWithParams, requestOptions);
  //           const result = await response.json();
  //           console.log("Payment status check:", result.orders[0].paymentStatus);
  //           if(result.orders[0].paymentStatus === "Unpaid" && result.orders[0].paymentMode){

  //             toast.error(
  //               `Your payment process is not complete. Please try again`,
  //               {

  //                 isSwipeable: true,
  //                 position: ToastPosition.BOTTOM,
  //                 styles: {
  //                   view: {
  //                     backgroundColor: '#11A267',
  //                     borderRadius: 10,
  //                     paddingVertical: 10,
  //                     paddingHorizontal: 15
  //                   },
  //                   text: {
  //                     color: 'white',
  //                     fontSize: 16,
  //                     lineHeight: 22
  //                   },
  //                   indicator: { backgroundColor: 'white' },
  //                 },
  //               }
  //             );

  //           }

  //       } catch (error) {

  //       }

  //     }
  //     errorToastMessage()
  //   }, [])
  // );

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const myHeaders = new Headers();

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/PaymentMode',
        requestOptions,
      );

      const result = await response.json();
      console.log('Payment methods fetched ', result);

      if (result.code === 'OK' && result.list) {
        setPaymentMethods(result.list);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const paymentMethodPost = async () => {
  //   try {

  //     const myHeaders = new Headers();

  //   const raw = JSON.stringify({
  //     "paymentModeCode": selectedPaymentMethodCode ,
  //     "tip": tipAmount
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow"
  //   };

  //   const response = await fetch(`https://server.saugeendrives.com:9001/api/v1.0/OrderPayment/${ordersCode}/create`, requestOptions)
  //   const result = await response.json();
  //     console.log('Payment methods post api = ',result)

  //   }

  //   catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const paymentMethodPost = async () => {
    setIsLoading(true);
    const Token = await authStorage.getToken();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', Token);

    const raw = JSON.stringify({
      paymentModeCode: selectedPaymentMethodCode,
      tip: tipAmount,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        `https://server.saugeendrives.com:9001/api/v1.0/OrderPayment/${ordersCode}/create`,
        requestOptions,
      );
      const result = await response.json();
      console.log('Payment methods post api =', result);

      if (result.code === 'OK' && result.payment) {
        if (result.payment.url && result.payment.url !== 'N/A') {
          // Credit card payment
          setPaymentUrl(result.payment.url);
          setShowWebView(true); // Show the WebView instead of opening externally
        } else {
          await AsyncStorage.removeItem('basketItems');
          await AsyncStorage.removeItem('basketCount');
          // Clear applied discounts
          await AsyncStorage.removeItem('appliedDiscounts');
          // Cash on delivery
          setIsLoading(false);
          navigation.navigate('TrackDriver', {
            Latitude: latitude,
            Longitude: longitude,
            ordersCode: ordersCode,
            vendorCode: vendorCode,
          });
        }
      }
    } catch (error) {
      console.error('Error in payment method post:', error);
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);
      console.log('token==>', Token);

      const urlWithParams = `https://server.saugeendrives.com:9001/api/v1.0/Order?Code=${ordersCode}`;

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      while (true) {
        const response = await fetch(urlWithParams, requestOptions);
        const result = await response.json();
        console.log('Payment status check:', result.orders[0].paymentStatus);

        if (result.orders[0].paymentStatus === 'AuthOnly') {
          setIsLoading(false);
          await AsyncStorage.removeItem('basketItems');
          await AsyncStorage.removeItem('basketCount');
          // Clear applied discounts
          await AsyncStorage.removeItem('appliedDiscounts');
          setTimeout(() => {
            navigation.navigate('Orders', {isPaymentSuccessfull: true});
          }, 2000);
          break; // Exit the loop when status is 'AuthOnly'
        }
        setIsLoading(false);

        // Wait for 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setIsLoading(false);
    }
  };
  // const fetchOrders = async () => {
  //   try {
  //     const Token = await authStorage.getToken();
  //     const myHeaders = new Headers();
  //     myHeaders.append('Authorization', Token);

  //     const requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow',
  //     };

  //     const response = await fetch(
  //       'https://server.saugeendrives.com:9001/api/v1.0/Order',
  //       requestOptions,
  //     );
  //     const result = await response.json();

  //     if (response.ok) {
  //       console.log("Order's get api result ", result);
  //       const firstOrder = result.orders[0].code;
  //       const Vendorcode = result.orders[0].vendorStore.code;
  //       await AsyncStorage.setItem('OrderCode', firstOrder);
  //       await AsyncStorage.setItem('VendorCode', Vendorcode);
  //       console.log(' Order Code: ', firstOrder);
  //       console.log(' Vendor Code: ', Vendorcode);
  //       setordersCode(firstOrder);
  //       setvendorCode(Vendorcode);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (ordersCode) {
  //     startCheckingRestaurantStatus();
  //   }
  // }, [ordersCode]);

  // useEffect(() => {
  //   let intervalId;
  //   if (ordersCode) {
  //     intervalId = setInterval(checkOrderStatusforResturant, 5000);
  //   }
  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //   };
  // }, [ordersCode]);

  // const startCheckingRestaurantStatusAgain = () => {
  //   const intervalId = setInterval(checkOrderStatusforResturantAgain, 5000);
  //   // Store the intervalId in state so we can clear it later
  //   setRestaurantCheckInterval(intervalId);
  // };

  // const checkOrderStatusforResturantAgain = async () => {
  //   try {
  //     const Token = await authStorage.getToken();
  //     const myHeaders = new Headers();
  //     myHeaders.append('Authorization', Token);
  //     myHeaders.append('Content-Type', 'application/json');

  //     const requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow',
  //     };

  //     const response = await fetch(
  //       `https://server.saugeendrives.com:9001/api/v1.0/Order?code=${ordersCode}`,
  //       requestOptions,
  //     );
  //     const resultText = await response.text();
  //     const result = JSON.parse(resultText);

  //     if (result.orders && result.orders.length > 0) {
  //       console.log('Order status = ', result.orders[0].status);
  //       const statuscheck = result.orders[0].status;
  //       if (statuscheck === 'ReadyToDeliver') {
  //         setShowSecondIndicator(false);
  //         setShowSecondTick(true);
  //         setSecondCardColor('#6699ff');
  //         console.log('Order has been prepared by the restaurant');
  //         setIsOrderReady(true);

  //         // Clear the restaurant check interval
  //         clearInterval(restaurantCheckInterval);

  //         refRBSheet.current.close(); // Close the bottom sheet after loading is complete
  //       }
  //     } else {
  //       console.log('No orders found in the response');
  //     }
  //   } catch (error) {
  //     console.error('Error in checkOrderStatus:', error);
  //   }
  // };

  const fetchStoredLocationfromAsync = async () => {
    try {
      const Latitude = await AsyncStorage.getItem('latitude');
      const Longitude = await AsyncStorage.getItem('longitude');
      setlatitude(Latitude ? parseFloat(Latitude) : null);
      setlongitude(Longitude ? parseFloat(Longitude) : null);
      if (Latitude && Longitude) {
        console.log('Latitude =', Latitude);
        console.log('Longitude =', Longitude);
      }
    } catch (error) {
      console.error('Error fetching data from storage:', error);
    }
  };

  // useEffect(() => {
  //   return () => {
  //     if (restaurantCheckInterval) clearInterval(restaurantCheckInterval);
  //     if (riderCheckInterval) clearInterval(riderCheckInterval);
  //   };
  // }, []);

  // const fetchOrderAndVendorCodeFromAsync = async () => {
  //   try {
  //     const OrderCode = await AsyncStorage.getItem('OrderCode');
  //     const VendorCode = await AsyncStorage.getItem('VendorCode');
  //     setordersCode(OrderCode);
  //     setvendorCode(VendorCode);
  //     if (OrderCode && VendorCode) {
  //       console.log('Latitude =', OrderCode);
  //       console.log('Longitude =', VendorCode);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data from storage:', error);
  //   }
  // };

  const handleCheckboxPress = (itemTitle, itemCode) => {
    if (selectedItem === itemTitle) {
      setSelectedItem(null);
      setSelectedPaymentMethodCode(null);
      setIscheckboxChecked(false);
    } else {
      setSelectedItem(itemTitle);
      setSelectedPaymentMethodCode(itemCode);
      setIscheckboxChecked(true);
    }
  };

  const handleNavigation = async () => {
    // navigation.navigate('PendingOrder');
    // setIsLoading(true);
    try {
      await paymentMethodPost();
      // await AsyncStorage.removeItem('basketItems');
    } catch (error) {
      console.error('Error during navigation:', error);
      // Handle error (e.g., show an alert to the user)
    } finally {
      setIsLoading(false);
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
        <Header title="Payment Methods" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.greyscale900,
              },
            ]}>
            Select the payment method you want to use.
          </Text>
          {/* <PaymentMethodItem
            checked={selectedItem === 'Paypal'}
            onPress={() => handleCheckboxPress('Paypal')}
            title="Paypal"
            icon={icons.paypal}
          />
          <PaymentMethodItem
            checked={selectedItem === 'Google Pay'}
            onPress={() => handleCheckboxPress('Google Pay')}
            title="Google Pay"
            icon={icons.google}
          />
          <PaymentMethodItem
            checked={selectedItem === 'Apple Pay'}
            onPress={() => handleCheckboxPress('Apple Pay')}
            title="Apple Pay"
            icon={icons.apple}
            tintColor={COLORS.black}
          />
          <PaymentMethodItem
            checked={selectedItem === 'Credit Card'}
            onPress={() => handleCheckboxPress('Credit Card')}
            title="•••• •••• •••• •••• 4679"
            icon={icons.creditCard}
          /> */}

          {paymentMethods.map(method => (
            <PaymentMethodItem
              key={method.code}
              checked={selectedItem === method.name}
              onPress={() => handleCheckboxPress(method.name, method.code)}
              title={method.name}
              icon={{uri: method.logo}}
              description={method.description}
            />
          ))}

          {/* <PaymentMethodItem
            checked={selectedItem === 'Apple Pay'}
            onPress={() => handleCheckboxPress('Apple Pay')}
            title="Credit card/Debit card"
            icon={icons.creditCard}
           
          />
          
           <PaymentMethodItem
            checked={selectedItem === 'Credit Card'}
            onPress={() => handleCheckboxPress('Credit Card')}
            title="Cash"
          icon={icons.cash}
          /> */}
          {/* <Button
            title="Add New Card"
            onPress={() => { navigation.navigate("AddNewCard") }}
            style={{
              width: SIZES.width - 32,
              borderRadius: 32,
              backgroundColor: COLORS.tansparentPrimary,
              borderColor: COLORS.tansparentPrimary
            }}
            textColor={COLORS.primary}
          /> */}
        </ScrollView>
        <Button
          title="Continue"
          filled
          //  disabled={!isOrderReady || !IscheckboxChecked}
          disabled={!IscheckboxChecked}
          style={styles.continueBtn}
          onPress={handleNavigation}
        />
      </View>

      {showWebView && paymentUrl && (
        <View style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowWebView(false);
                navigation.navigate('CheckoutOrdersCompleted', {
                  isPaymentSuccessfull: false,
                });
              }}>
              <Icon name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          <WebView
            source={{uri: paymentUrl}}
            style={styles.webView}
            onLoadStart={() => {
              setWebViewLoading(true);
              checkPaymentStatus();
            }}
            onLoadEnd={() => setWebViewLoading(false)}
            // onNavigationStateChange={navState => {
            //   checkPaymentStatus();
            //   // Check for successful payment or cancellation
            //   if (navState.url.includes('success')) {
            //     setShowWebView(false);
            //     checkPaymentStatus();
            //   } else if (navState.url.includes('cancel')) {
            //     setShowWebView(false);
            //     setIsLoading(false);
            //   }
            // }}
          />
          {webViewLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};
const getstyles1 = (firstCardColor, secondCardColor, thirdCardColor) =>
  StyleSheet.create({
    cash: {
      marginLeft: wp('4%'),
      color: 'white',
    },
    buttonShadowBox: {
      justifyContent: 'center',
      shadowOpacity: 1,
      elevation: 12,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: hp('0.5%'),
      },
      alignItems: 'center',
      flexDirection: 'row',
    },
    buttonIconLayout: {
      height: hp('5%'),
      width: wp('10%'),
      borderRadius: wp('5%'),
    },
    cashTypo: {
      textAlign: 'left',
      marginLeft: wp('4%'),
      fontSize: wp('4.5%'),
      fontFamily: 'Roboto-Bold',
      fontWeight: '600',
      flex: 1,
    },
    buttonIcon1: {
      opacity: 0,
      backgroundColor: '#fff',
    },
    title: {
      top: hp('7%'),
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      width: wp('90%'),
      left: wp('6%'),
      position: 'absolute',
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
      top: hp('5%'),
      height: hp('92%'),
      left: wp('2.5%'),
      position: 'absolute',
    },
    next: {
      color: '#fff',
      fontSize: wp('4.5%'),
      fontFamily: 'Roboto-Bold',
      textAlign: 'center',
      fontWeight: '600',
    },
    button: {
      marginLeft: -wp('45%'),
      top: hp('94%'),
      shadowColor: 'rgba(0, 0, 0, 0.06)',
      borderRadius: wp('7%'),
      backgroundColor: 'black',
      height: hp('6.5%'),
      paddingHorizontal: wp('5.5%'),
      paddingVertical: 0,
      width: wp('90%'),
      shadowOpacity: 1,
      elevation: 12,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: hp('0.5%'),
      },
      left: '50%',
      position: 'absolute',
    },
  });

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Urbanist Medium',
    color: COLORS.greyscale900,
    marginVertical: 32,
  },
  continueBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
  },
  webViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
  },
  webViewHeader: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  closeButton: {
    padding: 5,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default PaymentMethods;
