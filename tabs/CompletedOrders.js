import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useRef, useState, useEffect, useCallback} from 'react';
import {completedOrders} from '../data';
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import authStorage from '../auth/storage';
import {BarIndicator} from 'react-native-indicators';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ErrorModal from '../components/ErrorModal';
import {SIZES, COLORS, icons, FONTS} from '../constants';

const CompletedOrders = () => {
  // const [orders, setOrders] = useState(completedOrders);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isOrderFound, setIsOrderFound] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused(); // Check if the screen is focused

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      if (isFocused) {
        fetchData();
      }
    }, [isFocused]),
  );

  const fetchData = async () => {
    try {
      setIsOrderFound(true);
      setModalVisible(false);
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);

      const queryParams = new URLSearchParams();
      queryParams.append('Status', 'Delivered');

      const urlWithParams = `https://server.saugeendrives.com:9001/api/v1.0/Order?${queryParams}`;

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(urlWithParams, requestOptions);
      const result = await response.json(); // Parse the response as JSON

      // console.log('Completed = ', JSON.stringify(result));
      if (result.message == 'No orders found') {
        setIsOrderFound(false);
        setModalVisible(true);
      }
      setOrders(result.orders); // Set the orders state with the fetched data
    } catch (error) {
      console.error(error);
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
          message={'No complete Order found'}
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
                backgroundColor: COLORS.white,
              },
            ]}>
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
                    styles.address,
                    {
                      color: COLORS.grayscale700,
                    },
                  ]}>
                  {item.customerAddress.address}
                </Text>
                <View style={styles.priceContainer}>
                  <View style={styles.priceItemContainer}>
                    <Text style={styles.totalPrice}>${item.totalAmount}</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      right: 5,
                    }}>
                    {item.riderRating !== null ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
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
                          {item.riderRating == null
                            ? 0
                            : item.riderRating.rating}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('RateTheDriver', {item: item})
                        }
                        style={{
                          width: wp(20),
                          backgroundColor: COLORS.greeen,
                          borderRadius: 10,
                          justifyContent: 'center',
                          height: hp(3),
                          elevation: 2,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: 'Urbanist SemiBold',
                            color: COLORS.white,
                            textAlign: 'center',
                          }}>
                          Rate now
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
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
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EReceipt', {orderData: item})
                }
                style={styles.receiptBtn}>
                <Text style={styles.receiptBtnText}>View E-Receipt</Text>
              </TouchableOpacity>
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
                onPress={() => navigation.navigate("EReceipt")}
                style={styles.receiptBtn}>
                <Text style={styles.receiptBtnText}>View E-Receipt</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.tertiaryWhite,
    marginVertical: 22,
    paddingBottom: hp(4),
  },
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 15,
    borderColor: COLORS.black,
    borderWidth: 0.3,
  },
  noOrdersText: {
    fontSize: 18,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    textAlign: 'center',
    marginTop: 20,
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
    width: wp(20),
    height: hp(3),
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.primary,
    fontFamily: 'Urbanist Medium',
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
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
  },
  address: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    marginVertical: 6,
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
    width: (SIZES.width - 32) / 2 - 16,
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
    width: SIZES.width - 32 - 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

export default CompletedOrders;
