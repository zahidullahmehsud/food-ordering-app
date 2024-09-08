import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-virtualized-view';
import {COLORS, SIZES} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReasonItem from '../components/ReasonItem';
import Button from '../components/Button';
import Header from '../components/Header';
import {BarIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authStorage from '../auth/storage';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';

const CancelOrder = ({navigation, route}) => {
  const {orderCode} = route.params;
  const [comment, setComment] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellationReasons, setcancellationReasons] = useState();
  const [reasonCode, setReasonCode] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  /***
   * Render content
   */

  const handelCancelOrder = async () => {
    try {
      const userKey = 'setUser';
      const storeUser = await AsyncStorage.getItem(userKey);
      if (storeUser) {
        const parsedUser = JSON.parse(storeUser);
        console.log('User retrieved successfully:', parsedUser);

        const Token = await authStorage.getToken();
        const myHeaders = new Headers();

        myHeaders.append('Authorization', Token);
        // Add this line to set the Content-Type header
        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
          code: reasonCode,
          reason: selectedItem,
          token: {
            userType: parsedUser.userType,
            unique_name: parsedUser.unique_name,
            email: parsedUser.email,
            identificationCode: parsedUser.identificationCode,
          },
        });

        const requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        const response = await fetch(
          `https://server.saugeendrives.com:9001/api/v1.0/Order/${orderCode}`,
          requestOptions,
        );

        const jsonData = await response.json();
        console.log('Response ==>', jsonData);
        if (response.ok) {
          setSuccessMessage('Order has been cancelled successfully');
          setSuccessModalVisible(true);
        } else {
          // Add this to handle non-OK responses
          setErrorMessage(jsonData.message);
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Cannot cancel this order');
      setModalVisible(true);
    }
  };
  const renderContent = () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const storedLatitude = await AsyncStorage.getItem('latitude');
          const storedLongitude = await AsyncStorage.getItem('longitude');

          const Token = await authStorage.getToken();
          const myHeaders = new Headers();
          myHeaders.append('Authorization', Token);

          const queryParams = new URLSearchParams({
            Geolocation: `${storedLatitude},${storedLongitude}`,
          });

          const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
          };

          const response = await fetch(
            `https://server.saugeendrives.com:9001/api/v1.0/Customer/dashboard?${queryParams.toString()}`,
            requestOptions,
          );

          const jsonData = await response.json();

          console.log(
            'Customer dashboard api = ',
            jsonData.cancellationReasons,
          );
          console.log('Customer dashboard api = ', jsonData);
          setcancellationReasons(jsonData.cancellationReasons);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    const handleCheckboxPress = (itemTitle, reasonCode) => {
      console.log('reason code :', reasonCode, itemTitle);
      setReasonCode(reasonCode);
      if (selectedItem === itemTitle) {
        // If the clicked item is already selected, deselect it
        setSelectedItem(null);
      } else {
        // Otherwise, select the clicked item
        setSelectedItem(itemTitle);
      }
    };

    const handleCommentChange = text => {
      setComment(text);
    };

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <BarIndicator color={COLORS.primary} />
        </View>
      );
    }

    return (
      <View style={{marginVertical: 12}}>
        <Text
          style={[
            styles.inputLabel,
            {
              color: COLORS.greyscale900,
            },
          ]}>
          Please select the reason for the cancellations
        </Text>
        <View style={{marginVertical: 16}}>
          {cancellationReasons &&
            cancellationReasons.map(reason => (
              <ReasonItem
                key={reason.code}
                checked={selectedItem === reason.name}
                onPress={() => handleCheckboxPress(reason.name, reason.code)}
                title={reason.name}
              />
            ))}

          {/* <ReasonItem
            checked={selectedItem === 'Schedule change'}
            onPress={() => handleCheckboxPress('Schedule change')}
            title="Schedule change"
          /> */}
          {/* <ReasonItem
            checked={selectedItem === 'Weather conditions'}
            onPress={() => handleCheckboxPress('Weather conditions')}
            title="Weather conditions"
          />
          <ReasonItem
            checked={selectedItem === 'Unexpected Work'}
            onPress={() => handleCheckboxPress('Unexpected Work')}
            title="Unexpected Work"
          />
          <ReasonItem
            checked={selectedItem === 'Childcare Issue'}
            onPress={() => handleCheckboxPress('Childcare Issue')}
            title="Childcare Issue"
          />
          <ReasonItem
            checked={selectedItem === 'Travel Delays'}
            onPress={() => handleCheckboxPress('Travel Delays')}
            title="Travel Delays"
          />
          <ReasonItem
            checked={selectedItem === 'Others'}
            onPress={() => handleCheckboxPress('Others')}
            title="Others"
          /> */}
        </View>
        {/* <Text style={[styles.inputLabel, {
          color: COLORS.greyscale900
        }]}>Add detailed reason</Text>
        <TextInput
          style={[styles.input, {
            color: COLORS.greyscale900,
            borderColor: COLORS.greyscale900
          }]}
          placeholder="Write your reason here..."
          placeholderTextColor={COLORS.greyscale900}
          multiline={true}
          numberOfLines={4} // Set the number of lines you want to display initially
        /> */}
      </View>
    );
  };

  /**
   * Render submit buttons
   */
  const renderSubmitButton = () => {
    return (
      <View
        style={[
          styles.btnContainer,
          {
            backgroundColor: COLORS.white,
          },
        ]}>
        <Button
          title="Submit"
          filled
          style={styles.submitBtn}
          onPress={() => handelCancelOrder()}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header title="Cancel Order" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </View>

      {renderSubmitButton()}

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
          navigation.navigate('Orders', {initialTab: 'third'});
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
    padding: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
  },
  headerIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: COLORS.gray,
  },
  arrowLeft: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 0.3,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    paddingBottom: 10,
    fontSize: 12,
    height: 150,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Urbanist Medium',
    color: COLORS.black,
    marginBottom: 6,
    marginTop: 16,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 22,
    height: 72,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  btn: {
    height: 48,
    width: SIZES.width - 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  submitBtn: {
    width: SIZES.width - 32,
  },
  btnText: {
    fontSize: 16,
    fontFamily: 'Urbanist Medium',
    color: COLORS.white,
  },
});

export default CancelOrder;
