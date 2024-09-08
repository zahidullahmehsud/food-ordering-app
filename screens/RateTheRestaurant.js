import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, images } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import Rating from '../components/Rating';
import Button from '../components/Button';

const RateTheRestaurant = ({ navigation }) => {

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Image
              source={images.pizza1}
              resizeMode='contain'
              style={styles.avatar}
            />
            <Text style={[styles.rateName, {
              color: COLORS.greyscale900
            }]}>How was the delivery of your order from Big Garden Salad?</Text>
            <Text style={[styles.rateText, {
              color: COLORS.grayscale700,
            }]}>
              Enjoyed your food ? Rate the restaurant, your feedback is matters.
            </Text>
            <Rating color="orange" size={40} />
            <View style={[styles.separateLine, {
              backgroundColor: COLORS.grayscale200
            }]} />
            <TextInput
              placeholder='This food is very tasty and in good condition. I like it very much😍😍'
              placeholderTextColor={COLORS.black}
              style={[styles.input, {
                backgroundColor: COLORS.tertiaryWhite,
                borderColor: COLORS.grayscale200,
                color: COLORS.black
              }]}
              multiline
            />
            <Text style={[styles.viewSubtitle, {
              color: COLORS.grayscale700,
            }]}>
              Haven't received your order ?
            </Text>
            <TouchableOpacity>
              <Text style={styles.driverName}>
                Call your driver?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={[styles.bottomContainer, {
        backgroundColor: COLORS.white
      }]}>
        <Button
          title="Cancel"
          style={styles.cancelBtn}
        />
        <Button
          title="Submit"
          filled
          style={styles.submitBtn}
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  contentContainer: {
    alignItems: "center",
  },
  avatar: {
    height: 132,
    width: 132,
    borderRadius: 32,
    marginVertical: 12
  },
  rateName: {
    fontSize: 30,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12
  },
  rateText: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 12
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200
  },
  viewSubtitle: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 12
  },
  driverName: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.primary,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: 112,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36
  },
  cancelBtn: {
    width: (SIZES.width - 48) / 2,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary
  },
  submitBtn: {
    width: (SIZES.width - 48) / 2,
  },
  input: {
    height: 84,
    width: SIZES.width - 48,
    backgroundColor: COLORS.tertiaryWhite,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    marginVertical: 12
  }
})

export default RateTheRestaurant