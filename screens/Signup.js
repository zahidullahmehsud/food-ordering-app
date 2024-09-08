import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, icons, images} from '../constants';
import Header from '../components/Header';
import {reducer} from '../utils/reducers/formReducers';
import {validateInput} from '../utils/actions/formActions';
import Input from '../components/Input';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import OrSeparator from '../components/OrSeparator';
import Form from '../components/Form';
import ErrorMessage from '../components/ErrorMessage';
import FormField from '../components/FormField';
import SubmitButton from '../components/SubmitButton';
import auth from '../api/auth';
import ErrorModal from '../components/ErrorModal';

// const isTestMode = true;

// const initialState = {
//   inputValues: {
//     email: isTestMode ? 'example@gmail.com' : '',
//     password: isTestMode ? '**********' : '',
//   },
//   inputValidities: {
//     email: false,
//     password: false
//   },
//   formIsValid: false,
// }

const validationSchema = Yup.object().shape({
  username: Yup.string().required().label('Email'),
});

const Signup = ({navigation}) => {
  //const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // const inputChangedHandler = useCallback(
  //   (inputId, inputValue) => {
  //     const result = validateInput(inputId, inputValue)
  //     dispatchFormState({ inputId, validationResult: result, inputValue })
  //   },
  //   [dispatchFormState]
  // )

  const handleSubmit = async ({username}) => {
    try {
      setIsLoading(true);
      setLoginFailed(false);
      //Call the Email Register Function
      let result = await auth.emailRegister({username});
      console.log(result);
      setIsLoading(false);
      if (!result.ok) {
        let errorMsg = 'An error occurred. Please try again.';
        if (result.data && result.data.errors) {
          // Extract the first error message
          const firstErrorKey = Object.keys(result.data.errors)[0];
          errorMsg = result.data.errors[firstErrorKey][0];
        } else if (result.data && result.data.message) {
          errorMsg = result.data.message;
        }
        setErrorMessage(errorMsg);
        setModalVisible(true);
        setLoginFailed(true);
        console.log('Email Verification Failed');
      } else {
        console.log('Verification Successful');
        navigation.navigate('OTPVerification', {
          username: username,
          tokenStamp: result.data.tokenStamp,
        });
      }
    } catch (error) {
      console.log('Error in Signup Api', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setModalVisible(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error);
    }
  }, [error]);

  // implementing apple authentication
  const appleAuthHandler = () => {
    console.log('Apple Authentication');
  };

  // implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log('Facebook Authentication');
  };

  // Implementing google authentication
  const googleAuthHandler = () => {
    console.log('Google Authentication');
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.select({android: -350})}
      behavior={'padding'}>
      <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
        <View style={[styles.container, {backgroundColor: COLORS.white}]}>
          <Header />
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled">
            <View style={styles.logoContainer}>
              <Image
                source={images.logo}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>
            <Text
              style={[
                styles.title,
                {
                  color: COLORS.black,
                },
              ]}>
              Create Your Account
            </Text>
            <Form
              initialValues={{
                username: '',
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}>
              <ErrorMessage visible={loginFailed} />

              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                name="username"
                placeholder="Register Email"
                textContentType="emailAddress"
                maxLength={100}
                style={{width: '100%'}}
                color={'black'}
              />

              {/* <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          /> */}
              {/* <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: 'row' }}>
              <CheckBox
                style={styles.checkbox}
                value={isChecked}
                boxType="square"
                onTintColor={isChecked ? COLORS.primary :  "gray"}
                onFillColor={isChecked ? COLORS.primary :  "gray"}
                onCheckColor={COLORS.white}
                onValueChange={setChecked}
                tintColors={{ true: COLORS.primary, false: "gray" }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.privacy, {
                  color: COLORS.black
                }]}>By continuing you accept our Privacy Policy</Text>
              </View>
            </View>
          </View> */}
              <SubmitButton
                title="Sign Up"
                buttonStyle={styles.button}
                textColor="white"
                filled
                isLoading={isLoading}
                disabled={isLoading}
              />
            </Form>
            <View>
              {/* <OrSeparator text="or continue with" />
            <View style={styles.socialBtnContainer}>
              <SocialButton
                icon={icons.appleLogo}
                tintColor={COLORS.black}
              />
              <SocialButton
                icon={icons.facebook}
                onPress={facebookAuthHandler}
              />
              <SocialButton
                icon={icons.google}
                onPress={googleAuthHandler}
              />
            </View> */}
            </View>
            <View style={styles.bottomContainer}>
              <Text
                style={[
                  styles.bottomLeft,
                  {
                    color: COLORS.black,
                  },
                ]}>
                Already have an account ?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.bottomRight}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <ErrorModal
            visible={modalVisible}
            message={errorMessage}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.primary,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.black,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 22,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  checkbox: {
    marginRight: Platform.OS == 'ios' ? 8 : 14,
    marginLeft: 4,
    height: 16,
    width: 16,
    borderColor: COLORS.primary,
  },
  privacy: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.black,
  },
  socialTitle: {
    fontSize: 19.25,
    fontFamily: 'Urbanist Medium',
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: 26,
  },
  socialBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 23,
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: 'Urbanist Regular',
    color: 'black',
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: 'Urbanist Medium',
    color: COLORS.primary,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },
});

export default Signup;
