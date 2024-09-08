import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {COLORS} from '../constants';
import {OtpInput} from 'react-native-otp-entry';
import Button from '../components/Button';
import auth from '../api/auth';
import {useRoute} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ErrorModal from '../components/ErrorModal';

const OTPVerification = ({navigation}) => {
  const route = useRoute(); // Get the route object
  // const { username, tokenStamp } = route.params;
  const username = route?.params?.username || null;
  const tokenStamp = route?.params.tokenStamp || null;
  const password = route?.params?.password || null;
  // console.log('Username:', username); // Log the username
  // console.log('Token Stamp:', tokenStamp);
  const [time, setTime] = useState(59);
  const [confirmationFailed, setConfirmationFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Otp, setOtp] = useState('');
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOTPConfirmation = async () => {
    if (Otp.length !== 6) return;

    try {
      setIsLoading(true);
      setConfirmationFailed(false);
      const data = {
        username: username,
        tokenStamp: tokenStamp,
        otp: Otp.toString(),
        request: 'OTPConfirmation', // Add this line
      };
      console.log('Sending OTP confirmation data:', data);
      const response = await auth.confirmOTP(data);
      setIsLoading(false);
      console.log('Confirm OTP Response:', JSON.stringify(response));
      if (response.ok) {
        navigation.navigate('FillYourProfile', {
          tokenStamp: response.data.tokenStamp,
          username: username,
        });
      } else {
        setConfirmationFailed(true);
        setErrorMessage(response.data.message || 'OTP confirmation failed');
        setModalVisible(true);
      }
    } catch (error) {
      console.log('Error in OTP Confirmation', error);
      setIsLoading(false);
      setConfirmationFailed(true);
      setErrorMessage('An error occurred during OTP confirmation');
      setModalVisible(true);
    }
  };

  const resendCode = async () => {
    try {
      setIsLoading(true);
      // Call the emailRegister function again
      let result = await auth.emailRegister({username});
      setIsLoading(false);
      if (result.ok) {
        setTime(59); // Reset the timer
        Alert.alert('Success', 'OTP has been resent to your email.');
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.log('Error in resending OTP', error);
      setIsLoading(false);
      Alert.alert('Error', 'An error occurred while resending OTP.');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <Header title="OTP Verification" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>
            OTP has been sent to your Email Address
          </Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={text => {
              setOtp(text);
              setIsOtpComplete(text.length === 6);
            }}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            theme={{
              pinCodeContainerStyle: styles.OTPStyle,
              pinCodeTextStyle: {
                color: COLORS.black,
                fontSize: wp('5%'),
              },
            }}
          />
          {/* <View style={styles.codeContainer}>
            <Text style={styles.code}>Resend code in</Text>
            <Text style={styles.time}>{`  ${time}  `}</Text>
            <Text style={styles.code}>s</Text>
            {time === 0 && (
              <TouchableOpacity onPress={resendCode} disabled={isLoading}>
                <Text style={styles.resendText}>Send again</Text>
              </TouchableOpacity>
            )}
          </View> */}
        </ScrollView>
        <Button
          title="Verify"
          filled
          //  disabled={!isOtpComplete || time === 0 || isLoading}
          disabled={!isOtpComplete || isLoading}
          style={styles.button}
          onPress={handleOTPConfirmation} // Remove the parameter here
          isLoading={isLoading}
        />

        <ErrorModal
          visible={modalVisible}
          message={errorMessage}
          onClose={() => setModalVisible(false)}
        />
      </View>
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
    padding: wp('4%'),
    backgroundColor: COLORS.white,
  },
  resendText: {
    fontFamily: 'Urbanist Medium',
    fontSize: wp('4.5%'),
    color: COLORS.primary,
    marginLeft: wp('2%'),
    fontWeight: 'bold',
  },

  scrollContent: {
    flexGrow: 1,
    //  justifyContent: 'center',
    paddingVertical: hp('4%'),
  },
  title: {
    fontSize: wp('4.5%'),
    fontFamily: 'Urbanist Medium',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginVertical: hp('6%'),
  },
  OTPStyle: {
    backgroundColor: COLORS.secondaryWhite,
    borderColor: 'gray',
    borderRadius: wp('2%'),
    height: wp('14%'),
    width: wp('14%'),
    borderBottomWidth: 0.4,
    borderWidth: 0.4,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('3%'),
    justifyContent: 'center',
  },
  code: {
    fontSize: wp('4.5%'),
    fontFamily: 'Urbanist Medium',
    color: COLORS.greyscale900,
    textAlign: 'center',
  },
  time: {
    fontFamily: 'Urbanist Medium',
    fontSize: wp('4.5%'),
    color: COLORS.primary,
  },
  button: {
    borderRadius: wp('8%'),
    marginBottom: hp('2%'),
  },
});

export default OTPVerification;
