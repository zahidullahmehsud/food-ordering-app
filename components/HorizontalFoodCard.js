import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {COLORS, SIZES, icons} from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HorizontalFoodCard = ({
  name,
  image,
  distance,
  price,
  fee,
  rating,
  numReviews,
  isPromo,
  onPress,
  vendorStore,
}) => {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: COLORS.white,
        },
      ]}>
      <Image source={image} resizeMode="cover" style={styles.image} />
      {/* {isPromo && isPromo === true && (
        <View style={styles.reviewContainer}>
          <Text style={styles.rating}>PROMO</Text>
        </View>
      )} */}
      <View style={styles.columnContainer}>
        <View style={styles.topViewContainer}>
          <Text
            style={[
              styles.name,
              {
                color: COLORS.greyscale900,
              },
            ]}>
            {name}
          </Text>
        </View>

        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 12,
            color: 'green',
            textAlign: 'left',
          }}>
          Price: {price}$
        </Text>

        <Text style={styles.price}>
          Delivery Charges Per km: {fee} {'$'}
        </Text>
        <View style={styles.viewContainer}>
          <Text
            style={[
              styles.location,
              {
                color: COLORS.grayscale700,
              },
            ]}>
            Distance: {distance} km
          </Text>

          {/* <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" />
                    <Text style={[styles.location, {
                        color: COLORS.grayscale700,
                    }]}>{" "}{rating}  ({numReviews})</Text> */}
        </View>
        <Text style={{fontSize: 12, fontWeight: '600'}}>{vendorStore}</Text>

        <View style={styles.bottomViewContainer}>
          {/* <Text
            style={{
              fontWeight: 'bold',
              fontSize: 17,
              color: 'green',
              textAlign: 'left',
            }}>
            Price: {price}$
          </Text> */}
          <View style={styles.priceContainer}>
            {/* <Text style={styles.price}>
              Deliver Charges: {price} {'$'}
            </Text> */}
            {/* <Text style={styles.location}>{''} | </Text> */}
            {/* <Image
              source={icons.moto}
              resizeMode="contain"
              style={styles.motoIcon}
            /> */}
            {/* <Text style={styles.location}>{fee}</Text> */}
          </View>

          {/* <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
            <Image
              source={isFavourite ? icons.heart2 : icons.heart2Outline}
              resizeMode="contain"
              style={styles.heartIcon}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // width: SIZES.width - 32,
    backgroundColor: COLORS.white,

    borderRadius: 15,
    margin: 10,
    height: 150,
    alignItems: 'center',
    elevation: 1,
    padding: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  columnContainer: {
    flexDirection: 'column',
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    marginVertical: 4,
    marginRight: 40,
  },
  location: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
  },
  priceContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    //width: 200,
  },
  duration: {
    fontSize: 12,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
    marginRight: 8,
  },
  heartIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.red,
    marginLeft: 6,
  },
  reviewContainer: {
    position: 'absolute',
    top: 16,
    left: 54,
    width: 46,
    height: 20,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.white,
    marginLeft: 4,
  },
  topViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SIZES.width - 164,
  },
  bottomViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // price: {
  //     fontSize: 16,
  //     fontFamily: "Urbanist SemiBold",
  //     color: COLORS.primary,
  //     marginRight: 8
  // },
  price: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
  },
  motoIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.primary,
    marginRight: 4,
  },
});

export default HorizontalFoodCard;
