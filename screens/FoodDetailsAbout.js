import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { mapStandardStyle } from '../data/mapData';

const FoodDetailsAbout = () => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const latitude = 37.4220936; // Replace with your desired value or use a state variable
        const longitude = -122.083922; // Replace with your desired value or use a state variable

        const baseUrl = "http://burhan.tplinkdns.com:8001/api/v1.0/Item";
        const urlWithGeolocation = `${baseUrl}?Geolocation=${latitude},${longitude}`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        const response = await fetch(urlWithGeolocation, requestOptions);
        const result = await response.json();

        if (response.ok) {
          console.log(result);
          // Handle the successful response here
        } else {
          console.error("Error:", result);
          // Handle the error response here
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle any other errors here
      }
    };

    fetchData();
  }, []);





  const description = `Indulge in the freshest medley of flavors with our Big Garden Salad! Crisp greens, ripe tomatoes, crunchy cucumbers, and an array of vibrant vegetables come together in a harmony of taste and texture. Tossed with your choice of zesty dressing, every bite is a symphony of freshness that will tantalize your taste buds. Whether you're looking for a light lunch or a refreshing side dish, our Big Garden Salad is the perfect choice for health-conscious foodies and salad enthusiasts alike. Savor the goodness of nature's bounty – order yours today!`
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Big Garden Salad" />
        <ScrollView
          contentContainerStyle={{ marginVertical: 16 }}
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.viewSubtitle, {
            color: COLORS.greyscale900,
          }]}>Overview</Text>
          <Text style={[styles.description, {
            color: COLORS.grayscale700,
          }]} numberOfLines={expanded ? undefined : 4}>{description}</Text>
          <TouchableOpacity onPress={toggleExpanded}>
            <Text style={styles.viewBtn}>
              {expanded ? 'View Less' : 'View More'}
            </Text>
          </TouchableOpacity>
          <View style={{ marginVertical: 12 }}>
            <View style={styles.viewTimeContainer}>
              <Text style={[styles.viewTimeLeft, {
                color: COLORS.greyscale900,
              }]}>Monday - Friday:</Text>
              <Text style={styles.viewTimeRight}>10:00 - 22:00</Text>
            </View>
            <View style={styles.viewTimeContainer}>
              <Text style={[styles.viewTimeLeft, {
                color: COLORS.greyscale900,
              }]}>Saturyday - Sunday:</Text>
              <Text style={styles.viewTimeRight}>12:00 - 22:00</Text>
            </View>
          </View>
          <View style={styles.separateLine} />
          <Text style={[styles.viewSubtitle, {
            color: COLORS.greyscale900,
          }]}>Address</Text>

          <View style={styles.foodItemContainer}>
            <Image
              source={icons.pin}
              resizeMode='contain'
              style={styles.locationIcon}
            />
            <Text style={[styles.locationText, {
              color: COLORS.grayscale700,
            }]}>6993 Meadow Valley Terrace, New York</Text>
          </View>

          <View style={[styles.locationMapContainer, {
            backgroundColor: COLORS.white,
          }]}>
            <MapView
              style={styles.mapContainer}
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStandardStyle}
              userInterfaceStyle="dark"
              initialRegion={{
                latitude: 48.8566,
                longitude: 2.3522,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: 48.8566,
                  longitude: 2.3522,
                }}
                image={icons.mapsOutline}
                title="Move"
                description="Address"
                onPress={() => console.log("Move to another screen")}
              >
                <Callout tooltip>
                  <View>
                    <View style={styles.bubble}>
                      <Text
                        style={{
                          ...FONTS.body4,
                          fontWeight: 'bold',
                          color: COLORS.black,
                        }}
                      >
                        User Address
                      </Text>
                    </View>
                    <View style={styles.arrowBorder} />
                    <View style={styles.arrow} />
                  </View>
                </Callout>
              </Marker>
            </MapView>
          </View>
        </ScrollView>
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
  viewSubtitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginVertical: 12
  },
  description: {
    fontSize: 14,
    color: COLORS.grayscale700,
    fontFamily: "Urbanist Regular",
  },
  viewBtn: {
    color: COLORS.primary,
    marginTop: 5,
    fontSize: 14,
    fontFamily: "Urbanist SemiBold",
  },
  subItemContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "Urbanist SemiBold"
  },
  viewTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2
  },
  viewTimeLeft: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900
  },
  viewTimeRight: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary
  },
  separateLine: {
    width: SIZES.width - 32,
    height: 1,
    backgroundColor: COLORS.grayscale200
  },
  foodItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
    marginRight: 8
  },
  locationText: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
  },

  locationMapContainer: {
    height: 226,
    width: "100%",
    borderRadius: 12,
    marginVertical: 16
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.dark2
  },
  viewMapContainer: {
    height: 50,
    backgroundColor: COLORS.gray,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 'auto',
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  reviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    marginVertical: 16
  },
  reviewLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  starMiddleIcon: {
    height: 18,
    width: 18,
    tintColor: "orange",
    marginRight: 8
  },

})

export default FoodDetailsAbout