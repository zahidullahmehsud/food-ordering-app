import {Alert} from 'react-native';
import storage from '../auth/storage';
import apiClient from './client';

//Login Api Call
const login = async (username, password) => {
  try {
    const response = await apiClient.post('/api/v1.0/Accounts/auth', {
      username,
      password,
    });
    console.log('Api Response auth.js: ', response);
    if (response.data && response.data.token && response.data.token.token) {
      const authToken = response.data.token.token;
      console.log('Received Auth Token auth.js:', authToken);
      //Store the given token
      storage.storeToken(authToken);
      return response;
    } else {
      return response;
    }
  } catch (error) {
    console.error('Login Error Auth : ', error);
  }
};

//Email Register Call SignUp
const emailRegister = async data => {
  try {
    const response = await apiClient.post(
      'api/v1.0/registration-request',
      data,
    );
    console.warn('Email Verification Response : ', response.data);
    return {
      ok: response.status >= 200 && response.status < 300,
      data: response.data,
    };
  } catch (error) {
    console.log('Error In Signup Api', error);
    return {
      ok: false,
      data: error.response ? error.response.data : {message: error.message},
    };
  }
};

const resetPassword = async email => {
  try {
    console.log('User email is ---->', email);
    const response = await apiClient.post('api/v1.0/Accounts/password-reset', {
      username: email,
    });
    // console.warn('Email Verfication Response : ', response.data)
    return response;
  } catch (error) {
    console.log('Error In Signup Api', error);
  }
};
const createNewPassword = async body => {
  try {
    // console.log("User email is ---->",email)
    const response = await apiClient.post(
      'api/v1.0/Accounts/confirm-password-reset',
      body,
    );
    // console.warn('Email Verfication Response : ', response.data)
    return response;
  } catch (error) {
    console.log('Error In Signup Api', error);
  }
};

//Confirm OTP
const confirmOTP = async data => {
  try {
    const response = await apiClient.post(
      '/api/v1.0/registration-request/confirm-otp',
      data,
    );
    console.log('Confirm OTP Response: ', response.data);
    return response;
  } catch (error) {
    console.log('Error in Confirm OTP API', error);
    throw error;
  }
};

//Register The User Main...
const registerUser = async userData => {
  try {
    const response = await apiClient.post('/api/v1.0/registration', userData);
    console.log('UserRegistration API: ', response.data);
    return response.data;
  } catch (error) {
    console.log('Error in Register User API', error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

//Forget Passowrd Api For Checking Email Exist
const checkEmailExists = async data => {
  try {
    const response = await apiClient.post(
      'api/v1.0/registration-request',
      data,
    );
    console.warn('Email Verfication Response : ', response.data);
    return response;
  } catch (error) {
    console.log('Error In Signup Api', error);
  }
};

const resetOTPVerification = async data => {
  try {
    const response = await apiClient.post(
      '/api/v1.0/accounts/confirm-password-reset',
      data,
    );
    console.warn('OTP Verfication Response : ', response.data);
    return response;
  } catch (error) {
    console.log('Error In OTP Api', error);
  }
};

export default {
  login,
  emailRegister,
  confirmOTP,
  registerUser,
  checkEmailExists,
  resetPassword,
  createNewPassword,
  resetOTPVerification,
};
