import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import Clipboard from '@react-native-clipboard/clipboard';

const DriverDetails = ({ navigation }) => {
  const phoneNumber = '+1-202-555-0161'; // Replace with driver phone number

  const handleCopyToClipboard = () => {
    Clipboard.setString(phoneNumber);
    Alert.alert('Copied!', 'Phone Number ID copied to clipboard.');
  };
  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode='contain'
              style={[styles.backIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>Driver Details</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.headerIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.userInfoContainer}>
            <Image
              source={images.user2}
              resizeMode='contain'
              style={styles.avatar}
            />
            <Text style={[styles.driverName, {
              color: COLORS.greyscale900
            }]}>
              Daniel Austin
            </Text>
            <View style={styles.phoneNumberContainer}>
              <Text style={[styles.phoneNumber, {
                color: COLORS.greyscale900
              }]}>
                {phoneNumber}
              </Text>
              <TouchableOpacity
                onPress={handleCopyToClipboard}>
                <Image
                  source={icons.document2}
                  resizeMode='contain'
                  style={styles.documentIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.driverStatsContainer, {
            backgroundColor: COLORS.white
          }]}>
            <View style={styles.driverStatsItem}>
              <View style={styles.driverStatsIconContainer}>
                <Image
                  source={icons.star}
                  resizeMode='contain'
                  style={styles.driverStatsIcon}
                />
              </View>
              <Text style={[styles.statsNum, {
                color: COLORS.greyscale900
              }]}>4.9</Text>
              <Text style={[styles.statsLabel, {
                color: COLORS.grayscale700,
              }]}>Ratings</Text>
            </View>
            <View style={styles.driverStatsItem}>
              <View style={styles.driverStatsIconContainer}>
                <Image
                  source={icons.car2}
                  resizeMode='contain'
                  style={styles.driverStatsIcon}
                />
              </View>
              <Text style={[styles.statsNum, {
                color: COLORS.greyscale900
              }]}>279</Text>
              <Text style={[styles.statsLabel, {
                color: COLORS.grayscale700,
              }]}>Trips</Text>
            </View>
            <View style={styles.driverStatsItem}>
              <View style={styles.driverStatsIconContainer}>
                <Image
                  source={icons.clock2}
                  resizeMode='contain'
                  style={styles.driverStatsIcon}
                />
              </View>
              <Text style={[styles.statsNum, {
                color: COLORS.greyscale900
              }]}>5</Text>
              <Text style={[styles.statsLabel, {
                color: COLORS.grayscale700,
              }]}>Years</Text>
            </View>
          </View>

          <View style={[styles.summaryContainer, {
            backgroundColor: COLORS.white,
            borderRadius: 6,
          }]}>
            <View style={styles.viewContainer}>
              <Text style={[styles.viewLeft, {
                color:  "gray"
              }]}>Menber Since</Text>
              <Text style={[styles.viewRight, {
                color: COLORS.black
              }]}>July 19, 2027</Text>
            </View>
            <View style={styles.viewContainer}>
              <Text style={[styles.viewLeft, {
                color: "gray"
              }]}>Car Model</Text>
              <Text style={[styles.viewRight, {
                color: COLORS.black
              }]}>Mercedes-Benz E-class</Text>
            </View>
            <View style={styles.viewContainer}>
              <Text style={[styles.viewLeft, {
                color: "gray"
              }]}>Plate Number</Text>
              <Text style={[styles.viewRight, {
                color: COLORS.black
              }]}>HSW 4736 XK</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.btn, {
              backgroundColor: COLORS.red
            }]}>
            <Image
              source={icons.close}
              resizeMode='contain'
              style={styles.btnIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("VideoCall")}
            style={styles.btn}>
            <Image
              source={icons.videoCamera}
              resizeMode='contain'
              style={styles.btnIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("VoiceCall")}
            style={styles.btn}>
            <Image
              source={icons.telephone}
              resizeMode='contain'
              style={styles.btnIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.tertiaryWhite
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.tertiaryWhite,
    padding: 16
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  userInfoContainer: {
    alignItems: "center"
  },
  avatar: {
    height: 108,
    width: 108,
    borderRadius: 999,
    marginVertical: 16
  },
  driverName: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
  },
  phoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8
  },
  phoneNumber: {
    fontFamily: "Urbanist Medium",
    fontSize: 16,
    color: COLORS.grayscale700
  },
  documentIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.primary,
    marginHorizontal: 6
  },
  driverStatsContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 24,
    marginVertical: 12,
    backgroundColor: COLORS.white
  },
  driverStatsItem: {
    alignItems: "center",
    paddingHorizontal: 24
  },
  driverStatsIconContainer: {
    height: 52,
    width: 52,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary
  },
  driverStatsIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white
  },
  statsNum: {
    fontFamily: "Urbanist Bold",
    fontSize: 18,
    color: COLORS.greyscale900,
    marginVertical: 6
  },
  statsLabel: {
    fontFamily: "Urbanist Regular",
    fontSize: 13,
    color: COLORS.grayscale700,
  },
  summaryContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: 16,
    marginVertical: 8
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 6
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: "gray"
  },
  viewRight: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  btn: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    marginHorizontal: 16
  },
  btnIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.white
  }
})

export default DriverDetails