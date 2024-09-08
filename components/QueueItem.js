import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {COLORS, SIZES} from '../constants';
import RBSheet from 'react-native-raw-bottom-sheet';
// import Button from '../components/Button';

import Fontisco from 'react-native-vector-icons/Fontisto';
import authStorage from '../auth/storage';
import Button from './Button';
import {COLORS, SIZES} from '../constants';
const QueueItem = ({item, removeItem}) => {
  const [inputMinutes, setInputMinutes] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isCountingUp, setIsCountingUp] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [showLoader, setShowLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  const refRBSheet = useRef();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isCountingDown) {
      if (secondsRemaining > 0) {
        intervalRef.current = setInterval(() => {
          setSecondsRemaining(prev => prev - 1);
        }, 1000);
      } else {
        setIsCountingDown(false);
        setIsCountingUp(true);
      }
    }

    if (isCountingUp) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isCountingDown, isCountingUp, secondsRemaining]);

  const startTimer = () => {
    setTimeout(() => {
      const totalSeconds = parseInt(inputMinutes) * 60;
      setSecondsRemaining(totalSeconds);
      setIsCountingDown(true);
      setIsCountingUp(false);
      setShowLoader(false)
    }, 2000);
    refRBSheet.current.close();
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsCountingDown(false);
    setIsCountingUp(false);
    setIsOrderCompleted(true);
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleButton = async () => {
    if (isCountingDown || isCountingUp) {
      await stopTimer();
      await removeItem(item.code);
    } else {
      refRBSheet.current.open();
    }
  };

  const navigation = useNavigation();
  const acceptOrder = async userInputMinutes => {
    setShowLoader(true);
    try {
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);
      myHeaders.append('Content-Type', 'application/json');

      const url = `https://any2ti3onu2xhpcq7kcizcivhe0lpfpl.lambda-url.us-east-1.on.aws/api/v1.0/vendorstore/Orders/${item?.code}/accept`;

      const currentDate = new Date();

      currentDate.setMinutes(currentDate.getMinutes() + inputMinutes);

      const expectedDeliveryDate = currentDate.toISOString();
      const body = JSON.stringify({
        expectedDeliveryDate: expectedDeliveryDate,
      });

      const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: body,
      };

      const response = await fetch(url, requestOptions);
      console.log(response);
      startTimer();
      // Alert.alert('Order Accepted');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async userInputMinutes => {
    try {
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);

      const url = `https://any2ti3onu2xhpcq7kcizcivhe0lpfpl.lambda-url.us-east-1.on.aws/api/v1.0/vendorstore/Orders/${item?.code}/reject`;

      const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
      };

      const response = await fetch(url, requestOptions);
      if (response.status == 200) {
        stopTimer();
        Alert.alert('Order Cancelled');
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate('EReceipt', {data: item})}
        style={[
          styles.cardContainer,
          {
            backgroundColor: COLORS.white,
          },
        ]}>
        <View style={styles.detailsContainer}>
          <View>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVyZ2VyfGVufDB8fDB8fHww',
              }}
              resizeMode="cover"
              style={styles.serviceImage}
            />
            <View style={styles.reviewContainer}>
              <FontAwesome name="star" size={12} color="orange" />
              <Text style={styles.rating}>{item?.riderRating}</Text>
            </View>
          </View>
          <View style={styles.detailsRightContainer}>
            <Text
              style={[
                styles.name,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              {item?.items[0]?.name}
            </Text>
            <Text
              style={[
                styles.address,
                {
                  color: COLORS.grayscale700,
                },
              ]}>
              {item?.customerAddress?.address}
            </Text>
            <View style={styles.priceContainer}>
              <View style={styles.priceItemContainer}>
                <Text style={styles.totalPrice}>${item?.items[0]?.amount}</Text>
              </View>
              <Text
                style={[
                  isCountingDown ? {color: '#28a745'} : {color: '#dc3545'},
                  styles.timeText,
                ]}>
                {showLoader ? <ActivityIndicator color={COLORS.primary}/> : ( isCountingDown || isCountingUp
                  ? formatTime(secondsRemaining)
                  : null)}
              </Text>
              {/* <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{}</Text>
            </View> */}
              {/* <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View> */}
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
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelOrder}>
            <Text style={styles.cancelBtnText}>Cancel Order</Text>
          </TouchableOpacity>
          {isOrderCompleted ? (
            <View />
          ) : (
            <TouchableOpacity
              onPress={handleButton}
              // onPress={() => navigation.navigate("")}
              style={styles.receiptBtn}>
              {isCountingDown || isCountingUp ? (
                <Text style={styles.receiptBtnText}>HandOver</Text>
              ) : (
                <Text style={styles.receiptBtnText}>Accept</Text>
              )}
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity
            onPress={() => navigation.navigate("EReceipt")}
            style={styles.receiptBtn}>
            <Text style={styles.receiptBtnText}>View E-Receipt</Text>
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
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
          container:styles.bottomSheetContainer
        }}>
        <Text style={styles.textBold}>I am preparing this order in</Text>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Fontisco size={20} name="clock" color={COLORS.white} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter Minutes"
            keyboardType="numeric"
            value={inputMinutes}
            onChangeText={setInputMinutes}
          />
        </View>

        {/* <Button title="Start Timer" onPress={startTimer} /> */}
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
            title="Continue"
            filled
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: COLORS.primary,
              borderRadius: 32,
              borderColor: COLORS.tansparentPrimary,
            }}
            onPress={acceptOrder}
          />
        </View>
      </RBSheet>
    </>
  );
};

export default React.memo(QueueItem);

const styles = StyleSheet.create({
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16,
  },
  statusContainer: {
    width: 54,
    height: 24,
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
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
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
    width: (SIZES.width - 32) / 2 - 16,
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
  inputContainer: {
    height: 50,
    borderWidth: 2,
    borderRadius: 15,
    width: '80%',
    borderColor: COLORS.primary,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: '5%',
    marginBottom: '7%',
  },
  input: {
    // height: 40,
    fontFamily: 'Urbanist Regular',
    fontSize: 18,
    width: '80%',
    marginLeft: 10,
  },
  iconContainer: {
    backgroundColor: COLORS.primary,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    marginTop: 20,
  },
  textBold: {
    fontSize: 23,
    color: COLORS.greyscale900,
    marginVertical: 20,
    fontFamily: 'Urbanist Bold',
  },
  placeholderText: {
    fontFamily: 'Urbanist Regular',
  },
  timeText: {
    fontSize: 30,
    marginLeft:6,
    fontFamily: 'Urbanist Bold',
  },
  bottomSheetContainer:{
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    height: 280,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    width: '100%',
  }
});
