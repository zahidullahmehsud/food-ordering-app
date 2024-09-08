import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';

const CartItem = ({
  image1,
  image2,
  image3,
  name,
  numItems,
  distance,
  price,
  onPress
}) => {

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, {
        backgroundColor: COLORS.white
      }]}>
      <View style={styles.viewLeft}>
        <Image
          source={image1}
          resizeMode='contain'
          style={[styles.image, {
            marginLeft: 0,
            borderColor: COLORS.white
          }]}
        />
        <Image
          source={image2}
          resizeMode='contain'
          style={[styles.image, {
            marginLeft: -82,
            borderColor: COLORS.white
          }]}
        />
        <Image
          source={image3}
          resizeMode='contain'
          style={[styles.image, {
            marginLeft: -82,
            borderColor: COLORS.white
          }]}
        />
      </View>
      <View style={styles.viewRight}>
        <Text style={[styles.name, {
          color: COLORS.greyscale900
        }]}>{name}</Text>
        <Text style={[styles.description, {
          color: COLORS.grayscale700
        }]}>{numItems} items | {distance}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    padding: 6,
    borderRadius: 16,
    marginBottom: 12,
    height: 112,
    alignItems: "center",
  },
  viewLeft: {
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderColor: COLORS.white,
    borderWidth: 4
  },
  viewRight: {
    marginLeft: 12,
    flex: 1
  },
  name: {
    fontSize: 20,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
  },
  description: {
    fontSize: 14,
    color: COLORS.grayscale700,
    fontFamily: "Urbanist Regular",
    marginVertical: 4
  },
  price: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: "Urbanist Bold",
  }
})

export default CartItem