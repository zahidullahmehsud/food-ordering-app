import {JWT} from 'google-auth-library';
import serviceAccount from '../googleService.json';

const client = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
});

const getAccessToken = async () => {
  const tokens = await client.authorize();
  return tokens.access_token;
};
const sendNotification = async (fcmToken, accessToken) => {
  const message = {
    to: fcmToken,
    notification: {
      title: 'Test Notification',
      body: 'This is a test notification',
    },
  };

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/messaging-app-36a10/messages:send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({message}),
    },
  );

  const data = await response.json();
  console.log('Notification response:', data);
};
export {getAccessToken, sendNotification};
