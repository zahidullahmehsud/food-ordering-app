import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'base-64';

const key = 'authToken';
const userKey = 'setUser'
//Store the token in storage
const storeToken = async authToken => {
  try {
    if (authToken) {
      await AsyncStorage.setItem(key, authToken);
      console.log('Token stored successfully:', authToken);
    } else {
      console.warn('Trying to store undefined or null token');
    }
  } catch (error) {
    console.error('Error storing token', error);
  }
};

//Get Token Function
const getToken = async () => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log('Error getting auth token');
  }
};



//Store User
// Store User
const storeUser = async (storeUser) => {
  try {
    await AsyncStorage.setItem(userKey, JSON.stringify(storeUser));
    console.log('User Stored successfully:', storeUser);
  } catch (error) {
    console.error('Error storing the user', error);
  }
};




//Get User
const getUser = async () => {
  try {
    const storeUser = await AsyncStorage.getItem(userKey);
    if (storeUser) {
      const parsedUser = JSON.parse(storeUser);
      console.log('User retrieved successfully:', parsedUser);
      return parsedUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting the user', error);
    return null;
  }
};

const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(userKey);
  } catch (error) {
    console.log('Error removing auth token');
  }
};




//Getting User and decode the token
// const getUser = async () => {
//   try {
//     const token = await getToken();
//     //console.log('Token Generated Successfully', token);

//     if (token) {
//       try {
//         // Use base-64 to decode the middle part of the JWT (the payload)
//         const decodedPayload = decode(token.split('.')[1]);

//         // Log the decoded payload for debugging purposes
//         console.log('Decoded Payload:', decodedPayload);

//         // Attempt to parse the decoded payload as JSON
//         const decoded = JSON.stringify(decodedPayload);
//         console.log('@@ decode', decoded);
//         return decoded;
//       } catch (decodeError) {
//         console.error('Error decoding token payload:', decodeError);
//         return null;
//       }
//     } else {
//       console.log('Token is undefined or null');
//       return null;
//     }
//   } catch (getTokenError) {
//     console.error('getUser Error', getTokenError);
//   }
// };

//Remove Token from the asyncStorage
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error removing auth token');
  }
};

export default {
    storeToken,
    getToken,
    removeToken,
    // getUser,
    storeUser,
    getUser,
removeUser
  };