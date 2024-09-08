import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Modal,
  Animated,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {COLORS, SIZES, icons, images, socials} from '../constants';
import AutoSlider from '../components/AutoSlider';
import {ScrollView} from 'react-native-virtualized-view';
import Button from '../components/Button';
import authStorage from '../auth/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BarIndicator} from 'react-native-indicators';
import {useFocusEffect} from '@react-navigation/native';
import AddToBasketModal from '../components/AddToBasketModal'; // Adjust the import path as needed
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import {
  fetchItemDetails,
  toggleFavoriteItem,
  fetchFavoriteItems,
  checkIfFavorite,
} from '../api/client';
const FoodDetailsAddItem = ({navigation, route}) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState('');
  const [vendorlatitude, setvendorlatitude] = useState(null);
  const [vendorlongitude, setvendorlongitude] = useState('');
  const [responseData, setResponseData] = useState(null); // Initialize with null
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);
  const {itemCode} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [addressCode, setaddressCode] = useState();
  const [distanceToVendor, setDistanceToVendor] = useState(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [basketCount, setBasketCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [basePrice, setBasePrice] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [itemsDetails, setItemsDetails] = useState();
  const [foodFavourite, setFoodFavorites] = useState([]);
  console.log("User's lat = ", latitude);
  console.log("User's long =", longitude);
  console.log('Vendor lat =', vendorlatitude);
  console.log('Vendor long =', vendorlongitude);
  const [basketItems, setBasketItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getAuthToken = async () => {
    try {
      return await authStorage.getToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  useEffect(() => {
    loadBasketItems();
    fetchFavorites();
    checkFavoriteStatus();
  }, [itemCode]);

  useFocusEffect(
    React.useCallback(async () => {
      setSelectedAddons([]);
      setSelectedAttributes({});
      loadBasketCount();
      fetchData();
      updateTotalPrice();
    }, []),
  );
  const loadBasketCount = async () => {
    try {
      console.log('Backkkk');
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
  const loadBasketItems = async () => {
    const storedBasketItems = await AsyncStorage.getItem('basketItems');
    if (storedBasketItems) {
      const items = JSON.parse(storedBasketItems);
      console.log('Basket ==>', items);
      setBasketItems(items);
    }
  };

  const fetchFavorites = async () => {
    try {
      const Token = await getAuthToken();
      if (!Token) throw new Error('No authentication token available');

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
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      setFoodFavorites(data.items || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const storedLatitude = await AsyncStorage.getItem('latitude');
    const storedLongitude = await AsyncStorage.getItem('longitude');
    const addressCode = await AsyncStorage.getItem('AddressCode');
    setLatitude(storedLatitude);
    setLongitude(storedLongitude);
    setaddressCode(addressCode);

    try {
      const result = await fetchItemDetails(itemCode);
      setItemsDetails(result.items);
      setGalleryImages(result.items[0].galleryImages || []);
      setResponseData(result);

      // Calculate distance to vendor
      if (result.items[0].vendorStore) {
        setvendorlatitude(result.items[0].vendorStore.latitude);
        setvendorlongitude(result.items[0].vendorStore.longitude);
        const distance = await calculateDistance(
          parseFloat(storedLatitude),
          parseFloat(storedLongitude),
          parseFloat(result.items[0].vendorStore.latitude),
          parseFloat(result.items[0].vendorStore.longitude),
        );
        setDistanceToVendor(distance);
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const favorite = await checkIfFavorite(itemCode);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error checking if favorite:', error);
    }
  };

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
  useEffect(() => {
    if (responseData && responseData.items && responseData.items.length > 0) {
      const item = responseData.items[0];
      setBasePrice(item.amount);
      setOrderTotalPrice(item.amount);
    }
  }, [responseData]);

  useEffect(() => {
    updateTotalPrice();
  }, [selectedAddons, selectedAttributes]);

  const updateTotalPrice = () => {
    let newTotal = basePrice;

    // Add prices of selected addons
    selectedAddons.forEach(addon => {
      newTotal += addon.price;
    });

    // Add prices of selected attributes
    Object.values(selectedAttributes).forEach(attr => {
      if (attr && attr.amount) {
        newTotal += attr.amount;
      }
    });

    setOrderTotalPrice(newTotal);
  };

  const handleAddonSelection = addon => {
    setSelectedAddons(prev => {
      const isSelected = prev.some(a => a.code === addon.code);
      if (isSelected) {
        return prev.filter(a => a.code !== addon.code);
      } else {
        return [...prev, addon];
      }
    });
  };

  const animateBasketCount = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1000);
    });
  };

  const handleAttributeSelection = (attributeCode, item) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeCode]: prev[attributeCode]?.code === item.code ? null : item,
    }));
  };

  const updateBasketCount = async count => {
    try {
      await AsyncStorage.setItem('basketCount', count.toString());
    } catch (error) {
      console.error('Error saving basket count:', error);
    }
  };
  const calculateTotalPrice = () => {
    const itemPrice =
      responseData?.items?.length > 0
        ? parseFloat(responseData.items[0].amount)
        : 0;
    const addonsPrice = selectedAddons.reduce(
      (total, addon) => total + parseFloat(addon.price),
      0,
    );
    return (itemPrice + addonsPrice).toFixed(2);
  };

  const addToFavoriteMessage = () => {
    toast.success('Added to favorite', {
      duration: 2000,
      position: ToastPosition.BOTTOM,
      styles: {
        view: {
          backgroundColor: COLORS.primary,
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

  // render header
  const renderHeader = () => {
    const isFavorite = foodFavourite.some(fav => fav.code === itemCode);
    const handleFavoritePress = async () => {
      try {
        await toggleFavoriteItem(itemCode, isFavorite);
        if (isFavorite) {
          removeFromFavoriteMessage();
        } else {
          addToFavoriteMessage();
        }
        fetchFavorites();
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
    };

    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 35,
            width: 35,
            borderRadius: 22.5,
            backgroundColor: COLORS.black,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.arrowLeft}
            resizeMode="contain"
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={{
              height: 35,
              width: 35,
              borderRadius: 22.5,
              backgroundColor: COLORS.black,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5,
            }}
            onPress={handleFavoritePress}>
            <Image
              source={isFavorite ? icons.heart2 : icons.heart2Outline}
              resizeMode="contain"
              style={styles.bookmarkIconn}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 35,
              width: 35,
              borderRadius: 22.5,
              backgroundColor: COLORS.black,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('CheckoutOrdersCompleted')}>
            <Image
              source={images.Vector}
              resizeMode="contain"
              style={styles.bookmarkIcon}
            />
            {basketCount > 0 && (
              <View style={styles.basketCountContainer}>
                <Text style={styles.basketCountText}>{basketCount}</Text>
              </View>
            )}
            {/* <Animated.Text 
            style={[
              styles.plusOneText, 
              { opacity: fadeAnim }
            ]}
          >
            +1
          </Animated.Text> */}
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.sendIconContainer}
            onPress={() => refRBSheet.current.open()}>
            <Image
              source={icons.send2}
              resizeMode="contain"
              style={styles.sendIcon}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  // render content
  const renderContent = () => {
    const [expanded, setExpanded] = useState(false);
    const [count, setCount] = useState(1); // Initial count value

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <BarIndicator color={COLORS.primary} />
        </View>
      );
    }

    const item = responseData.items[0];

    const toggleExpanded = () => {
      setExpanded(!expanded);
    };

    const decreaseCount = () => {
      if (count > 1) {
        setCount(count - 1);
      }
    };

    const increaseCount = () => {
      setCount(count + 1);
    };

    const itemDescription =
      responseData.items && responseData.items.length > 0
        ? responseData.items[0].description
        : '';

    const amount =
      responseData.items && responseData.items.length > 0
        ? responseData.items[0].amount.toString() // Convert amount to string for display
        : '';
    console.log(amount);

    const itemName =
      responseData.items && responseData.items.length > 0
        ? responseData.items[0].name
        : '';

    const vendorStoreInfo =
      responseData.items && responseData.items.length > 0
        ? responseData.items[0].vendorStore.name // Adjust this line based on the actual structure of vendorStore
        : '';

    const addons = responseData.items.flatMap(item =>
      item.addons.map(addon => addon.addon),
    );
    const isFavorite = foodFavourite.some(fav => fav.code === item.code);
    return (
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {!isLoading && galleryImages?.length > 0 && (
          <AutoSlider images={galleryImages} />
          // <View style={{justifyContent: 'center', alignItems: 'center'}}>

          // </View>
        )}
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.vendorName}>
          Restaurant: {item.vendorStore.name}
        </Text>
        <Text style={styles.itemPrice}>${orderTotalPrice.toFixed(2)}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Addons</Text>
          {item.addons.map((addonItem, index) => (
            <View key={index} style={styles.addonItem}>
              <View style={styles.addonNameContainer}>
                <TouchableOpacity
                  onPress={() => handleAddonSelection(addonItem.addon)}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedAddons.some(
                        a => a.code === addonItem.addon.code,
                      ) && styles.checkedCheckbox,
                    ]}>
                    {selectedAddons.some(
                      a => a.code === addonItem.addon.code,
                    ) && (
                      <Image source={icons.check} style={styles.checkIcon} />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.addonName}>{addonItem.addon.name}</Text>
              </View>
              <Text style={styles.addonPrice}>
                ${addonItem.addon.price.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attributes</Text>
          {item.attributes.map((attribute, index) => (
            <View key={index} style={styles.attributeContainer}>
              <Text style={styles.attributeName}>{attribute.name}</Text>
              {attribute.items.map((attrItem, itemIndex) => (
                <View key={itemIndex} style={styles.attributeItem}>
                  <View style={styles.attributeNameContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        handleAttributeSelection(attribute.code, attrItem)
                      }>
                      <View
                        style={[
                          styles.checkbox,
                          selectedAttributes[attribute.code]?.code ===
                            attrItem.code && styles.checkedCheckbox,
                        ]}>
                        {selectedAttributes[attribute.code]?.code ===
                          attrItem.code && (
                          <Image
                            source={icons.check}
                            style={styles.checkIcon}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.attributeItemName}>
                      {attrItem.name}
                    </Text>
                  </View>
                  {attrItem.amount > 0 && (
                    <Text style={styles.attributeItemPrice}>
                      ${attrItem.amount.toFixed(2)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const handleContinueShopping = () => {
    setIsModalVisible(false);
  };

  const handleCheckout = () => {
    setIsModalVisible(false);
    navigation.navigate('CheckoutOrdersCompleted');
  };

  function isEmptyOrSingleNullValue(obj) {
    const keys = Object.keys(obj);
    return keys.length === 0 || (keys.length === 1 && obj[keys[0]] === null);
  }

  const handleAddToBasket = async () => {
    console.log('Add to Basket button pressed');
    console.log('selected attributes', selectedAttributes);

    if (isEmptyOrSingleNullValue(selectedAttributes)) {
      setErrorMessage('Attributes is missing');
      setModalVisible(true);
      return;
    }

    if (
      !responseData ||
      !responseData.items ||
      responseData.items.length === 0
    ) {
      console.log('No item data available');
      return;
    }

    // // Fetch current basket items from AsyncStorage
    const basketItems = await AsyncStorage.getItem('basketItems');
    const parsedBasketItems = basketItems ? JSON.parse(basketItems) : [];

    // Check if there are any items in the basket with a different vendor
    const differentVendorItem = parsedBasketItems.find(
      item => item.vendorName === responseData.items[0].vendorStore.name,
    );
    if (!differentVendorItem && parsedBasketItems.length > 0) {
      setErrorMessage('Item of different Vendor is not allow added to basket');
      setModalVisible(true);
      return;
    }

    const calculateDeliveryCharges = distance => {
      const dChargesPK = responseData.items[0].vendorStore.deliveryChargesPerKm;
      const dChargesMin =
        responseData.items[0].vendorStore.deliveryChargesMinimum;
      const dCharges = dChargesPK * distance;

      if (dCharges < dChargesMin) {
        return parseFloat(dChargesMin.toFixed(2));
      } else {
        return parseFloat(dCharges.toFixed(2));
      }
    };

    try {
      const deliveryChargesPerKm =
        responseData.items[0].vendorStore.deliveryChargesPerKm;
      const deliveryChargesMinimum =
        responseData.items[0].vendorStore.deliveryChargesMinimum;
      const serviceCharges = responseData.items[0].vendorStore.serviceCharges;
      const taxPercentage = responseData.items[0].vendorStore.taxPercentage;

      const item = responseData.items[0];
      const baseAmount = 1212; // Use the current totalPrice
      const serviceCharge = 5;
      const deliveryCharges = calculateDeliveryCharges(distanceToVendor);

      const taxAmount = (orderTotalPrice * taxPercentage) / 100;
      const finalTotalAmount = parseFloat(
        (taxAmount + orderTotalPrice).toFixed(2),
      );

      console.log('Calculated values:', {
        baseAmount,
        serviceCharge,
        deliveryCharges,
        taxAmount,
        finalTotalAmount,
        tipAmount,
        distanceToVendor,
      });

      const orderData = {
        type: 'MultivendorDeliveryService',
        addressCode: addressCode,

        items: [
          {
            code: item.code,
            quantity: 1,
            addons: selectedAddons.map(addon => ({
              code: addon.code,
            })),
            attributes: Object.entries(selectedAttributes)
              .map(([attrCode, selectedItem]) => ({
                code: attrCode,

                items: selectedItem
                  ? [
                      {
                        code: selectedItem.code,
                        quantity: 1, // You might want to allow quantity selection for attributes
                      },
                    ]
                  : [],
              }))
              .filter(attr => attr.items.length > 0),
          },
        ],
        billSummary: {
          distance: distanceToVendor
            ? parseFloat(distanceToVendor.toFixed(2))
            : 0,
          serviceCharges: serviceCharges, // You may want to calculate this dynamically
          taxPercentage: taxPercentage,
          deliveryCharges: deliveryCharges,
          orderAmount: parseFloat(orderTotalPrice.toFixed(2)),
          taxAmount: taxAmount,
          totalAmount: finalTotalAmount,
          tipAmount: 0,
        },
      };

      console.log('Order Data : ', JSON.stringify(orderData));

      // Get existing basket items
      const existingBasket = await AsyncStorage.getItem('basketItems');
      let basketItems = existingBasket ? JSON.parse(existingBasket) : [];
      // console.log('resturent name', item.vendorStore.name);

      // Add new item to basket

      basketItems.push({
        orderData: orderData,
        itemName: item.name,
        itemPrice: orderTotalPrice,
        vendorName: item.vendorStore.name,
        vendorlatitude: vendorlatitude,
        vendorlongitude: vendorlongitude,
        addons:
          selectedAddons.length > 0
            ? selectedAddons.map(addon => ({
                code: addon.code,
                name: addon.name,
                price: addon.price,
              }))
            : [],
        attributes:
          Object.keys(selectedAttributes).length > 0
            ? Object.entries(selectedAttributes)
                .filter(([_, selectedItem]) => selectedItem !== null)
                .map(([attrCode, selectedItem]) => ({
                  code: attrCode,
                  name: selectedItem.name,
                  price: selectedItem.amount,
                  categoryName: itemsDetails[0].attributes[0].name,
                }))
            : [],
        itemLogo: item.logo,
      });

      // Save updated basket
      await AsyncStorage.setItem('basketItems', JSON.stringify(basketItems));
      await AsyncStorage.setItem('deliveryCharges', deliveryCharges.toString());
      setBasketCount(prevCount => prevCount + 1);
      const newCount = basketCount + 1;
      setBasketCount(newCount);
      await updateBasketCount(newCount);

      animateBasketCount();
      setIsModalVisible(true); // Show the modal after adding to basket
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // const item = responseData.items[0];
  // const addons = item.addons;

  return (
    <View style={styles.area}>
      <StatusBar hidden />

      {renderHeader()}
      {renderContent()}

      <Button
        title="Add To Basket"
        filled
        style={styles.btn}
        onPress={handleAddToBasket}
      />
      <Toasts />

      <AddToBasketModal
        isVisible={isModalVisible}
        onClose={handleContinueShopping}
        onCheckout={handleCheckout}
      />

      <ErrorModal
        visible={modalVisible}
        message={errorMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.blackTie,
    marginBottom: 8,
    marginTop: 10,
  },
  itemPrice: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.blackTie,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.blackTie,
    marginTop: 16,
    marginBottom: 8,
  },

  addonNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addonName: {
    fontSize: 14,
    color: COLORS.blackTie,
    marginLeft: 8,
  },

  addonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  addonPrice: {
    fontSize: 14,
    color: COLORS.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  attributeContainer: {
    marginBottom: 16,
  },
  attributeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attributeName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.blackTie,
    marginBottom: 8,
  },
  attributeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  attributeItemName: {
    fontSize: 14,
    color: COLORS.grayscale700,
    marginLeft: 8,
  },
  attributeItemPrice: {
    fontSize: 14,
    color: COLORS.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.blackTie,
    marginBottom: 8,
  },
  vendorAddress: {
    fontSize: 14,
    color: COLORS.grayscale700,
    marginBottom: 4,
  },
  vendorPhone: {
    fontSize: 14,
    color: COLORS.grayscale700,
    marginBottom: 4,
  },
  vendorDescription: {
    fontSize: 14,
    color: COLORS.grayscale700,
    marginBottom: 16,
  },
  deliveryInfo: {
    fontSize: 14,
    color: COLORS.grayscale700,
    marginBottom: 4,
  },
  timingInfo: {
    fontSize: 14,
    color: COLORS.grayscale700,
    marginBottom: 4,
  },

  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 32,
    zIndex: 999,
    left: 16,
    right: 16,
  },

  basketIconContainer: {
    position: 'relative',
  },
  basketCountContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basketCountText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  plusOneText: {
    position: 'absolute',
    top: -20,
    right: -10,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
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

  backIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
    borderRadius: 22.5,
    backgroundColor: COLORS.black,
  },
  bookmarkIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  bookmarkIconn: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  sendIconContainer: {
    marginLeft: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    marginHorizontal: 12,
  },
  separateLine: {
    width: SIZES.width - 32,
    height: 1,
    backgroundColor: COLORS.grayscale200,
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.black,
    textAlign: 'center',
    marginTop: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    width: SIZES.width - 32,
  },
  headerContentTitle: {
    fontSize: 22,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.grayscale700,
    fontFamily: 'Urbanist Regular',
  },
  viewBtn: {
    color: COLORS.primary,
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Urbanist SemiBold',
  },
  subItemContainer: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    justifyContent: 'center',
  },
  addItemBtn: {
    height: 52,
    width: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.grayscale200,
    borderWidth: 1,
  },
  addItemBtnText: {
    fontSize: 24,
    color: COLORS.primary,
    fontFamily: 'Urbanist Medium',
  },
  addItemText: {
    fontSize: 20,
    color: COLORS.greyscale900,
    fontFamily: 'Urbanist SemiBold',
    marginHorizontal: 22,
  },
  input: {
    width: SIZES.width - 32,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    marginVertical: 12,
    backgroundColor: COLORS.tertiaryWhite,
  },
  btn: {
    width: SIZES.width - 32,
    marginHorizontal: 16,
    marginBottom: 24,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.primary,
  },
  checkedCheckbox: {
    backgroundColor: COLORS.primary,
  },
  checkIcon: {
    width: 12,
    height: 12,
    tintColor: COLORS.white,
  },
});

export default FoodDetailsAddItem;
