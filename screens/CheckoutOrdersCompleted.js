import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, icons, images} from '../constants';
import Header from '../components/Header';
import OrderSummaryCard from '../components/OrderSummaryCard';
import Button from '../components/Button';
import authStorage from '../auth/storage';
import {BarIndicator} from 'react-native-indicators';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useFocusEffect, CommonActions} from '@react-navigation/native';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import axios from 'axios';

// At the top of your component, outside the component function:
let toastQueue = [];
let isShowingToast = false;

const showNextToast = () => {
  if (toastQueue.length > 0 && !isShowingToast) {
    isShowingToast = true;
    const nextToast = toastQueue.shift();
    toast[nextToast.type](nextToast.message, {
      ...nextToast.options,
      onClose: () => {
        isShowingToast = false;
        showNextToast();
      },
    });
  }
};

const queueToast = (type, message, options = {}) => {
  toastQueue.push({type, message, options});
  showNextToast();
};
const CheckoutOrdersCompleted = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [basketItems, setBasketItems] = useState([]);
  const [serviceCharge, setServiceCharge] = useState(
    route.params?.serviceCharge || 5,
  );
  const [isLoadingForButton, setisLoadingForButton] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [selectedTip, setSelectedTip] = useState(0);
  const [isBasketEmpty, setIsBasketEmpty] = useState(true);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [orderAmount, setOrderAmount] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [appliedDiscounts, setAppliedDiscounts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [value, setValue] = useState();
  const [utensilsRequired, setUtensilsRequired] = useState(false);
  const [specialRequest, setSpecialRequest] = useState('');
  const [notes, setNotes] = useState('');
  const [hasShownPaymentToast, setHasShownPaymentToast] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchBasketItems();
      loadDiscounts();
      return () => {
        // This runs when the screen is unfocused
        setHasShownPaymentToast(false);
      };
    }, []),
  );

  useEffect(() => {
    if (route.params?.isPaymentSuccessfull === false && !hasShownPaymentToast) {
      toast.error('Payment Unsuccessful.', {
        duration: 4000,
        position: 'bottom',
        styles: {
          view: {backgroundColor: COLORS.red, borderRadius: 5},
          text: {color: 'white'},
          indicator: {backgroundColor: 'white'},
        },
      });

      setHasShownPaymentToast(true);

      // Clear the flag to prevent showing the toast on subsequent renders
      navigation.setParams({isPaymentSuccessfull: undefined});
    }
  }, [route.params?.isPaymentSuccessfull]);

  const getTravelTime = async (lat1, lon1, lat2, lon2) => {
    try {
      const apiKey = 'AIzaSyCq5Y4F8m77wt929gwKepvFlO4aBLO7bt4';
      const origin = `${lat1},${lon1}`;
      const destination = `${lat2},${lon2}`;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${apiKey}&mode=driving`,
      );

      if (response.data.status === 'OK') {
        const travelInfo = response.data.rows[0].elements[0];
        const travelTimeInSeconds = travelInfo.duration.value; // Time in seconds
        const travelTimeInMinutes = travelTimeInSeconds / 60; // Convert to minutes
        console.log(`Travel time: ${travelTimeInMinutes} `);
        return travelTimeInMinutes; // Return the exact float value
      } else {
        console.error(
          'Error fetching travel time:',
          response.data.error_message,
        );
        return null;
      }
    } catch (error) {
      console.error('Error making request:', error);
      return null;
    }
  };

  const fetchBasketItems = async () => {
    try {
      const storedBasketItems = await AsyncStorage.getItem('basketItems');
      if (storedBasketItems) {
        const items = JSON.parse(storedBasketItems);

        setBasketItems(items);

        // Calculate total discounts

        // Calculate totals
        let orderTotal = 0;
        let serviceChargesTotal = 0;
        let deliveryChargesTotal = 0;
        let taxTotal = 0;
        let tax = 0;

        items.forEach(item => {
          orderTotal += item.itemPrice;
          // serviceChargesTotal += item.orderData.billSummary.serviceCharges;
          // deliveryChargesTotal += item.orderData.billSummary.deliveryCharges;
          tax = item.orderData.billSummary.taxPercentage;
        });
        deliveryChargesTotal = items[0].orderData.billSummary.deliveryCharges;
        serviceChargesTotal = items[0].orderData.billSummary.serviceCharges;
        taxTotal =
          (orderTotal + serviceChargesTotal + deliveryChargesTotal) *
          (tax / 100);

        setOrderAmount(orderTotal);
        setServiceCharges(serviceChargesTotal);
        setDeliveryCharges(deliveryChargesTotal);
        setTaxAmount(taxTotal);
        setTaxPercentage(tax);

        // Calculate the new total
        const newTotal =
          orderTotal + serviceChargesTotal + deliveryChargesTotal + taxTotal;

        setTotalAmount(newTotal);
      }
    } catch (error) {
      console.error('Error fetching basket items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDiscounts = async () => {
    const storedDiscounts = await loadDiscountsFromStorage();
    setAppliedDiscounts(storedDiscounts);

    // Recalculate total amount based on loaded discounts
    const discountTotal = storedDiscounts.reduce(
      (sum, discount) => sum + discount.amount,
      0,
    );
    setTotalAmount(prevTotal => prevTotal - discountTotal);

    storedDiscounts.forEach(item => {
      if (item.code == 'Welcome1') {
        setOrderAmount(prevTotal => prevTotal - item.amount);
      }
    });
  };

  const saveDiscountsToStorage = async discounts => {
    try {
      await AsyncStorage.setItem('appliedDiscounts', JSON.stringify(discounts));
    } catch (error) {
      console.error('Error saving discounts to AsyncStorage:', error);
    }
  };

  const loadDiscountsFromStorage = async () => {
    try {
      const storedDiscounts = await AsyncStorage.getItem('appliedDiscounts');
      if (storedDiscounts !== null) {
        return JSON.parse(storedDiscounts);
      }
    } catch (error) {
      console.error('Error loading discounts from AsyncStorage:', error);
    }
    return [];
  };

  const removeDiscount = async discountToRemove => {
    const updatedDiscounts = appliedDiscounts.filter(
      discount => discount.code !== discountToRemove.code,
    );
    setAppliedDiscounts(updatedDiscounts);

    // Recalculate total amount
    if (discountToRemove.code === 'SERVICE1') {
      setServiceCharges(prevCharges => prevCharges + discountToRemove.amount);
    } else {
      setOrderAmount(prevAmount => prevAmount + discountToRemove.amount);
    }
    setTotalAmount(prevTotal => prevTotal + discountToRemove.amount);

    // Save to AsyncStorage
    await saveDiscountsToStorage(updatedDiscounts);
  };

  const handleDiscountOrder = async () => {
    try {
      // Check if discount code has already been applied
      if (appliedDiscounts.some(discount => discount.code === discountCode)) {
        setErrorMessage('This discount code has already been used.');
        setModalVisible(true);
        return;
      }

      setisLoadingForButton(true);
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', Token);

      const currentBillSummary = {
        deliveryCharges,
        distance: 10, // Assuming this is constant
        orderAmount,
        serviceCharges,
        taxAmount,
        taxPercentage,
        tipAmount,
        totalAmount,
      };

      const raw = JSON.stringify({
        discountCode: discountCode,
        orderBillSummary: currentBillSummary,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Cart/apply-discount-code',
        requestOptions,
      );
      const data = await response.json();

      if (response.ok) {
        console.log('Discount food response ==>', data);

        // Calculate the discount amount based on the type of discount
        let discountAmount = 0;
        if (data.billSummary.orderAmount < currentBillSummary.orderAmount) {
          discountAmount =
            currentBillSummary.orderAmount - data.billSummary.orderAmount;
        } else if (
          data.billSummary.serviceCharges < currentBillSummary.serviceCharges
        ) {
          discountAmount =
            currentBillSummary.serviceCharges - data.billSummary.serviceCharges;
        }

        // Update state
        setOrderAmount(data.billSummary.orderAmount);
        setServiceCharges(data.billSummary.serviceCharges);
        setTotalAmount(data.billSummary.totalAmount);

        const updatedDiscounts = [
          ...appliedDiscounts,
          {code: discountCode, amount: discountAmount},
        ];
        setAppliedDiscounts(updatedDiscounts);

        // Save to AsyncStorage
        await saveDiscountsToStorage(updatedDiscounts);

        setSuccessMessage('Discount applied successfully');
        setSuccessModalVisible(true);

        // Clear the discount code input
        setDiscountCode('');

        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {name: 'Home'}, // Assuming 'Home' is your main screen
              {name: 'CheckoutOrdersCompleted'},
            ],
          }),
        );
      } else {
        setErrorMessage(data.message);
        setModalVisible(true);
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error);
      setModalVisible(true);
    } finally {
      setisLoadingForButton(false);
    }
  };

  const TipSelector = ({onSelectTip, selectedTip}) => {
    const tipOptions = [5, 10, 15, 'Other']; // Dollar amounts

    const handleTipPress = amount => {
      if (selectedTip === amount) {
        // If the pressed tip is already selected, deselect it
        onSelectTip(0);
      } else {
        // Otherwise, select the new tip amount
        onSelectTip(amount);
      }
    };

    const handleOtherTip = () => {
      setShowTipModal(true);
    };

    return (
      <View style={styles.tipSelectorOuterContainer}>
        <Text style={styles.tipSelectorTitle}>
          Say thanks to the delivery agent by adding tip
        </Text>
        <View style={styles.tipSelectorContainer}>
          {tipOptions.map(amount => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.tipOption,
                selectedTip === amount && styles.selectedTipOption,
              ]}
              onPress={() => {
                if (amount === 'Other') {
                  handleOtherTip();
                } else {
                  handleTipPress(amount);
                }
              }}>
              <Text
                style={[
                  styles.tipOptionText,
                  selectedTip === amount && styles.selectedTipOptionText,
                ]}>
                {amount == 'Other' ? amount : `$${amount}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const calculateDeliveryCharges = items => {
    // This is a placeholder calculation. Adjust based on your actual logic.
    const baseCharge = 5; // Minimum delivery charge
    const chargePerItem = 0.5; // Additional charge per item
    return baseCharge + items.length * chargePerItem;
  };

  const calculateTax = (itemsTotal, serviceCharge, deliveryCharges) => {
    const taxableAmount = itemsTotal + serviceCharge + deliveryCharges;
    return taxableAmount * 0.13; // Assuming 13% tax rate
  };

  const removeItem = async indexToRemove => {
    setIsLoading(true);
    const updatedBasketItems = basketItems.filter(
      (_, index) => index !== indexToRemove,
    );
    setBasketItems(updatedBasketItems);
    setIsBasketEmpty(updatedBasketItems.length === 0); // Update isBasketEmpty here
    await AsyncStorage.setItem(
      'basketItems',
      JSON.stringify(updatedBasketItems),
    );

    // Update basket count in AsyncStorage
    await AsyncStorage.setItem(
      'basketCount',
      updatedBasketItems.length.toString(),
    );

    // Recalculate totals
    const newItemsTotal = updatedBasketItems.reduce(
      (sum, item) => sum + parseFloat(item.itemPrice),
      0,
    );
    setTotalAmount(newItemsTotal);

    // Recalculate delivery charges
    const newDeliveryCharges = calculateDeliveryCharges(updatedBasketItems);
    setDeliveryCharges(newDeliveryCharges);
    await AsyncStorage.setItem(
      'deliveryCharges',
      newDeliveryCharges.toString(),
    );

    // Recalculate tax
    const newTaxAmount = calculateTax(
      newItemsTotal,
      serviceCharge,
      newDeliveryCharges,
    );
    setTaxAmount(newTaxAmount);
    fetchBasketItems();
  };

  const handleTipSave = async value => {
    setTipAmount(value);
    //setShowTipModal(false);

    // Update tipAmount in all basket items
    const updatedBasketItems = basketItems.map(item => {
      item.orderData.billSummary.tipAmount = value;
      return item;
    });

    await AsyncStorage.setItem(
      'basketItems',
      JSON.stringify(updatedBasketItems),
    );
    setBasketItems(updatedBasketItems);
  };

  if (isLoading) {
    if (isLoading || basketItems === null) {
      return (
        <View style={styles.loadingContainer}>
          <BarIndicator color={COLORS.primary} />
        </View>
      );
    }
    return (
      <View style={styles.loadingContainer}>
        <BarIndicator color={COLORS.primary} />
      </View>
    );
  }

  const handleDiscountCodeChange = text => {
    setDiscountCode(text);
    // AsyncStorage.setItem('discountCode', text);
  };

  const DiscountItem = ({discount, onRemove}) => (
    <View style={styles.discountItem}>
      <Text style={styles.discountCode}>{discount.code}</Text>
      <Text style={styles.discountAmount}>-${discount.amount.toFixed(2)}</Text>
      <TouchableOpacity
        onPress={() => onRemove(discount)}
        style={styles.removeButton}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const handlePlaceOrder = async () => {
    try {
      const storedDefaultAddress = await AsyncStorage.getItem('defaultAddress');
      const selectedAddress = JSON.parse(storedDefaultAddress);
      console.log('selected address is ' + JSON.stringify(selectedAddress));

      const travelTime = await getTravelTime(
        selectedAddress.latitude,
        selectedAddress.longitude,
        basketItems[0].vendorlatitude,
        basketItems[0].vendorlongitude,
      );

      console.log(`Travel Time is :${JSON.stringify(travelTime)}`);

      // if (!selectedAddress) {
      //   alert('Please add an address before placing an order');
      // }

      setisLoadingForButton(true);
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', Token);

      // Prepare the order items
      const orderItems = basketItems.map(item => ({
        code: item.orderData.items[0].code,
        quantity: 1,
        addons: item.orderData.items[0].addons.map(addon => ({
          code: addon.code,
        })),
        attributes: item.orderData.items[0].attributes,
      }));

      const combinedOrder = {
        type: 'MultivendorDeliveryService',
        addressCode: basketItems[0].orderData.addressCode,
        items: orderItems,
        billSummary: {
          travelTime: travelTime,
          distance: basketItems[0].orderData.billSummary.distance,
          serviceCharges: serviceCharges,
          taxPercentage: taxPercentage,
          deliveryCharges: deliveryCharges,
          orderAmount: orderAmount.toFixed(2),
          taxAmount: taxAmount,
          tipAmount: tipAmount,
          totalAmount: (totalAmount + tipAmount).toFixed(2),
          discountAmount: appliedDiscounts
            .reduce((sum, discount) => sum + discount.amount, 0)
            .toFixed(2),
        },
        utensilsRequired: utensilsRequired,
        specialRequest: specialRequest,
        notes: notes,
        discountCodes: appliedDiscounts.map(discount => discount.code),
      };

      console.log('combined order ==>', combinedOrder);

      // Construct the order object

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({order: combinedOrder}),
        redirect: 'follow',
      };

      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/order',
        requestOptions,
      );

      const result = await response.json();

      if (response.ok) {
        console.log(result);
        setBasketItems([]);

        setAppliedDiscounts([]);

        navigation.navigate('PaymentMethods', {
          tipAmount: tipAmount,
          ordersCode: result.order.code,
          vendorCode: result.order.vendorStore.code,
        });
        await AsyncStorage.removeItem('basketItems');
        await AsyncStorage.removeItem('basketCount');
      } else {
        console.error('Error:', result);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setisLoadingForButton(false);
    }
  };
  const TipModal = ({visible, onClose, onSave}) => {
    const [tipValue, setTipValue] = useState('0');
    const [error, setError] = useState('');

    const handleSave = () => {
      const parsedTip = parseFloat(tipValue);
      if (isNaN(parsedTip) || parsedTip < 0) {
        setError('Please enter a valid tip amount');
      } else {
        onSave(parsedTip);
        onClose();
      }
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Enter the amount of tip you want to give:
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  setTipValue(text);
                  setError('');
                }}
                value={tipValue}
                keyboardType="numeric"
                placeholder="Enter tip amount"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={handleSave}>
                <Text style={styles.textStyle}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={[styles.area, {backgroundColor: COLORS.white}]}
      key={refreshKey}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <View
          style={[
            styles.container1,
            {
              backgroundColor: COLORS.white,
            },
          ]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.greyscale900,
              },
            ]}>
            My Basket
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            backgroundColor: COLORS.tertiaryWhite,
            marginTop: 12,
          }}
          showsVerticalScrollIndicator={false}>
          {basketItems.length > 0 ? (
            <TipSelector
              onSelectTip={amount => {
                setSelectedTip(amount);
                setTipAmount(amount);
              }}
              selectedTip={selectedTip}
            />
          ) : (
            <></>
          )}

          <View
            style={[
              styles.summaryContainer,
              {
                backgroundColor: COLORS.white,
              },
            ]}>
            <View style={styles.orderSummaryView}>
              <Text
                style={[
                  styles.summaryTitle,
                  {
                    color: COLORS.greyscale900,
                  },
                ]}>
                Order Summary
              </Text>
              <TouchableOpacity
                style={styles.addItemView}
                onPress={() => navigation.navigate('DiscountFoods')}>
                <Text style={styles.addItemText}>Add more Items</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.separateLine,
                {
                  backgroundColor: COLORS.grayscale200,
                },
              ]}
            />
            {basketItems.map((item, index) => (
              <View key={index}>
                <OrderSummaryCard
                  name={item.itemName}
                  price={item.itemPrice}
                  logo={item.itemLogo}
                  onRemove={() => removeItem(index)}
                  addons={item.addons}
                  attributes={item.attributes}
                />
              </View>
            ))}
          </View>

          {basketItems.length > 0 ? (
            <View
              style={{
                height: wp(13),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderWidth: 0.4,
                borderColor: 'black',
                borderRadius: 15,
                paddingHorizontal: 15,
              }}>
              <TextInput
                placeholder="Enter Discount Code"
                placeholderTextColor={COLORS.grayscale400}
                style={{color: COLORS.black, fontSize: 15}}
                value={discountCode}
                blurOnSubmit={true}
                onChangeText={text => handleDiscountCodeChange(text)}
              />
              <TouchableOpacity
                onPress={() => {
                  handleDiscountOrder();
                }}
                style={{
                  backgroundColor: COLORS.primary,
                  width: wp(30),
                  height: hp(4),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Text style={{color: COLORS.white}}>Apply</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}

          {basketItems.length > 0 ? (
            <View style={styles.summaryContainer}>
              <View style={styles.view}>
                <Text style={styles.viewLeft}>Order Amount</Text>
                <Text style={styles.viewRight}>${orderAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.view}>
                <Text style={styles.viewLeft}>Service Charges</Text>
                <Text style={styles.viewRight}>
                  ${serviceCharges.toFixed(2)}
                </Text>
              </View>
              <View style={styles.view}>
                <Text style={styles.viewLeft}>Delivery Charges</Text>
                <Text style={styles.viewRight}>
                  ${deliveryCharges.toFixed(2)}
                </Text>
              </View>
              <View style={styles.view}>
                <Text style={styles.viewLeft}>Tax Amount</Text>
                <Text style={styles.viewRight}>${taxAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.view}>
                <Text style={styles.viewLeft}>Tip Amount</Text>
                <Text style={styles.viewRight}>${tipAmount.toFixed(2)}</Text>
              </View>

              <View style={styles.separateLine}></View>
              {appliedDiscounts.length > 0 && (
                <View style={styles.discountContainer}>
                  <Text style={styles.discountTitle}>Applied Discounts:</Text>
                  {appliedDiscounts.map(discount => (
                    <DiscountItem
                      key={discount.code}
                      discount={discount}
                      onRemove={removeDiscount}
                    />
                  ))}
                </View>
              )}

              <View style={styles.view}>
                <Text style={styles.viewLeft}>Total Discount</Text>
                <Text style={styles.viewRight}>
                  -$
                  {appliedDiscounts
                    .reduce((sum, discount) => sum + discount.amount, 0)
                    .toFixed(2)}
                </Text>
              </View>

              <View style={styles.view}>
                <Text style={styles.viewLeft}>Total Amount</Text>
                <Text style={styles.viewRight}>
                  ${(totalAmount + tipAmount).toFixed(2)}
                </Text>
              </View>
              <Utensils
                utensilsRequired={utensilsRequired}
                onUtensilsRequiredChange={setUtensilsRequired}
              />
              <SpecialRequest
                specialRequest={specialRequest}
                onSpecialRequestChange={setSpecialRequest}
              />
              <Notes notes={notes} onNotesChange={setNotes} />
            </View>
          ) : (
            <View
              style={{
                backgroundColor: COLORS.white,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 400,
              }}>
              <Image
                source={require('../assets/images/empty-cart.jpg')}
                style={{height: '40%'}}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'black',
                }}>
                Add more items to start a basket
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 15,

                  textAlign: 'center',
                }}>
                Once, you add items from restaurant or
              </Text>
              <Text>store, your basket will be appear here.</Text>
            </View>
          )}
        </ScrollView>
      </View>
      {basketItems.length > 0 ? (
        <Button
          title={`Place Order - $${(totalAmount + tipAmount).toFixed(2)}`}
          filled
          onPress={handlePlaceOrder}
          isLoading={isLoadingForButton}
          style={styles.placeOrderButton}
        />
      ) : (
        <></>
      )}

      <TipModal
        visible={showTipModal}
        onClose={() => setShowTipModal(false)}
        onSave={handleTipSave}
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
        }}
        onConfirm={() => {
          setSuccessModalVisible(false);
          // Perform the navigation reset here
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Home'}, {name: 'CheckoutOrdersCompleted'}],
            }),
          );
        }}
      />
      <Toasts />
    </SafeAreaView>
  );
};

const Utensils = ({utensilsRequired, onUtensilsRequiredChange}) => {
  return (
    <View style={styles.utensilsContainer}>
      <TouchableOpacity
        style={styles.utensilsCheckbox}
        onPress={() => onUtensilsRequiredChange(!utensilsRequired)}>
        {utensilsRequired ? (
          <Image source={icons.check} style={styles.checkboxIcon} />
        ) : (
          // <Image source={icons.checkboxUnchecked} style={styles.checkboxIcon} />
          <></>
        )}
      </TouchableOpacity>
      <Text style={styles.utensilsLabel}>Utensils Required</Text>
    </View>
  );
};

const SpecialRequest = ({specialRequest, onSpecialRequestChange}) => {
  return (
    <View style={styles.requestContainer}>
      <TextInput
        style={styles.requestInput}
        placeholder="Special Request"
        value={specialRequest}
        onChangeText={onSpecialRequestChange}
        placeholderTextColor={COLORS.grayscale400}
      />
    </View>
  );
};

const Notes = ({notes, onNotesChange}) => {
  return (
    <View style={styles.notesContainer}>
      <TextInput
        style={[styles.notesInput, {height: hp(10)}]}
        placeholder="Notes"
        value={notes}
        onChangeText={onNotesChange}
        multiline
        numberOfLines={5}
        placeholderTextColor={COLORS.grayscale400}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tipInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dollarSign: {
    fontSize: 14,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    marginRight: 2,
  },

  tipSelectorOuterContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    marginTop: 10,
    // marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    //elevation: 5,
  },
  tipSelectorTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,

    textAlign: 'center',
  },
  tipSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    padding: 10,
    marginBottom: 5,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  tipOption: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedTipOption: {
    backgroundColor: COLORS.primary,
  },
  tipOptionText: {
    color: COLORS.primary,
    fontFamily: 'Urbanist Bold',
    fontSize: 16,
  },
  selectedTipOptionText: {
    color: COLORS.white,
  },

  tipInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    borderRadius: 5,
    paddingHorizontal: 5,
    fontSize: 14,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Adjust as needed
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.blackTie,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderRadius: 5,
    borderColor: COLORS.grayscale200,
    color: COLORS.blackTie,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },

  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    backgroundColor: COLORS.white,
    width: SIZES.width - 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  summaryContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: 12,
    marginTop: 12,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: 'Urbanist Medium',
    color: COLORS.black,
  },
  viewRight: {
    fontSize: 14,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
  },
  separateLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  view1: {
    height: 52,
    width: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.tansparentPrimary,
  },
  view2: {
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  locationIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white,
  },
  viewView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
  },
  defaultView: {
    width: 64,
    height: 26,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.tansparentPrimary,
    marginHorizontal: 12,
  },
  defaultTitle: {
    fontSize: 12,
    fontFamily: 'Urbanist Medium',
    color: COLORS.primary,
  },
  addressTitle: {
    fontSize: 14,
    fontFamily: 'Urbanist Medium',
    color: COLORS.grayscale700,
    marginVertical: 4,
  },
  viewAddress: {
    marginHorizontal: 16,
  },
  arrowRightIcon: {
    height: 16,
    width: 16,
    tintColor: COLORS.greyscale900,
  },
  orderSummaryView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addItemView: {
    width: wp(30),
    height: 26,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1.4,
  },
  addItemText: {
    fontSize: 12,
    fontFamily: 'Urbanist Medium',
    color: COLORS.primary,
  },
  viewItemTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewLeftItemTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
    marginRight: 16,
  },
  viewItemTypeTitle: {
    fontSize: 14,
    fontFamily: 'Urbanist Medium',
    color: COLORS.grayscale700,
    marginRight: 16,
  },
  placeOrderButton: {
    marginTop: 6,
    width: wp(90),
    marginHorizontal: 16,
    marginBottom: 12,
  },
  paymentMethodRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodRightTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist Bold',
    color: COLORS.primary,
    marginRight: 8,
  },
  discountBtn: {
    width: 112,
    height: 28,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: 6,
  },
  discountBtnText: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: 'Urbanist Medium',
  },
  discountContainer: {
    marginTop: 10,
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.grayscale700,
  },
  discountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  discountCode: {
    flex: 1,
    color: COLORS.grayscale700,
  },
  discountAmount: {
    width: 80,
    textAlign: 'right',
    color: COLORS.grayscale700,
  },
  removeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    color: COLORS.error,
  },
  utensilsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 15,
  },
  utensilsCheckbox: {
    width: 23,
    height: 23,
    borderWidth: 1,
    borderColor: COLORS.grayscale400,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  utensilsLabel: {
    marginLeft: 8,
    fontSize: 13,
    color: COLORS.grayscale700,
    fontFamily: 'Urbanist Medium',
  },
  requestContainer: {
    marginVertical: 10,
    height: hp(5),
  },
  requestInput: {
    borderWidth: 1,
    borderColor: COLORS.grayscale400,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.grayscale700,
    fontFamily: 'Urbanist Medium',
  },
  notesContainer: {
    marginVertical: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.grayscale400,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: COLORS.grayscale700,
    fontFamily: 'Urbanist Medium',
  },
});

export default CheckoutOrdersCompleted;
