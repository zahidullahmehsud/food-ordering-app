import {View, StyleSheet, FlatList} from 'react-native';
import {COLORS, SIZES} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {ScrollView} from 'react-native-virtualized-view';
import UserAddressItem from '../components/UserAddressItem';
import Button from '../components/Button';
import {useState, useEffect} from 'react';

// user address location
const Address = ({navigation, route}) => {
  const {locationName, addressName} = route.params ? route.params : {};
  console.log(locationName + addressName);

  const [userAddresses, setUserAddresses] = useState([]);

  useEffect(() => {
    if (locationName && addressName) {
      const newAddress = {
        id: `${userAddresses.length + 1}`,
        name: locationName,
        address: addressName,
      };
      setUserAddresses(prevAddresses => [...prevAddresses, newAddress]);
    }
  }, [locationName, addressName]);

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header title="Address" />
        <ScrollView
          contentContainerStyle={{marginVertical: 12}}
          showsVerticalScrollIndicator={false}>
          <FlatList
            data={userAddresses}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <UserAddressItem
                name={item.name}
                address={item.address}
                onPress={() => console.log('Clicked')}
              />
            )}
          />
        </ScrollView>
      </View>
      <View style={styles.btnContainer}>
        <Button
          title="Add New Address"
          onPress={() => navigation.navigate('AddNewAddress')}
          filled
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  btnContainer: {
    alignItems: 'center',
  },
  btn: {
    width: SIZES.width - 32,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
});

export default Address;
