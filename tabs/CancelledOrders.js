import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SIZES, COLORS, FONTS} from '../constants';
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

const CancelledOrders = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isOrderFound, setIsOrderFound] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        fetchData();
      }
    }, [isFocused]),
  );

  const fetchData = async () => {
    try {
      setIsOrderFound(true);
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);

      const queryParams = new URLSearchParams();
      queryParams.append('Status', 'Cancelled');

      const urlWithParams = `https://server.saugeendrives.com:9001/api/v1.0/Order?${queryParams}`;

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(urlWithParams, requestOptions);
      const result = await response.json();

      if (result.message === 'No orders found') {
        setIsOrderFound(false);
      } else {
        setOrders(result.orders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPress = logs => {
    const cancelLog = logs.find(log => log.status === 'Cancelled');
    if (cancelLog) {
      setCancelReason(cancelLog.description);
    } else {
      setCancelReason('No reason provided');
    }
    setModalVisible(true);
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
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: COLORS.tertiaryWhite}]}>
      <FlatList
        data={orders}
        keyExtractor={item => item.code}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.cardContainer, {backgroundColor: COLORS.white}]}>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsRightContainer}>
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: 20,
                    fontWeight: '600',
                    fontFamily: 'Urbanist Bold',
                  }}>
                  Items:
                </Text>
                {item.items.map(product => (
                  <View key={product.code} style={styles.productContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    {/* <Text style={styles.productDescription}>
                      {product.description}
                    </Text> */}
                    {/* <Text style={styles.productAmount}>${product.amount}</Text> */}
                  </View>
                ))}

                <View>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 20,
                      fontWeight: '600',
                      fontFamily: 'Urbanist Bold',
                    }}>
                    Store:
                  </Text>
                  <Text style={styles.name}>{item.vendorStore.name}</Text>
                  <Text style={styles.address}>
                    Address : {item.vendorStore.address}
                  </Text>

                  <Text style={styles.date}>Date : {item.createDate}</Text>
                  <Text style={styles.totalPrice}>
                    Total Amount : ${item.totalAmount}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.separateLine,
                {marginVertical: 10, backgroundColor: COLORS.grayscale200},
              ]}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleViewPress(item.logs)}
                style={styles.receiptBtn}>
                <Text style={styles.receiptBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancellation Reason</Text>
            <Text style={styles.modalText}>{cancelReason}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.tertiaryWhite,
    marginVertical: 22,
  },
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsRightContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale600,
  },
  address: {
    fontSize: 13,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    marginVertical: 6,
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
    // textAlign: 'center',
  },
  statusText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: 'Urbanist Medium',
  },
  separateLine: {
    width: '100%',
    height: 0.7,
    backgroundColor: COLORS.greyScale800,
    marginVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  productContainer: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale600,
  },
  productDescription: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
  },
  productAmount: {
    fontSize: 14,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    marginVertical: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: wp('80%'),
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Urbanist Regular',
    color: COLORS.greyscale600,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.white,
  },
});

export default CancelledOrders;
