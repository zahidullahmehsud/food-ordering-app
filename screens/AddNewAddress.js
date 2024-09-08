import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  PermissionsAndroid,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import {SafeAreaView} from 'react-native-safe-area-context';
import {icons, SIZES, COLORS, images, FONTS} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {locationIcon} from '../constants/images';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import CustomPlacesAutocomplete from '../components/CutomPlacesAutocomplete';
import {fetchPlaceDetails, saveLocation} from '../api/client';
import {mapStandardStyle} from '../data/mapData';
import Button from '../components/Button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AddNewAddress = ({navigation, route}) => {
  const mapViewRef = useRef(null);

  const [error, setError] = useState();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [locationNameValue, setLocationNameValue] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Home', value: 'home'},
    {label: 'Office', value: 'office'},
    {label: 'Other', value: 'other'},
  ]);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [roomNo, setRoomNo] = useState('');
  const [buildingName, setBuildingName] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
      fetchPlaceDetailsAndUpdateState();
    }
  }, [placeName]);

  useEffect(() => {
    _getLocationPermission();
  }, [setSelectedCoordinates]);

  const _getLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Please allow location permission to continue',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
          _getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  function _getCurrentLocation() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setCurrentLocation(location);
        setSelectedCoordinates(location);

        mapViewRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        fetchPlaceDetailsAndUpdateState(location.latitude, location.longitude);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }

  const fetchPlaceDetailsAndUpdateState = async (latitude, longitude) => {
    try {
      const formattedAddress = await fetchPlaceDetails(latitude, longitude);
      setPlaceName(formattedAddress);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleSaveLocation = async () => {
    setMessage('');
    setErrorModalVisible(false);
    setSuccessModalVisible(false);
    setIsButtonDisabled(true);

    if (placeName == '') {
      setMessage('Location is missing');
      return setErrorModalVisible(true);
    }

    if (selectedValue == null) {
      setMessage('Location type is missing');
      return setErrorModalVisible(true);
    }
    if (locationNameValue.trim() == '') {
      setMessage('Location label is missing');
      return setErrorModalVisible(true);
    }
    // if (roomNo.trim() == '') {
    //   setMessage('Room No. is missing');
    //   return setErrorModalVisible(true);
    // }
    // if (buildingName.trim() == '') {
    //   setMessage('Building name is missing');
    //   return setErrorModalVisible(true);
    // }

    if (currentLocation) {
      const requestBody = {
        type: selectedValue,
        label: locationNameValue,
        address: placeName,
        latitude: `${selectedCoordinates.latitude}`,
        longitude: `${selectedCoordinates.longitude}`,
        default: true,
        active: true,
        roomNo: roomNo,
        building: buildingName,
      };

      try {
        await AsyncStorage.setItem('locationType', locationNameValue);
        await AsyncStorage.setItem('address', placeName);

        await saveLocation(requestBody);
        setMessage('Location added Successfully');
        setSuccessModalVisible(true);

        // navigation.navigate('CheckoutOrdersAddress', {
        //   locationName: selectedValue,
        //   addressName: placeName,
        //   latitude: `${selectedCoordinates.latitude}`,
        //   longitude: `${selectedCoordinates.longitude}`,
        // });
      } catch (error) {
        setMessage(error.message);
        setErrorModalVisible(true);
      } finally {
        setIsButtonDisabled(false);
      }
    }
  };

  const {width, height} = Dimensions.get('window');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar hidden={true} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          top: 22,
          left: 16,
          right: 16,
          zIndex: 999,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 35,
            width: 35,
            borderRadius: 22.5,
            backgroundColor: COLORS.black,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
          <Image
            source={icons.arrowLeft}
            resizeMode="contain"
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            _getLocationPermission().then(() => {
              setSelectedCoordinates({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              });
            });
          }}
          style={{
            height: 35,
            width: 35,
            borderRadius: 22.5,
            backgroundColor: COLORS.black,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
          <Image
            source={locationIcon}
            resizeMode="contain"
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 10,
          zIndex: 1,
          position: 'absolute',
          backgroundColor: 'white',
          bottom: 0,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginVertical: 0, alignItems: 'center'}}>
            <View
              style={{
                marginTop: 10,
                width: SIZES.width - 32,
              }}>
              <Text
                style={[
                  styles.inputHeader,
                  {
                    color: COLORS.greyscale900,
                  },
                ]}>
                Location
              </Text>

              <TextInput
                placeholder="Your Location"
                placeholderTextColor={COLORS.black}
                value={placeName}
                style={{
                  color: COLORS.black,
                }}
                editable={false}
              />
            </View>

            <View style={{zIndex: 3}}>
              <DropDownPicker
                open={open}
                value={selectedValue}
                items={items}
                setOpen={setOpen}
                setValue={value => {
                  setValue(value);
                  setSelectedValue(value);
                }}
                setItems={setItems}
                placeholder={'Select Location Type'}
                name="location_type"
              />
            </View>

            <View
              style={{
                marginVertical: 5,
                backgroundColor: COLORS.grayscale100,
                justifyContent: 'center',
                width: wp('95%'),
                height: hp(5),
                borderRadius: 10,
              }}>
              <TextInput
                placeholder="Label"
                placeholderTextColor={COLORS.black}
                value={locationNameValue}
                onChangeText={text => setLocationNameValue(text)}
                style={{
                  color: COLORS.black,
                  fontFamily: 'Urbanist Regular',
                  marginLeft: 10,
                  fontWeight: '500',
                }}
              />
            </View>
            <View
              style={{
                marginVertical: 5,
                backgroundColor: COLORS.grayscale100,
                justifyContent: 'center',
                width: wp('95%'),
                height: hp(5),
                borderRadius: 10,
              }}>
              <TextInput
                placeholder="Room No#"
                placeholderTextColor={COLORS.black}
                value={roomNo}
                onChangeText={text => setRoomNo(text)}
                style={{
                  color: COLORS.black,
                  fontFamily: 'Urbanist Regular',
                  marginLeft: 10,
                  fontWeight: '500',
                }}
              />
            </View>
            <View
              style={{
                marginVertical: 5,
                backgroundColor: COLORS.grayscale100,
                justifyContent: 'center',
                width: wp('95%'),
                height: hp(5),
                borderRadius: 10,
              }}>
              <TextInput
                placeholder="Building"
                placeholderTextColor={COLORS.black}
                value={buildingName}
                onChangeText={text => setBuildingName(text)}
                style={{
                  color: COLORS.black,
                  fontFamily: 'Urbanist Regular',
                  marginLeft: 10,
                  fontWeight: '500',
                }}
              />
            </View>
          </View>
        </View>
        <View>
          <Button
            filled
            disabled={isButtonDisabled}
            title="SAVE LOCATION"
            onPress={handleSaveLocation}
            style={{
              borderRadius: 30,
            }}
          />
        </View>
      </View>

      <View
        style={{
          top: 60,
          width: '100%',
          zIndex: 1,
        }}>
        <CustomPlacesAutocomplete
          onPlaceSelect={place => {
            setPlaceName(place.placeName);
            setSelectedCoordinates({
              latitude: place.latitude,
              longitude: place.longitude,
            });
            mapViewRef.current.animateToRegion({
              latitude: place.latitude,
              longitude: place.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }}
          apiKey="AIzaSyCq5Y4F8m77wt929gwKepvFlO4aBLO7bt4"
          placeholder="My location"
          value={placeName}
          style={{borderRadius: 10}}
        />
      </View>

      <MapView
        ref={mapViewRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStandardStyle}
        initialRegion={{
          latitude: currentLocation ? currentLocation.latitude : 37.78825,
          longitude: currentLocation ? currentLocation.longitude : -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {selectedCoordinates && (
          <Marker
            coordinate={{
              latitude: selectedCoordinates.latitude,
              longitude: selectedCoordinates.longitude,
            }}
            title="Move"
            description="Address"
            draggable
            onDragEnd={e => {
              const newCoordinates = e.nativeEvent.coordinate;
              setSelectedCoordinates(newCoordinates);
              console.log(newCoordinates);
              fetchPlaceDetailsAndUpdateState(
                newCoordinates.latitude,
                newCoordinates.longitude,
              );

              mapViewRef.current.animateToRegion({
                latitude: newCoordinates.latitude,
                longitude: newCoordinates.longitude,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0121,
              });
            }}>
            <Callout tooltip>
              <View>
                <View style={styles.bubble}>
                  <Text
                    style={{
                      ...FONTS.body4,
                      fontWeight: 'bold',
                      color: COLORS.black,
                    }}>
                    User Address
                  </Text>
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>
      <SuccessModal
        visible={successModalVisible}
        message={message}
        onClose={() => {
          setSuccessModalVisible(false);
          navigation.navigate('CheckoutOrdersAddress', {
            locationName: selectedValue,
            addressName: placeName,
            latitude: `${selectedCoordinates.latitude}`,
            longitude: `${selectedCoordinates.longitude}`,
          });
        }}
      />
      <ErrorModal
        visible={errorModalVisible}
        message={message}
        onClose={() => {
          setErrorModalVisible(false);
          setIsButtonDisabled(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  touchableImageContainer: {
    paddingHorizontal: 10,
  },
  touchableImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: COLORS.primary, // Adjust tint color as needed
  },

  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImage: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    resizeMode: 'contain', // Adjust resize mode as needed
  },

  // Callout bubble
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
  body3: {
    fontSize: 12,
    color: COLORS.gray5,
    marginVertical: 3,
  },
  h3: {
    fontSize: 12,
    color: COLORS.gray5,
    marginVertical: 3,
    fontFamily: 'Urbanist Bold',
    marginRight: 6,
  },
  btn1: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn2: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderColor: COLORS.primary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  roundedCheckBoxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.gray,
    marginRight: 12,
  },
  selectedCheckbox: {
    backgroundColor: COLORS.primary,
  },
  checkboxText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Urbanist Regular',
  },
  starContainer: {
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.secondaryGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  inputHeader: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddNewAddress;
