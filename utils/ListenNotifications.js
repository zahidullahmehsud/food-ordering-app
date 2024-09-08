import {useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

const useFCMNotifications = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {});

    messaging().onNotificationOpenedApp(remoteMessage => {
      navigation.navigate('EReceipt');
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          navigation.navigate('EReceipt');
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);
};

export default useFCMNotifications;
