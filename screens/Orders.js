import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {ActiveOrders, CancelledOrders, CompletedOrders} from '../tabs';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import {COLORS, SIZES} from '../constants';

const Orders = ({navigation, route}) => {
  const layout = useWindowDimensions();
  const [routes] = useState([
    {key: 'first', title: 'Active'},
    {key: 'second', title: 'Completed'},
    {key: 'third', title: 'Cancelled'},
  ]);

  const initialTab = route?.params?.initialTab || 'first';
  const [index, setIndex] = useState(() => {
    const initialIndex = routes.findIndex(r => r.key === initialTab);
    return initialIndex >= 0 ? initialIndex : 0;
  });

  const [key, setKey] = useState(0);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (route.params?.isPaymentSuccessfull && !hasShownToast) {
      toast.success('Payment Successful.', {
        duration: 4000,
        position: 'bottom',
        styles: {
          view: {backgroundColor: '#11A267', borderRadius: 10},
          text: {color: 'white'},
          indicator: {backgroundColor: 'white'},
        },
      });
      setHasShownToast(true);
      navigation.setParams({isPaymentSuccessfull: undefined});
    }
  }, [route.params?.isPaymentSuccessfull, hasShownToast]);

  useEffect(() => {
    if (route?.params?.initialTab) {
      const newIndex = routes.findIndex(r => r.key === route.params.initialTab);
      if (newIndex >= 0) {
        setIndex(newIndex);
        setKey(prevKey => prevKey + 1);
      }
    }
  }, [route?.params?.initialTab]);

  const renderScene = useCallback(
    ({route}) => {
      switch (route.key) {
        case 'first':
          return <ActiveOrders key={`${route.key}-${key}`} />;
        case 'second':
          return <CompletedOrders key={`${route.key}-${key}`} />;
        case 'third':
          return <CancelledOrders key={`${route.key}-${key}`} />;
        default:
          return null;
      }
    },
    [key],
  );

  const handleIndexChange = newIndex => {
    setIndex(newIndex);
    setKey(prevKey => prevKey + 1);
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: COLORS.primary}}
      style={{backgroundColor: COLORS.white}}
      renderLabel={({route, focused}) => (
        <Text
          style={{
            color: focused ? COLORS.primary : 'gray',
            fontSize: 16,
            fontFamily: 'Urbanist SemiBold',
          }}>
          {route.title}
        </Text>
      )}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Back button icon if needed */}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: COLORS.greyscale900}]}>
          My Orders
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.area}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        {renderHeader()}
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={handleIndexChange}
          initialLayout={{width: layout.width}}
          renderTabBar={renderTabBar}
        />
      </View>
      <Toasts />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.tertiaryWhite,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: 'row',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
    marginLeft: 16,
  },
});

export default Orders;
