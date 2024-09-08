import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, SIZES, icons} from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HorizontalFoodCardFavourite = ({
  name,
  image,
  distance,
  price,
  fee,
  rating,
  numReviews,
  isPromo,
  onPress,
  onLongPress,
  delayLongPress = 400,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      style={[
        styles.container,
        {
          backgroundColor: COLORS.white,
        },
      ]}>
      <Image source={image} resizeMode="cover" style={styles.image} />
      {/* {
                isPromo && isPromo === true && (
                    <View style={styles.reviewContainer}>
                        <Text style={styles.rating}>PROMO</Text>
                    </View>
                )
            } */}
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
        {/* <View style={styles.viewContainer}>
                    <Text style={[styles.location, {
                        color: COLORS.grayscale700,
                    }]}>{distance}  | {" "}</Text>
                    <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" />
                    <Text style={[styles.location, {
                        color: COLORS.grayscale700,
                    }]}>{" "}{rating}  ({numReviews})</Text>
                </View> */}
        {/* <View style={styles.bottomViewContainer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{price}</Text>
                        <Text style={styles.location}>{""}| {" "}</Text>
                        <Image
                            source={icons.moto}
                            resizeMode='contain'
                            style={styles.motoIcon}
                        />
                        <Text style={styles.location}>{fee}</Text>
                    </View>
                    <TouchableOpacity 
                       onPress={onPress}>
                        <Image
                            source={icons.heart2}
                            resizeMode='contain'
                            style={styles.heartIcon}
                        />
                    </TouchableOpacity>
                </View> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    padding: 6,
    borderRadius: 16,
    marginBottom: 12,
    height: 112,
    alignItems: 'center',
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
    fontSize: 17,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    marginVertical: 4,
    marginRight: 40,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'column',
    marginVertical: 4,
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
    fontSize: 10,
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
    marginTop: 2,
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
  price: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
    marginRight: 8,
  },
  motoIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.primary,
    marginRight: 4,
  },
});

export default HorizontalFoodCardFavourite;
