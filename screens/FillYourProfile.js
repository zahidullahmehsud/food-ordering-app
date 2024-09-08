import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {COLORS, SIZES, icons, images} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {validateInput} from '../utils/actions/formActions';
import Input from '../components/Input';
// import {getFormatedDate} from 'react-native-modern-datepicker';
import DatePickerModal from '../components/DatePickerModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../components/Button';
import auth from '../api/auth';
import ErrorMessage from '../components/ErrorMessage';
import FormField from '../components/FormField';
import * as Yup from 'yup';
import Form from '../components/Form';
import SubmitButton from '../components/SubmitButton';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import ErrorModal from '../components/ErrorModal';
import FormPicker from '../components/FormPicker';
import SuccessModal from '../components/SuccessModal';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
});

const isTestMode = true;

// const initialState = {
//   inputValues: {
//     fullName: isTestMode ? 'John Doe' : '',
//     email: isTestMode ? 'example@gmail.com' : '',
//     nickname: isTestMode ? "" : "",
//     phoneNumber: ''
//   },
//   inputValidities: {
//     fullName: false,
//     email: false,
//     nickname: false,
//     phoneNumber: false,
//   },
//   formIsValid: false,
// }

const FillYourProfile = ({navigation}) => {
  const route = useRoute();
  const {tokenStamp} = route.params;
  const {username} = route.params;
  console.log('TokenStamp : ', tokenStamp);
  console.log('User Email From OTP Screen : ', username);

  const [image, setImage] = useState(null);
  const [error, setError] = useState();
  //const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  //handle date change new
  const [dob, setDob] = useState(new Date(), 'YYYY/MM/DD');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmit = async values => {
    setLoading(true);
    setLoginFailed(false);
    const formattedDob = moment(values.dob).format('YYYY-MM-DD');
    try {
      let result = await auth.registerUser({
        ...values,
        dob: formattedDob,
        tokenStamp: route.params.tokenStamp,
        username: route.params.username,
        type: 'Customer', // Ensure the default type is sent
      });
      console.log('result', result);
      setLoading(false);
      if (result.completed) {
        setSuccessMessage(result.message || 'Registration successful!');
        setSuccessModalVisible(true);
      } else {
        let errorMessage = '';
        if (result.errors) {
          Object.keys(result.errors).forEach(key => {
            if (key !== '$.type') {
              result.errors[key].forEach(error => {
                errorMessage += `${error}\n`;
              });
            }
          });
          if (!errorMessage) {
            errorMessage = 'Token Stamp is expired';
          }
        } else if (result.title) {
          errorMessage = result.title;
        } else {
          errorMessage = 'Token Stamp is expired.';
          console.log('error', errorMessage);
        }
        setErrorMessage(errorMessage.trim());
        setModalVisible(true);
        setLoginFailed(true);
      }
    } catch (error) {
      console.error('Error in handle submit', error);
      setErrorMessage(error.message);
      setModalVisible(true);
      setLoginFailed(true);
    } finally {
      setLoading(false);
    }
  };
  // const today = new Date();
  // const startDate = getFormatedDate(
  //   new Date(today.setDate(today.getDate() + 1)),
  //   'YYYY/MM/DD',
  // );

  // const [startedDate, setStartedDate] = useState('12/12/2023');

  // const handleOnPressStartDate = () => {
  //   setOpenStartDatePicker(!openStartDatePicker);
  // };

  // const inputChangedHandler = useCallback(
  //   (inputId, inputValue) => {
  //     const result = validateInput(inputId, inputValue)
  //     dispatchFormState({ inputId, validationResult: result, inputValue })
  //   },
  //   [dispatchFormState]
  // )

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error);
    }
  }, [error]);

  //
  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header title="Fill Your Profile" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center', marginVertical: 12}}>
            <View style={styles.avatarContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={images.logo}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </View>
            </View>
          </View>
          <View>
            <Form
              initialValues={{
                firstname: '',
                lastname: '',
                password: '',
                confirmPassword: '',
                type: 'Customer',
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}>
              <ErrorMessage visible={loginFailed} />

              {/* <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                name="username"
                placeholder="Enter Email"
                textContentType="emailAddress"
                maxLength={100}m
                style={{width: '100%'}}
                color={'black'}
              /> */}

              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="account-check"
                name="firstname"
                placeholder="First Name"
                textContentType="emailAddress"
                maxLength={30}
                style={{width: '100%'}}
                color={'black'}
              />
              <ErrorMessage
                name="firstname"
                component={Text}
                style={styles.errorText}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="camera-account"
                name="lastname"
                placeholder="Last Name"
                textContentType="emailAddress"
                maxLength={30}
                style={{width: '100%'}}
                color={'black'}
              />
              <ErrorMessage
                name="lastname"
                component={Text}
                style={styles.errorText}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                // keyboardType="email-address"
                name="password"
                placeholder="Enter Password"
                secureTextEntry
                textContentType="password"
                maxLength={200}
                style={{width: '100%'}}
                color={'black'}

                // autoCapitalize="none"
                // autoCorrect={false}
                // icon="lock"
                // name="confirmPassword"
                // placeholder="Confirm Your Password"
                // secureTextEntry
                // textContentType="password"
                // maxLength={200}
                // style={{width: '100%'}}
                // color={'black'}
              />
              <ErrorMessage
                name="password"
                component={Text}
                style={styles.errorText}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="confirmPassword"
                placeholder="Confirm Your Password"
                secureTextEntry
                textContentType="password"
                maxLength={200}
                style={{width: '100%'}}
                color={'black'}
              />
              <ErrorMessage
                name="confirmPassword"
                component={Text}
                style={styles.errorText}
              />
              <Text style={{fontSize: 12}}>Enter DOB</Text>

              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="calendar"
                name="dob"
                placeholder="Date of Birth YYYY-MM-DD"
                textContentType="none"
                maxLength={20}
                style={{width: '100%'}}
                color={'black'}
                value={moment(dob).format('YYYY-MM-DD')}
                onPressIn={showDatepicker}
              />
              {showDatePicker && (
                <DateTimePicker
                  testID="dobPicker"
                  value={dob}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={handleDateChange}
                />
              )}

              {/* <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="shield-check"
                name="type"
                placeholder="Enter 'Customer' or 'Driver'"
                textContentType="none"
                maxLength={100}
                style={{width: '100%'}}
                color={'black'}
              />
              */}

              <SubmitButton
                title="Sign Up"
                buttonStyle={styles.continueButton}
                filled
                width={300}
                textColor="white"
                isLoading={loading}
              />
            </Form>
          </View>
        </ScrollView>

        <ErrorModal
          visible={modalVisible}
          message={errorMessage}
          onClose={() => setModalVisible(false)}
        />

        <SuccessModal
          visible={successModalVisible}
          message={successMessage}
          onClose={() => {
            setSuccessModalVisible(false);
            navigation.navigate('Login');
          }}
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
    padding: 16,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    marginVertical: 2,
    alignItems: 'center',
    width: 100,
    height: 80,
    borderRadius: 65,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 65,
  },
  pickImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 12,
    height: 52,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: COLORS.greyscale500,
  },
  downIcon: {
    width: 10,
    height: 10,
    tintColor: '#111',
  },
  selectFlagContainer: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: 'row',
  },
  flagIcon: {
    width: 30,
    height: 30,
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,
    color: '#111',
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 52,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: 'space-between',
    marginTop: 4,
    backgroundColor: COLORS.greyscale500,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SIZES.width - 32,
    alignItems: 'center',
  },
  continueButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    position: 'absolute',
    right: 16,
    top: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logo: {
    width: 80,
    height: 80,
    tintColor: COLORS.primary,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default FillYourProfile;
