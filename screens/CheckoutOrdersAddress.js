import {View, StyleSheet, Text, Image} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {COLORS, SIZES} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {ScrollView} from 'react-native-virtualized-view';
import AddressItem from '../components/AddressItem';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MemoizedAddressItem from '../components/MemoizedAddressItem ';
import authStorage from '../auth/storage';
import {BarIndicator} from 'react-native-indicators';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import RBSheet from 'react-native-raw-bottom-sheet';

const MAX_ADDRESS_LENGTH = 25; // Maximum allowed characters for address text

const truncateAddress = address => {
  if (address && address.length > MAX_ADDRESS_LENGTH) {
    return address.substring(0, MAX_ADDRESS_LENGTH) + '...'; // Truncate address if it exceeds maximum length
  } else {
    return address;
  }
};

const CheckoutOrdersAddress = ({navigation, route}) => {
  const refRBSheet = useRef();
  const [selectedItem, setSelectedItem] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [myLocationName, setmyLocationName] = useState();
  const [myplaceName, setmyplaceName] = useState();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStoredData();
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    const Token = await authStorage.getToken();
    const myHeaders = new Headers();
    myHeaders.append('Authorization', Token);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    try {
      setLoading(true);
      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Customer',
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
      const allAddresses = data.profile.addresses;
      console.log(allAddresses);

      // Separate addresses based on type
      const homeAndOfficeAddresses = allAddresses.filter(
        address => address.type === 'Home' || address.type === 'Office',
      );

      const otherAddresses = allAddresses.filter(
        address => address.type === 'Other',
      );

      // Remove duplicates from 'Other' type addresses
      const uniqueOtherAddresses = otherAddresses.filter(
        (address, index, self) =>
          index === self.findIndex(t => t.address === address.address),
      );

      // Combine all addresses
      const filteredAddresses = [
        ...homeAndOfficeAddresses,
        ...uniqueOtherAddresses,
      ];

      setAddresses(filteredAddresses);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (myLocationName && myplaceName) {
      const newAddress = {
        type: myLocationName,
        address: myplaceName,
        code: `${new Date().getTime()}`, // Generate a unique code for the new address
        latitude: latitude,
        longitude: longitude,
        default: false,
        active: true,
      };
      setAddresses(prevAddresses => {
        const existingAddressIndex = prevAddresses.findIndex(
          address =>
            address.type === newAddress.type &&
            address.address === newAddress.address,
        );

        if (existingAddressIndex === -1) {
          const updatedAddresses = [...prevAddresses, newAddress];
          storeAddresses(updatedAddresses);
          return updatedAddresses;
        } else {
          return prevAddresses;
        }
      });
    }
  }, [myLocationName, myplaceName, latitude, longitude]);

  useEffect(() => {
    if (route.params) {
      const {latitude, longitude} = route.params;
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      setLatitude(latitude);
      setLongitude(longitude);
    }
  }, [route.params]);

  const fetchStoredData = async () => {
    try {
      const location = await AsyncStorage.getItem('locationType');
      const place = await AsyncStorage.getItem('address');
      const storedAddresses = await AsyncStorage.getItem('addresses');

      if (location && place && storedAddresses) {
        console.log(location);
        console.log(place);
        console.log(storedAddresses);

        setmyLocationName(location);
        setmyplaceName(place);
        setAddresses(JSON.parse(storedAddresses));
        setSelectedItem(location); // Set the latest fetched location as selected
      }
    } catch (error) {
      console.error('Error fetching data from storage:', error);
    }
  };

  // Adjusted useEffect for handling new addresses
  useEffect(() => {
    if (myLocationName && myplaceName) {
      const newAddress = {myLocationName, myplaceName};
      setAddresses(prevAddresses => {
        const existingAddressIndex = prevAddresses.findIndex(
          address =>
            address.myLocationName === newAddress.myLocationName &&
            address.myplaceName === newAddress.myplaceName,
        );

        if (existingAddressIndex === -1) {
          const updatedAddresses = [...prevAddresses, newAddress];
          storeAddresses(updatedAddresses);

          return updatedAddresses;
        } else {
          return prevAddresses;
        }
      });
    }
  }, [myLocationName, myplaceName]);

  // Ensure storeAddresses function is called correctly
  const storeAddresses = async addressesToStore => {
    try {
      await AsyncStorage.setItem('addresses', JSON.stringify(addressesToStore));
    } catch (error) {
      console.error('Error storing addresses in AsyncStorage:', error);
    }
  };

  const handleCheckboxPress = addressItem => {
    setSelectedItem(addressItem);
    setIsAddressSelected(true); // Set isAddressSelected to true when an address is selected
    console.log('Selected Address:', addressItem);
  };

  const handleApplyAddress = async () => {
    try {
      selectedItem.default = true;
      console.log('Default Address is :' + JSON.stringify(selectedItem));
      // const storedDefaultAddress = await AsyncStorage.getItem('defaultAddress');
      // const def = JSON.parse(storedDefaultAddress);
      // console.log('DEF :' + def.code);

      await AsyncStorage.setItem(
        'defaultAddress',
        JSON.stringify(selectedItem),
      );

      setMessage('New location set successfully');
      setSuccessModalVisible(true);
      // const token = await authStorage.getToken();
      // const response = await fetch(
      //   'https://server.saugeendrives.com:9001/api/v1.0/Customer/address',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: token, // Replace with your actual access token
      //     },
      //     body: JSON.stringify(selectedItem),
      //   },
      // );

      // if (response.ok) {
      //   setMessage('New location set successfully');
      //   setSuccessModalVisible(true);
      //   //
      // }
    } catch (error) {}
  };
  const handleDeleteAddress = async () => {
    const storedDefaultAddress = await AsyncStorage.getItem('defaultAddress');
    if (storedDefaultAddress) {
      const selectedAddress = JSON.parse(storedDefaultAddress);

      if (selectedItem.code == selectedAddress.code) {
        await AsyncStorage.removeItem('defaultAddress');
      }
    }
    console.log('first');

    try {
      const token = await authStorage.getToken();
      const response = await fetch(
        `https://server.saugeendrives.com:9001/api/v1.0/Customer/address/${selectedItem.code}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, // Replace with your actual access token
          },
        },
      );

      if (response.ok) {
        setMessage('Address Delete Successfull');
        setSuccessModalVisible(true);
        //
      }
    } catch (error) {}
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <BarIndicator color={COLORS.primary} />
      </View>
    );
  }

  const BottomContainer = () => {
    return (
      <View style={{marginTop: 25}}>
        <View style={styles.bottomContainer}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: COLORS.tansparentPrimary,
            }}
            textColor={COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Yes, Delete"
            filled
            style={styles.removeButton}
            onPress={() => {
              handleDeleteAddress();
              refRBSheet.current.close();
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <View style={{flexDirection: 'row'}}>
          <Header title="Deliver To" />
        </View>

        <ScrollView
          contentContainerStyle={{
            backgroundColor: COLORS.tertiaryWhite,
            marginVertical: 12,
          }}
          showsVerticalScrollIndicator={true}>
          {addresses.map(address => (
            <MemoizedAddressItem
              key={address.code}
              checked={selectedItem === address}
              onPress={() => handleCheckboxPress(address)}
              type={address.type}
              address={address.address}
              building={address.building}
              roomNo={address.roomNo}
              label={address.label}
            />
          ))}

          {/* <AddressItem
  key={address.code}
  checked={selectedItem === address}
  onPress={() => handleCheckboxPress(address)}
  name={address.type}
  address={truncateAddress(address.address)}
/> */}
          {/* <AddressItem
            checked={selectedItem === 'My Office'}
            onPress={() => handleCheckboxPress('My Office')}
            name="My Office"
            address="5259 Blue Bill Park, PC 4629"
          />
          <AddressItem
            checked={selectedItem === 'My Appartment'}
            onPress={() => handleCheckboxPress('My Appartment')}
            name="My Appartment"
            address="21833 Clyde Gallagher, PC 4629 "
          />
          <AddressItem
            checked={selectedItem === "My Parent's House"}
            onPress={() => handleCheckboxPress("My Parent's House")}
            name="My Parent's House"
            address="61480 Sunbrook Park, PC 45"
          />
          <AddressItem
            checked={selectedItem === "My Villa"}
            onPress={() => handleCheckboxPress("My Villa")}
            name="My Villa"
            address="61480 Sunbrook Park, PC 45"
          /> */}
          <Button
            title="Add New Address"
            style={{
              marginTop: 20,
              width: SIZES.width - 32,
              borderRadius: 32,
              backgroundColor: COLORS.tansparentPrimary,
              borderColor: COLORS.tansparentPrimary,
            }}
            textColor={COLORS.primary}
            onPress={() => navigation.navigate('AddNewAddress')}
          />
        </ScrollView>

        <Button
          title="Delete"
          style={{backgroundColor: COLORS.red, borderColor: COLORS.red}}
          filled
          disabled={!isAddressSelected} // Disable the button if no address is selected
          onPress={() => {
            refRBSheet.current.open();
          }}
        />

        <Button
          title="Apply"
          filled
          disabled={!isAddressSelected} // Disable the button if no address is selected
          onPress={() => {
            handleApplyAddress();
            // if (isAddressSelected) {
            //   // Navigate back if an address is selected
            //   navigation.navigate('Home');
            // }
          }}
        />
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={230}
        customStyles={{
          wrapper: {backgroundColor: 'rgba(0,0,0,0.5)'},
          draggableIcon: {backgroundColor: COLORS.greyscale300},
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 230,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            width: '100%',
            paddingVertical: 12,
          },
        }}>
        <Text style={[styles.bottomSubtitle, {color: COLORS.black}]}>
          Are you sure delete the address?
        </Text>
        <View style={styles.separateLine} />

        <BottomContainer />
      </RBSheet>

      <SuccessModal
        visible={successModalVisible}
        message={message}
        onClose={() => {
          setSuccessModalVisible(false);
          navigation.navigate('Home');
        }}
      />
      <ErrorModal
        visible={errorModalVisible}
        message={message}
        onClose={() => setErrorModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  addBtn: {
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary,
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginVertical: 12,
  },
  separateLine: {
    width: '100%',
    height: 0.2,
    backgroundColor: COLORS.greyscale300,
    marginHorizontal: 16,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 16,
    width: SIZES.width,
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32,
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.red,
    borderRadius: 32,
    borderColor: 'white',
  },
});

export default CheckoutOrdersAddress;
