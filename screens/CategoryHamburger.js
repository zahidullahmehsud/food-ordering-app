import {View, StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {ScrollView} from 'react-native-virtualized-view';
import HorizontalFoodCard from '../components/HorizontalFoodCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BarIndicator} from 'react-native-indicators';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fetchRestaurantItems} from '../api/client';

const AccordionItem = ({title, children}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleItem = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity style={styles.accordHeader} onPress={toggleItem}>
        <Text style={styles.accordTitle}>{title}</Text>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={15}
          color="#bbb"
        />
      </TouchableOpacity>
      {expanded && <View style={styles.accordBody}>{children}</View>}
    </View>
  );
};

const CategoryHamburger = ({navigation, route}) => {
  const [longitude, setLongitude] = useState('0');
  const [latitude, setLatitude] = useState('0');
  const [restaurantFoodItems, setRestaurantFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {vendorcode, distance, deliveryCharges} = route.params;

  useEffect(() => {
    const fetchLatLong = async () => {
      try {
        const lat = await AsyncStorage.getItem('latitude');
        const long = await AsyncStorage.getItem('longitude');
        setLatitude(lat);
        setLongitude(long);
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };

    const fetchData = async () => {
      try {
        const result = await fetchRestaurantItems(vendorcode);
        setRestaurantFoodItems(result);
      } catch (error) {
        console.error('Error fetching restaurant items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatLong();
    fetchData();
  }, [vendorcode]);

  if (isLoading || !latitude || !longitude) {
    return (
      <View style={styles.loadingContainer}>
        <BarIndicator color={COLORS.primary} />
      </View>
    );
  }

  const renderItem = ({item}) => {
    return (
      <HorizontalFoodCard
        name={item.name}
        image={{uri: item.logo}}
        distance={distance}
        price={item.amount}
        fee={item.vendorStore.deliveryChargesPerKm}
        rating={item.rating || 0}
        numReviews={item.numReviews || 0}
        isPromo={item.isPromo || false}
        onPress={() =>
          navigation.navigate('FoodDetailsAddItem', {itemCode: item.code})
        }
      />
    );
  };

  const StoreInfo = () => {
    if (!restaurantFoodItems.items || restaurantFoodItems.items.length === 0) {
      return null;
    }

    const store = restaurantFoodItems.items[0].vendorStore;

    return (
      <AccordionItem title={store.name}>
        <Text style={styles.infoTitle}>Description:</Text>
        <Text style={styles.infoText}>{store.description}</Text>

        <Text style={styles.infoTitle}>Address:</Text>
        <Text style={styles.infoText}>{store.address}</Text>

        <Text style={styles.infoTitle}>Phone:</Text>
        <Text style={styles.infoText}>{store.phone}</Text>

        <Text style={styles.infoTitle}>Distance:</Text>
        <Text style={styles.infoText}>{distance}km</Text>

        <Text style={styles.infoTitle}>Delivery Charges:</Text>
        <Text style={styles.infoText}>
          ${store.deliveryChargesPerKm}/km (Min: ${store.deliveryChargesMinimum}
          )
        </Text>

        <Text style={styles.infoTitle}>Store Hours:</Text>
        {store.timings.map((timing, index) => (
          <Text key={index} style={styles.timingInfo}>
            {timing.day}:{' '}
            {timing.opened ? `${timing.start} - ${timing.end}` : 'Closed'}
          </Text>
        ))}
      </AccordionItem>
    );
  };

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header title="Restaurant Items" />
        <StoreInfo />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.listContainer}>
            <FlatList
              data={restaurantFoodItems.items}
              keyExtractor={item => item.code}
              renderItem={renderItem}
            />
          </View>
        </ScrollView>
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
    padding: wp('4%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    backgroundColor: COLORS.secondaryWhite,
    marginVertical: hp('2%'),
  },
  storeInfoContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    // alignItems: 'center',
  },
  storeLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.black,
  },
  addressTitle: {
    color: COLORS.black,
    fontWeight: '700',
  },
  storeAddress: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
    fontWeight: '400',
    // textAlign: 'center',
  },
  storePhone: {
    fontSize: 14,
    color: COLORS.dark2,
    marginBottom: 5,
  },
  storeDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
    // textAlign: 'center',
  },
  storeDelivery: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 5,
  },
  accordContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  accordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  accordBody: {
    paddingTop: 10,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 4,
  },
  timingInfo: {
    fontSize: 13,
    color: COLORS.grayscale700,
    marginBottom: 4,
  },
});

export default CategoryHamburger;
