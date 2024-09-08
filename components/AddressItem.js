import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, SIZES, icons} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AddressItem = ({
  checked,
  type,
  address,
  onPress,
  roomNo,
  building,
  label,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          borderBottomColor: COLORS.grayscale100,
          backgroundColor: COLORS.white,
        },
      ]}>
      <View style={styles.routeLeftContainer}>
        <View style={styles.locationIcon1}>
          <View style={styles.locationIcon2}>
            <Image
              source={icons.location2}
              resizeMode="contain"
              style={styles.locationIcon3}
            />
          </View>
        </View>
        <View style={{width: wp(60)}}>
          <Text
            style={[
              styles.routeAddress,
              {
                color: COLORS.grayscale700,
                fontWeight: '700',
              },
            ]}>
            {type}
          </Text>
          <Text
            style={[
              styles.routeAddress,
              {
                color: COLORS.grayscale700,
                fontWeight: '700',
                fontSize: 15,
                fontFamily: 'Urbanist Regular',
              },
            ]}>
            {label}
          </Text>
          <Text
            style={[
              styles.routeAddress,
              {
                color: COLORS.grayscale700,
              },
            ]}>
            <Text style={{fontWeight: '700'}}>Building : </Text>
            {building}
          </Text>
          <Text
            style={[
              styles.routeAddress,
              {
                color: COLORS.grayscale700,
              },
            ]}>
            <Text style={{fontWeight: '700'}}>Room no : </Text>
            {roomNo}
          </Text>

          <Text
            style={[
              styles.routeAddress,
              {
                color: COLORS.grayscale700,
              },
            ]}>
            <Text style={{fontWeight: '700'}}>Address : </Text>
            {address}
          </Text>
        </View>
      </View>
      <View style={styles.leftContainer}>
        <TouchableOpacity style={{marginLeft: 0}} onPress={onPress}>
          <View style={styles.roundedChecked}>
            {checked && <View style={styles.roundedCheckedCheck} />}
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  routeLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon1: {
    height: 52,
    width: 52,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: 'rgba(27, 172, 75, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon2: {
    height: 36,
    width: 36,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon3: {
    height: 16,
    width: 16,
    tintColor: COLORS.white,
  },
  routeName: {
    fontSize: 15,
    color: COLORS.greyscale900,
    // fontFamily: 'Urbanist Bold',
    fontWeight: '700',
    //marginBottom: 6,
  },
  routeAddress: {
    fontSize: 12,
    color: COLORS.grayscale700,
    fontFamily: 'Urbanist Regular',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundedChecked: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  roundedCheckedCheck: {
    height: 10,
    width: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
});

export default AddressItem;
