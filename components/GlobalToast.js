// components/GlobalToast.js

import React, {useRef} from 'react';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import {useNavigation} from '@react-navigation/native';
import authStorage from '../auth/storage';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GlobalToast = () => {
  const navigation = useNavigation();
  const toastedOrdersRef = useRef(new Set());

  const fetchOrders = async () => {
    try {
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Order?PaymentStatus=Unpaid',
        requestOptions,
      );
      const result = await response.json();

      if (response.ok) {
        // console.log("Order's get api result ", result);
        return result.orders;
      }
    } catch (error) {
      console.error('Error:', error);
    }

    return null;
  };

  const checkAndUpdateOrders = async () => {
    console.log('Toast fucntion');
    const newOrders = await fetchOrders();
    if (newOrders) {
      newOrders.forEach(newOrder => {
        if (
          newOrder.status === 'RiderAssigned' &&
          !toastedOrdersRef.current.has(newOrder.code)
        ) {
          showNavigableToast(newOrder);
          toastedOrdersRef.current.add(newOrder.code);
        }
      });

      // Check if any order has the status we're looking for
      const hasRelevantStatus = newOrders.some(order =>
        ['New', 'Confirmed'].includes(order.status),
      );

      if (!hasRelevantStatus) {
        // If no orders have the relevant status, clear the interval
        clearInterval(intervalId);
      }
    }
  };

  React.useEffect(() => {
    let intervalId;

    const startInterval = () => {
      intervalId = setInterval(checkAndUpdateOrders, 10000);
    };

    startInterval();

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <Toasts
      onToastPress={toastItem => {
        // Dismiss the toast
        toast.dismiss(toastItem.id);

        console.log(toastItem.ordersCode);
        console.log(toastItem.vendorCode);

        if (toastItem.ordersCode && toastItem.vendorCode) {
          navigation.navigate('PaymentMethods', {
            ordersCode: toastItem.ordersCode,
            vendorCode: toastItem.vendorCode,
          });
        }
      }}
    />
  );
};

const showNavigableToast = order => {
  console.log('Showing toast for order:', order.number);
  console.log('order code:', order.code);
  console.log('vendorStore code:', order.vendorStore.code);

  return toast.loading(
    () => (
      <View style={styles.toastContainer}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={24} color="#11A267" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Order Ready!</Text>
          <Text style={styles.message}>
            Order Number: {order.number}
            {'\n'}
            Your order is ready to deliver. Tap to proceed.
          </Text>
        </View>
      </View>
    ),
    {
      ordersCode: order.code,
      vendorCode: order.vendorStore.code,
      isSwipeable: true,
      position: ToastPosition.TOP,
      //duration: 5000, // 5 seconds
      styles: {
        view: {
          backgroundColor: 'white',
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 15,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      },
    },
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11A267',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default GlobalToast;
