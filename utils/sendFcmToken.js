import {useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import authStorage from '../auth/storage';
export const sendFcmToken = () => {
  useEffect(() => {
    const sendDeviceInfoToBackend = async () => {
      const deviceId = await DeviceInfo.getUniqueId();
      let fcmToken = null;

      try {
        fcmToken = await messaging().getToken();
      } catch (error) {
        console.error('Error retrieving FCM token:', error);
      }

      if (fcmToken) {
        const payload = {
          name: 'test',
          description: 'test',
          deviceId: deviceId,
          fcmKey: fcmToken,
        };

        console.log('Pauload is ====>', payload);
        try {
          const Token = await authStorage.getToken();
          const response = await fetch(
            'https://server.saugeendrives.com:9001/api/v1.0/Customer/register-device',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: Token,
              },
              body: JSON.stringify(payload),
            },
          );
          console.log(response.status);
          const responseData = await response.json();
          console.log('The Response from the server', responseData);
          if (response.ok) {
            console.log('Device information sent to backend successfully.');
          } else {
            console.error(
              'Failed to send device information to backend:',
              response.statusText,
            );
          }
        } catch (error) {
          console.error('Error sending device information to backend:', error);
        }
      } else {
        console.error('FCM token is null.');
      }
    };

    sendDeviceInfoToBackend();
  }, []);
};
