import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { COLORS, icons } from '../constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ResturentFoodCard = ({ name, image, onPress, distance, deliveryCharges, onFavoritePress, isFavorite }) => {
  return (
    <View> 
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={image} resizeMode="cover" style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Distance: {distance} km</Text>
        <Text style={styles.infoText}>Delivery: ${deliveryCharges}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
          <Image
            source={isFavorite ? icons.heart2 : icons.heart2Outline}
            resizeMode="contain"
            style={styles.heartIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('45%'),
    backgroundColor: COLORS.white,
    borderRadius: wp('4%'),
    marginBottom: hp('1.5%'),
    marginRight: wp('2%'),
    padding: wp('2%'),
    marginLeft: wp(1),
    marginTop: wp(1),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: hp('15%'),
    borderRadius: wp('2%'),
  },
  name: {
    fontSize: wp('4%'),
    fontFamily: "Urbanist-Bold",
    color: COLORS.greyscale900,
    marginVertical: hp('1%'),
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: wp('3%'),
    fontFamily: "Urbanist-Regular",
    color: COLORS.grayscale700,
    marginBottom: hp('0.5%'),
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  favoriteButton: {
    padding: wp('2%'),
  },
  heartIcon: {
    width: wp('5%'),
    height: wp('5%'),
    tintColor: COLORS.red,
  },
});

export default ResturentFoodCard;