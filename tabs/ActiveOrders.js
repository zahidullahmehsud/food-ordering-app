import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useRef, useState, useEffect, useCallback} from 'react';
import {activeOrders} from '../data';
import {SIZES, COLORS, icons, FONTS} from '../constants';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../components/Button';
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import authStorage from '../auth/storage';
import {BarIndicator} from 'react-native-indicators';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorModal from '../components/ErrorModal';

const ActiveOrders = () => {
  const refRBSheet = useRef();
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Check if the screen is focused
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isOrderFound, setIsOrderFound] = useState(true);
  const [orderCode, setOrderCode] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const statusIcons = [
    {status: 'Confirmed', icon: icons.restaurant_green},
    {status: 'RiderAssigned', icon: icons.user_green},
    {status: 'Prepairing', icon: icons.package_green}, // This will cover both Preparing and ReadyToDeliver
    {status: 'RiderPicked', icon: icons.motorbike_green},
    {status: 'RiderArrivedAtDestination', icon: icons.location_green}, // This will cover both RiderArrivedAtDestination and Delivered
  ];

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        const statusInterval = setInterval(() => {
          fetchData();
        }, 5000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(statusInterval);
      }
    }, [isFocused]),
  );

  // const fetchDataFromAsync = async () => {
  //   const storedLatitude = await AsyncStorage.getItem('latitude');
  //   const storedLongitude = await AsyncStorage.getItem('longitude');
  //   const addressCode = await AsyncStorage.getItem('AddressCode');
  //   setLatitude(storedLatitude);
  //   setLongitude(storedLongitude);

  //   console.log('latitude = ', storedLatitude);
  //   console.log('longitude = ', storedLongitude);
  //   console.log('AddressCode from async = ', addressCode);
  // };

  const fetchStoredLocationfromAsync = async (orderCode, vendorCode) => {
    try {
      const Latitude = await AsyncStorage.getItem('latitude');
      const Longitude = await AsyncStorage.getItem('longitude');
      const ltd = Latitude ? parseFloat(Latitude) : null;
      const lgt = Longitude ? parseFloat(Longitude) : null;
      console.log('Latitude =', Latitude);
      console.log('Longitude =', Longitude);
      if (Latitude && Longitude) {
        console.log('Latitude =', Latitude);
        console.log('Longitude =', Longitude);
        navigation.navigate('TrackDriver', {
          Latitude: ltd,
          Longitude: lgt,
          ordersCode: orderCode,
          vendorCode: vendorCode,
        });
      }
    } catch (error) {
      console.error('Error fetching data from storage:', error);
    }
  };

  const fetchData = async () => {
    try {
      setIsOrderFound(true);
      setModalVisible(false);
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);

      const urlWithParams = `https://server.saugeendrives.com:9001/api/v1.0/Order`;

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(urlWithParams, requestOptions);
      const result = await response.json();
      // console.log('ReadyToDeliver = ', JSON.stringify(result));

      if (result.message === 'No orders found') {
        setIsOrderFound(false);
        setModalVisible(true);
      } else {
        // Filter orders based on status
        const filteredOrders = result.orders.filter(order =>
          [
            'New',
            'RiderPicked',
            'Confirmed',
            'RiderAssigned',
            'ReadyToDeliver',
            'RiderArrivedAtDestination',
            'Prepairing',
          ].includes(order.status),
        );

        if (filteredOrders.length === 0) {
          setIsOrderFound(false);
          setModalVisible(true);
        } else {
          setOrders(filteredOrders);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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

  const shouldBeColored = (status, orderStatus) => {
    const statusOrder = [
      'Confirmed',
      'RiderAssigned',
      'Prepairing',
      'ReadyToDeliver',
      'RiderPicked',
      'RiderArrivedAtDestination',
    ];
    const statusIndex = statusOrder.indexOf(status);
    const currentStatusIndex = statusOrder.indexOf(orderStatus.status);

    // Special case for 'Preparing' and 'ReadyToDeliver'
    if (
      status === 'Prepairing' &&
      (orderStatus.status === 'Prepairing' ||
        orderStatus.status === 'ReadyToDeliver')
    ) {
      return true;
    }

    // Special case for 'RiderArrivedAtDestination'
    if (
      status === 'RiderArrivedAtDestination' &&
      (orderStatus.status === 'RiderArrivedAtDestination' ||
        orderStatus.status === 'Delivered')
    ) {
      return true;
    }

    // For all other cases, color the icon if its status index is less than or equal to the current status index
    return statusIndex <= currentStatusIndex;
  };

  const getGrayIcon = status => {
    switch (status) {
      case 'Confirmed':
        return icons.restuarant_black;
      case 'RiderAssigned':
        return icons.user_black;
      case 'Prepairing':
      case 'ReadyToDeliver':
        return icons.package_black;
      case 'RiderPicked':
        return icons.motorbike_black;
      case 'RiderArrivedAtDestination':
      case 'Delivered':
        return icons.location_black;
      default:
        return icons.restuarant_black;
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date
      .toLocaleString('default', {month: 'short'})
      .toUpperCase();
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }

  const renderRiderInfo = item => {
    return (
      <View style={styles.orderStatusContainer}>
        <View style={styles.driverLeftInfo}>
          <Image
            source={icons.userDefault2}
            style={styles.riderImage}
            resizeMode="contain"
          />

          <View>
            <Text
              style={[
                styles.driverName,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              {item.riderProfile?.fullName.length > 20
                ? `${item.riderProfile?.fullName.substring(0, 27)}...`
                : item.riderProfile?.fullName}
            </Text>
          </View>
        </View>

        <View style={styles.driverRightReview}>
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
            {item.riderRating == null ? 0 : item.riderRating}
          </Text>
        </View>
        {/* <Text
            style={[
              styles.taxiID,
              {
                color: COLORS.greyscale900,
              },
            ]}></Text> */}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <BarIndicator color={COLORS.primary} />
      </View>
    );
  }
  if (!isOrderFound) {
    return (
      <View style={styles.loadingContainer}>
        <Text
          style={{
            color: COLORS.black,
            textAlign: 'center',
            fontSize: 18,
            fontFamily: 'Urbanist SemiBold',
            fontWeight: '500',
          }}>
          No Order Found
        </Text>
        {/* <ErrorModal
          visible={modalVisible}
          message={'No active order found'}
          onClose={() => setModalVisible(false)}
        /> */}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: COLORS.tertiaryWhite,
        },
      ]}>
      <FlatList
        data={orders}
        keyExtractor={item => item.code}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.cardContainer,
              {
                backgroundColor: 'white',
              },
            ]}
            onPress={() => {
              // fetchStoredLocationfromAsync(item.code, item.vendorStore.code);
              if (item.status === 'Confirmed') {
                setErrorMessage('This order is currently in progress');
                setErrorModalVisible(true);
              }
              if (item.status == 'New') {
                setErrorMessage('This order is currently in progress');
                setErrorModalVisible(true);
              }
              if (item.status !== 'Confirmed' && item.status !== 'New') {
                fetchStoredLocationfromAsync(item.code, item.vendorStore.code);
              }
            }}>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsRightContainer}>
                <Text
                  style={[
                    styles.name,
                    {
                      color: COLORS.greyscale900,
                    },
                  ]}>
                  {item.vendorStore.name}
                </Text>
                <Text
                  style={[
                    styles.namee,
                    {
                      color: COLORS.greyscale600,
                    },
                  ]}>
                  {item.number}
                </Text>
                {/* <Text style={[styles.address, {
            color: COLORS.grayscale700,
          }]}>{item.customerAddress.address}</Text> */}
                <Text
                  style={[
                    styles.address,
                    {
                      color: COLORS.grayscale700,
                    },
                  ]}>
                  {formatDate(item.createDate)}
                </Text>
                <View style={styles.priceContainer}>
                  <View style={styles.priceItemContainer}>
                    <Text style={styles.totalPrice}>${item.totalAmount}</Text>
                  </View>
                  {item.paymentStatus == 'Unpaid' ? (
                    <View
                      style={{
                        position: 'absolute',
                        right: 8,
                        flexDirection: 'row',
                        borderWidth: 0.5,
                        borderRadius: 15,
                        borderTopRightRadius: 40,
                        borderBottomRightRadius: 40,
                      }}>
                      <View
                        style={{
                          height: hp(3),
                          width: wp(12),
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color:
                              item.paymentStatus == 'Unpaid'
                                ? COLORS.red
                                : COLORS.gray,
                            fontFamily: 'Urbanist SemiBold',
                            fontSize: 11,
                            fontWeight: '500',
                          }}>
                          {item.paymentStatus}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={{
                          backgroundColor: COLORS.greeen,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: wp(30),
                          height: hp(3),
                          borderRadius: 20,
                          elevation: 2,
                        }}
                        onPress={() => {
                          navigation.navigate('PaymentMethods', {
                            tipAmount: item.billingSummary.tipAmount,
                            ordersCode: item.code,
                            vendorCode: item.vendorStore.code,
                          });
                        }}>
                        <Text
                          style={{
                            color: COLORS.white,
                            fontFamily: 'Urbanist SemiBold',
                            fontSize: 12,
                          }}>
                          Complete Payment
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            </View>
            <View
              style={[
                styles.separateLine,
                {
                  marginVertical: 10,
                  backgroundColor: COLORS.grayscale200,
                },
              ]}
            />
            <View style={styles.buttonContainer}>
              {item.status === 'New' ? (
                <View style={styles.restuarantStatusContainer}>
                  <Text style={{color: COLORS.gray}}>
                    Waiting for Restaurant ...
                  </Text>
                </View>
              ) : item.status === 'Confirmed' ? (
                <View style={styles.findingRiderContainer}>
                  <Image
                    source={icons.userDefault2}
                    style={styles.riderImage}
                    resizeMode="contain"
                  />
                  <Text style={{marginLeft: 10, color: COLORS.gray}}>
                    Finding Driver ...
                  </Text>
                </View>
              ) : (
                renderRiderInfo(item)
              )}

              <View>
                <View style={styles.statusIconsContainer}>
                  {statusIcons.map((items, index) => {
                    const isColored = shouldBeColored(items.status, item);
                    const isLastIcon = index === statusIcons.length - 1;
                    return (
                      <React.Fragment key={index}>
                        <View style={styles.statusIconWrapper}>
                          <Image
                            source={
                              isColored ? items.icon : getGrayIcon(items.status)
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
                                  item,
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.open();
                    setOrderCode(item.code);
                  }}
                  style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel Order</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EReceipt', {orderData: item})
                  }
                  style={styles.receiptBtn}>
                  <Text style={styles.receiptBtnText}>View E-Receipt</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* <FlatList
        data={orders}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.cardContainer, {
            backgroundColor: COLORS.white,
          }]}>
            <View style={styles.detailsContainer}>
              <View>
                <Image
                  source={item.image}
                  resizeMode='cover'
                  style={styles.serviceImage}
                />
                <View style={styles.reviewContainer}>
                  <FontAwesome name="star" size={12} color="orange" />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>
              </View>
              <View style={styles.detailsRightContainer}>
                <Text style={[styles.name, {
                  color: COLORS.greyscale900
                }]}>{item.name}</Text>
                <Text style={[styles.address, {
                  color: COLORS.grayscale700,
                }]}>{item.address}</Text>
                <View style={styles.priceContainer}>
                  <View style={styles.priceItemContainer}>
                    <Text style={styles.totalPrice}>${item.totalPrice}</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.separateLine, {
              marginVertical: 10,
              backgroundColor: COLORS.grayscale200,
            }]} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => refRBSheet.current.open()}
                style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("EReceipt")}
                style={styles.receiptBtn}>
                <Text style={styles.receiptBtnText}>View E-Receipt</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      /> */}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={332}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: COLORS.greyscale300,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 332,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            width: '100%',
          },
        }}>
        <Text
          style={[
            styles.bottomSubtitle,
            {
              color: COLORS.red,
            },
          ]}>
          Cancel Order
        </Text>
        <View
          style={[
            styles.separateLine,
            {
              backgroundColor: COLORS.grayscale200,
            },
          ]}
        />

        <View style={styles.selectedCancelContainer}>
          <Text
            style={[
              styles.cancelTitle,
              {
                color: COLORS.greyscale900,
              },
            ]}>
            Are you sure you want to cancel your order?
          </Text>
          {/* <Text
            style={[
              styles.cancelSubtitle,
              {
                color: COLORS.grayscale700,
              },
            ]}>
            Only 80% of the money you can refund from your payment according to
            our policy.
          </Text> */}
        </View>

        <View style={styles.bottomContainer}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: COLORS.tansparentPrimary,
            }}
            textColor={COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Yes, Cancel"
            filled
            style={styles.removeButton}
            onPress={() => {
              refRBSheet.current.close();
              navigation.navigate('CancelOrder', {orderCode: orderCode});
            }}
          />
        </View>
      </RBSheet>
      <ErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => {
          setErrorModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.tertiaryWhite,

    marginBottom: hp(10),
  },
  cardContainer: {
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: hp(1),
    paddingVertical: hp(3),
    marginBottom: hp(2),
    //elevation: 1,
    marginVertical: hp(2),
    borderWidth: 0.1,
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
  },
  statusContainer: {
    width: wp(26),
    height: hp(4),
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  statusText: {
    fontSize: wp(3),
    color: COLORS.gray2,
    fontFamily: 'Urbanist Medium',
    fontWeight: '600',
  },
  separateLine: {
    width: '100%',
    height: 0.7,
    backgroundColor: COLORS.greyScale800,
    marginVertical: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 88,
    height: 88,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  detailsRightContainer: {
    flex: 1,
    marginLeft: wp(4),
  },
  name: {
    fontSize: 17,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
  },
  namee: {
    fontSize: 15,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    marginTop: 5,
  },
  address: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    marginVertical: 6,
  },
  noOrdersText: {
    fontSize: 18,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    textAlign: 'center',
    marginTop: 20,
  },
  serviceTitle: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
  },
  serviceText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: 'Urbanist Medium',
    marginTop: 6,
  },
  cancelBtn: {
    width: (SIZES.width - 50) / 2 - 16,
    height: 36,
    borderRadius: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12,
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
  },
  receiptBtn: {
    width: (SIZES.width - 50) / 2 - 16,
    height: 36,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12,
  },
  receiptBtnText: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.white,
  },
  buttonContainer: {
    width: '100%',

    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remindMeText: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    marginVertical: 4,
  },
  switch: {
    marginLeft: 8,
    transform: [{scaleX: 0.8}, {scaleY: 0.8}], // Adjust the size of the switch
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32,
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist SemiBold',
    color: 'red',
    textAlign: 'center',
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginVertical: 12,
  },
  selectedCancelContainer: {
    marginVertical: 24,
    paddingHorizontal: 36,
    width: '100%',
  },
  cancelTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.greyscale900,
    textAlign: 'center',
  },
  cancelSubtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    textAlign: 'center',
    marginVertical: 8,
    marginTop: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  duration: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    textAlign: 'center',
  },
  priceItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  reviewContainer: {
    position: 'absolute',
    top: 6,
    right: 16,
    width: 46,
    height: 20,
    borderRadius: 16,
    backgroundColor: COLORS.transparentWhite2,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: hp(10),
    width: wp(88),
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: wp(0.1),
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
    marginLeft: wp(3),
  },
  driverRightContainer: {
    flexDirection: 'column',
    marginLeft: wp(15),
    alignItems: 'center',
  },
  driverLeftInfo: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  starIcon: {
    height: hp(4),
    width: wp(4),
    tintColor: COLORS.primary,
    //marginRight: 6,
  },
  starNum: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: 'Urbanist Regular',
    marginLeft: wp(1),
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
  driverRightReview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: wp(5),
  },
  driverName: {
    fontSize: 14,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    marginLeft: wp(2),
  },
});

export default ActiveOrders;
