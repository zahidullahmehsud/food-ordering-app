import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SearchingDriver = ({ navigation }) => {

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Searching Driver" />
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={styles.logoIcon}
            />
            <Text style={[styles.driverTitle, {
              color: COLORS.greyscale900
            }]}>
              Finding you a nearby driver...
            </Text>
            <Text style={[styles.driverSubtitle, {
              color: COLORS.grayscale700,
            }]}>
              This may take a few seconds...
            </Text>
          </View>

          <View style={styles.view1}>
            <View style={styles.view2}>
              <View style={styles.view3}>
                <View style={styles.view4}>
                  <Image
                    source={images.user4}
                    resizeMode='contain'
                    style={styles.userAvatar}
                  />
                </View>
              </View>
            </View>
          </View>

        </ScrollView>
        <View style={styles.slideBtnView}>
          <TouchableOpacity
            onPress={() => navigation.navigate("TrackDriver")}
            style={styles.slideBtn}>
            <View style={styles.slideCloseBtn}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.slideText}>{">>"} Slide to Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.primary
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  contentContainer: {
    marginVertical: 12,
    alignItems: 'center'
  },
  logoIcon: {
    height: 64,
    width: 64,
    tintColor: COLORS.primary
  },
  driverTitle: {
    fontSize: 20,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12
  },
  driverSubtitle: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    textAlign: "center"
  },
  view1: {
    width: SIZES.width - 64,
    height: SIZES.width - 64,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(27, 172, 75, 0.08)",
    marginVertical: 22
  },
  view2: {
    width: SIZES.width - 96,
    height: SIZES.width - 96,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(27, 172, 75, 0.12)"
  },
  view3: {
    width: SIZES.width - 112,
    height: SIZES.width - 112,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(27, 172, 75, 0.2)"
  },
  view4: {
    width: SIZES.width - 178,
    height: SIZES.width - 178,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(27, 172, 75, 0.26)"
  },
  userAvatar: {
    height: 112,
    width: 112,
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: COLORS.white
  },
  slideBtn: {
    backgroundColor: COLORS.primary,
    width: 178,
    height: 52,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  slideBtnView: {
    alignItems: "center",
    justifyContent: 'center',
  },
  slideCloseBtn: {
    height: 40,
    width: 40,
    backgroundColor: COLORS.white,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  slideText: {
    color: COLORS.white,
    fontFamily: "Urbanist Regular",
    fontSize: 13,
    textAlign: "center",
    marginHorizontal: 12
  }
})

export default SearchingDriver