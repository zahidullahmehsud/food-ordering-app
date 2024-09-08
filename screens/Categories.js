import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text, Alert} from 'react-native';
import {COLORS} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {categories} from '../data';
import Category from '../components/Category';
import {ScrollView} from 'react-native-virtualized-view';
import {icons, images} from '../constants';
import {BarIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

const Categories = ({navigation}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setlatitude] = useState(null);
  const [longitude, setlongitude] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStoredLocationfromAsync();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://server.saugeendrives.com:9001/api/v1.0/item-category',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();
        setData(jsonData);
        console.log(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
        setModalVisible(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchStoredLocationfromAsync = async () => {
    try {
      const Latitude = await AsyncStorage.getItem('latitude');
      const Longitude = await AsyncStorage.getItem('longitude');
      setlatitude(Latitude ? parseFloat(Latitude) : null);
      setlongitude(Longitude ? parseFloat(Longitude) : null);
      if (Latitude && Longitude) {
        console.log('Latitude =', Latitude);
        console.log('Longitude =', Longitude);
      } else {
        // Alert.alert('Oops', 'Please ensure you have set your destination .');
        setErrorMessage('Please ensure you have set your destination.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching data from storage:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setModalVisible(true);
    }
  };

  if (isLoading || !latitude || !longitude) {
    return (
      <View style={styles.loadingContainer}>
        <BarIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header title="All Categories" />
        <ScrollView style={styles.scrollView}>
          {data && data.list && (
            <FlatList
              data={data.list}
              keyExtractor={(item, index) => index.toString()}
              horizontal={false}
              numColumns={4} // Render two items per row
              renderItem={({item, index}) => (
                <Category
                  name={item.name}
                  // icon={item.icon}
                  //description={item.description}
                  icon={icons.burger}
                  backgroundColor={COLORS.white}
                  onPress={() =>
                    navigation.navigate('CategoryItem', {
                      itemname: item.name,
                    })
                  }
                />
              )}
            />
          )}
        </ScrollView>
      </View>

      <ErrorModal
        visible={modalVisible}
        message={errorMessage}
        onClose={() => setModalVisible(false)}
      />

      <SuccessModal
        visible={successModalVisible}
        message={successMessage}
        onClose={() => {
          setSuccessModalVisible(false);
          navigation.navigate('Login');
        }}
      />
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
    marginVertical: 10,
  },
  scrollView: {
    marginVertical: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Categories;
