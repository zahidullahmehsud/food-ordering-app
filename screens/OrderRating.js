import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, SIZES, icons, images} from '../constants';

export default function OrderRating({navigation}) {
  return (
    <View style={styles.container}>
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
          Order Rating
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 10},
  container1: {
    backgroundColor: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: '5%',
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
});
