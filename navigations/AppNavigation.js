import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  AddNewAddress,
  AddNewCard,
  AddPromo,
  Address,
  Call,
  CancelOrder,
  CancelOrderPaymentMethods,
  Categories,
  CategoryBread,
  CategoryHamburger,
  CategoryMeat,
  CategoryPizza,
  ChangeEmail,
  ChangePIN,
  ChangePassword,
  Chat,
  CheckoutOrdersAddress,
  CheckoutOrdersCompleted,
  CreateNewPIN,
  CreateNewPassword,
  CustomerService,
  DiscountFoods,
  DriverDetails,
  EReceipt,
  EditProfile,
  EnterYourPIN,
  Favourite,
  FillYourProfile,
  Fingerprint,
  FoodDetails,
  FoodDetailsAbout,
  FoodDetailsAddItem,
  FoodDetailsOffers,
  FoodReviews,
  ForgotPasswordEmail,
  ForgotPasswordMethods,
  ForgotPasswordPhoneNumber,
  GiveTipForDriver,
  HelpCenter,
  InviteFriends,
  Login,
  MyCart,
  Notifications,
  OTPVerification,
  Onboarding1,
  Onboarding2,
  Onboarding3,
  Onboarding4,
  PaymentMethods,
  RateTheDriver,
  RateTheRestaurant,
  RecommendedFoods,
  Search,
  SearchingDriver,
  SettingsLanguage,
  SettingsNotifications,
  SettingsPayment,
  SettingsPrivacyPolicy,
  SettingsSecurity,
  Signup,
  TopupEwalletAmount,
  TopupEwalletMethods,
  TrackDriver,
  TransactionHistory,
  VideoCall,
  VoiceCall,
  Welcome,
  WhatsYourMood,
} from '../screens';
import BottomTabNavigation from './BottomTabNavigation';
import ProcessingScreen from '../screens/ProcessingScreen';
import Launching1 from '../screens/Launching1';
import Launching2 from '../screens/Launching2';
import MainHome from '../screens/MainHome';
import NearByResturants from '../screens/NearByResturants';
import CategoryItem from '../screens/CategoryItem';
import Home from '../screens/Home';
import PaymentWebView from '../screens/PaymentWebView';
import PendingOrder from '../screens/PendingOrder';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import GlobalToast from '../components/GlobalToast';
import {View} from 'react-native-reanimated/lib/typescript/Animated';
import TermsOfServices from '../screens/TermsOfServices';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Alert} from 'react-native';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import notifee, {EventType} from '@notifee/react-native';
import {COLORS, SIZES, icons, images} from '../constants';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import OrderRating from '../screens/OrderRating';
import WebViewPage from '../screens/WebViewPage';
import ChangePasswordEmail from '../screens/ChangePasswordEmail';
import ResetOTPVerification from '../screens/ResetOTPVerification';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'Login'}>
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Onboarding3" component={Onboarding3} />
        <Stack.Screen name="Onboarding4" component={Onboarding4} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Launching1" component={Launching1} />
        <Stack.Screen name="Launching2" component={Launching2} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="FillYourProfile" component={FillYourProfile} />
        <Stack.Screen
          name="ForgotPasswordEmail"
          component={ForgotPasswordEmail}
        />
        <Stack.Screen
          name="ResetOTPVerification"
          component={ResetOTPVerification}
        />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const LoginNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

const HomeNavigation = () => {
  const navigationRef = React.useRef();
  // At the top of your component, outside of any function:
  let lastNotificationData = null;

  const navigateToOrders = data => {
    if (navigationRef.current) {
      if (data?.Status === 'Delivered') {
        navigationRef.current.navigate('RateTheDriver', {
          item: {number: data?.OrderNumber},
        });
      } else {
        navigationRef.current.navigate('Main', {initialRouteName: 'Orders'});
      }
    }
  };

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    // For background notifications:
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
        navigateToOrders(remoteMessage?.data);
      },
    );

    // For when app was closed:
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          navigateToOrders(remoteMessage?.data);
        }
      });

    // Handle foreground messages
    const unsubscribeForegroundMessage = messaging().onMessage(
      async remoteMessage => {
        if (remoteMessage) {
          console.log('Foreground message received:', remoteMessage);

          // Store the notification data
          lastNotificationData = remoteMessage.data;

          // Display the notification
          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
              channelId: 'default',
              smallIcon: 'ic_launcher',
              pressAction: {
                id: 'default',
              },
              // Add this to pass the data to the press event
              data: remoteMessage.data,
            },
          });

          // You can keep your existing toast notification if you want
          toast.success(remoteMessage.notification.title, {
            duration: 5000,
            position: ToastPosition.TOP,
            styles: {
              view: {
                backgroundColor: COLORS.primary,
                borderRadius: 5,
              },
              text: {
                color: 'white',
                fontWeight: '600',
              },
              indicator: {
                backgroundColor: 'white',
              },
            },
          });
        }
      },
    );

    // Modify the notifee event listener:
    const unsubscribeNotifee = notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          const notificationData =
            detail.notification.android.data || lastNotificationData || {};
          console.log(
            'User pressed notification data is ==>',
            notificationData,
          );
          navigateToOrders(notificationData);
          break;
      }
    });

    return () => {
      unsubscribeOpenedApp();
      unsubscribeForegroundMessage();
      unsubscribeNotifee();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="MainHome">
            <Stack.Screen name="MainHome" component={MainHome} />
            <Stack.Screen name="Home" component={BottomTabNavigation} />
            <Stack.Screen name="CategoryItem" component={CategoryItem} />
            <Stack.Screen
              name="ForgotPasswordMethods"
              component={ForgotPasswordMethods}
            />
            <Stack.Screen
              name="ChangePasswordEmail"
              component={ChangePasswordEmail}
            />
            <Stack.Screen
              name="ForgotPasswordEmail"
              component={ForgotPasswordEmail}
            />
            <Stack.Screen
              name="ForgotPasswordPhoneNumber"
              component={ForgotPasswordPhoneNumber}
            />
            <Stack.Screen
              name="ResetOTPVerification"
              component={ResetOTPVerification}
            />
            <Stack.Screen name="OTPVerification" component={OTPVerification} />
            <Stack.Screen
              name="CreateNewPassword"
              component={CreateNewPassword}
            />
            <Stack.Screen name="FillYourProfile" component={FillYourProfile} />
            <Stack.Screen name="PaymentWebView" component={PaymentWebView} />
            <Stack.Screen name="CreateNewPIN" component={CreateNewPIN} />
            <Stack.Screen name="Fingerprint" component={Fingerprint} />
            <Stack.Screen name="Main" component={BottomTabNavigation} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen
              name="SettingsNotifications"
              component={SettingsNotifications}
            />
            <Stack.Screen name="SettingsPayment" component={SettingsPayment} />
            <Stack.Screen name="AddNewCard" component={AddNewCard} />
            <Stack.Screen
              name="SettingsSecurity"
              component={SettingsSecurity}
            />
            <Stack.Screen name="ChangePIN" component={ChangePIN} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
            <Stack.Screen
              name="SettingsLanguage"
              component={SettingsLanguage}
            />
            {/* <Stack.Screen
              name="ChangePasswordEmail"
              component={ChangePasswordEmail}
            /> */}

            <Stack.Screen
              name="SettingsPrivacyPolicy"
              component={SettingsPrivacyPolicy}
            />
            <Stack.Screen name="TermsOfServices" component={TermsOfServices} />

            <Stack.Screen name="InviteFriends" component={InviteFriends} />
            <Stack.Screen name="HelpCenter" component={HelpCenter} />
            <Stack.Screen
              name="NearByResturants"
              component={NearByResturants}
            />
            <Stack.Screen name="CustomerService" component={CustomerService} />
            <Stack.Screen name="EReceipt" component={EReceipt} />
            <Stack.Screen name="Call" component={Call} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
            <Stack.Screen name="CancelOrder" component={CancelOrder} />
            <Stack.Screen
              name="CancelOrderPaymentMethods"
              component={CancelOrderPaymentMethods}
            />
            <Stack.Screen name="EnterYourPIN" component={EnterYourPIN} />
            <Stack.Screen
              name="TransactionHistory"
              component={TransactionHistory}
            />
            <Stack.Screen
              name="TopupEwalletAmount"
              component={TopupEwalletAmount}
            />
            <Stack.Screen
              name="TopupEwalletMethods"
              component={TopupEwalletMethods}
            />
            <Stack.Screen name="AddPromo" component={AddPromo} />
            <Stack.Screen name="Address" component={Address} />
            <Stack.Screen name="AddNewAddress" component={AddNewAddress} />
            <Stack.Screen name="Categories" component={Categories} />
            <Stack.Screen name="DiscountFoods" component={DiscountFoods} />
            <Stack.Screen
              name="RecommendedFoods"
              component={RecommendedFoods}
            />
            <Stack.Screen name="CategoryPizza" component={CategoryPizza} />
            <Stack.Screen name="CategoryBread" component={CategoryBread} />
            <Stack.Screen
              name="CategoryHamburger"
              component={CategoryHamburger}
            />
            <Stack.Screen name="CategoryMeat" component={CategoryMeat} />
            <Stack.Screen name="Favourite" component={Favourite} />
            <Stack.Screen name="FoodDetails" component={FoodDetails} />
            <Stack.Screen name="FoodReviews" component={FoodReviews} />
            <Stack.Screen name="OrderRating" component={OrderRating} />

            <Stack.Screen
              name="FoodDetailsAbout"
              component={FoodDetailsAbout}
            />
            <Stack.Screen
              name="FoodDetailsOffers"
              component={FoodDetailsOffers}
            />
            <Stack.Screen
              name="FoodDetailsAddItem"
              component={FoodDetailsAddItem}
            />
            <Stack.Screen
              name="CheckoutOrdersAddress"
              component={CheckoutOrdersAddress}
            />
            <Stack.Screen name="SearchingDriver" component={SearchingDriver} />
            <Stack.Screen
              name="CheckoutOrdersCompleted"
              component={CheckoutOrdersCompleted}
            />
            <Stack.Screen name="TrackDriver" component={TrackDriver} />
            <Stack.Screen name="DriverDetails" component={DriverDetails} />
            <Stack.Screen name="VoiceCall" component={VoiceCall} />
            <Stack.Screen name="VideoCall" component={VideoCall} />
            <Stack.Screen name="WhatsYourMood" component={WhatsYourMood} />
            <Stack.Screen name="RateTheDriver" component={RateTheDriver} />
            <Stack.Screen name="WebViewPage" component={WebViewPage} />
            <Stack.Screen
              name="GiveTipForDriver"
              component={GiveTipForDriver}
            />
            <Stack.Screen
              name="RateTheRestaurant"
              component={RateTheRestaurant}
            />
            <Stack.Screen name="MyCart" component={MyCart} />
            <Stack.Screen
              name="ProcessingScreen"
              component={ProcessingScreen}
            />
            <Stack.Screen name="PendingOrder" component={PendingOrder} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
      <Toasts />
    </SafeAreaProvider>
  );
};

export {HomeNavigation, AppNavigation, LoginNavigation};
