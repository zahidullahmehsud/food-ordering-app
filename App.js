import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigation, HomeNavigation} from './navigations/AppNavigation';
import {LogBox} from 'react-native';
import {useEffect, useState} from 'react';
import AuthContext from './auth/context';
import BottomTabNavigation from './navigations/BottomTabNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {Login} from './screens';
import authStorage from './auth/storage';
import GlobalToast from './components/GlobalToast';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import notifee from '@notifee/react-native';
// import {generateAccessToken, sendNotification} from './utils/firebaseServices';

//Ignore all log notifications
LogBox.ignoreAllLogs();

export default function App() {
  const [user, setUser] = useState();

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (!user) return;
    setUser(user);
  };

  const getFCMToken = async () => {
    const fcm = await messaging().getToken();
    console.log('FCM token is : ', fcm);
    // const accessToken = await generateAccessToken();
    // await sendNotification(fcm, accessToken);
  };
  const deviceID = async () => {
    const deviceId = await DeviceInfo.getUniqueId();
    console.log('device ID: ', deviceId);
  };

  async function createNotificationChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
  }

  useEffect(() => {
    restoreUser();
    getFCMToken();
    deviceID();
    // Call this function when your app starts
    createNotificationChannel();
  }, []);

  return (
    <AuthContext.Provider value={{user, setUser}}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          {/* <NavigationContainer> */}
          {user ? <HomeNavigation /> : <AppNavigation />}
          {/* <GlobalToast /> */}
          {/* </NavigationContainer> */}
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}
