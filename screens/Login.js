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
import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, icons, images} from '../constants';
import Header from '../components/Header';
import {reducer} from '../utils/reducers/formReducers';
import {validateInput} from '../utils/actions/formActions';
import Input from '../components/Input';
import CheckBox from '@react-native-community/checkbox';
import SubmitButton from '../components/SubmitButton';
import SocialButton from '../components/SocialButton';
import OrSeparator from '../components/OrSeparator';
import * as Yup from 'yup';
import Form from '../components/Form';
import auth from '../api/auth';
import ErrorMessage from '../components/ErrorMessage';
import FormField from '../components/FormField';
import AuthContext from '../auth/context';
import {decode} from 'base-64';
import authStorage from '../auth/storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// const isTestMode = true;

// const initialState = {
//   inputValues: {
//     email: isTestMode ? 'example@gmail.com' : '',
//     password: isTestMode ? '' : '',
//   },
//   inputValidities: {
//     email: false,
//     password: false,
//   },
//   formIsValid: false,
// };

const validationSchema = Yup.object().shape({
  username: Yup.string().required().label('username'),
  password: Yup.string().required().min(6).label('Password'),
});

const Login = ({navigation}) => {
  //Use Context For Saving Token user
  const authContext = useContext(AuthContext);
  //const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const inputChangedHandler = useCallback(
  //   (inputId, inputValue) => {
  //     const result = validateInput(inputId, inputValue);
  //     dispatchFormState({inputId, validationResult: result, inputValue});
  //   },
  //   [dispatchFormState],
  // );

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '937151334706-v93i3e24u1o7ngm3cng1f1mq9irtkmd8.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const handleSubmit = async ({username, password}) => {
    setIsLoading(true);
    const result = await auth.login(username, password);
    setIsLoading(false);
    if (!result.ok) return setLoginFailed(true);
    setLoginFailed(false);
    //console.log(result.data);
    const token = result.data.token.token;
    const tokenValues = result.data.token;
    console.log('@@token IN Login Screen Values', tokenValues);

    await authStorage.storeToken(token);
    const decodedToken = JSON.parse(decode(token.split('.')[1]));
    authContext.setUser(decodedToken);
    await authStorage.storeUser(decodedToken);
    const userstore = await authStorage.getUser();
    console.log('New Stored user', userstore);
    const user = {email: decode.email};

    console.log('@@decoded', decodedToken);
    navigation.navigate('MainHome');
  };

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error);
    }
  }, [error]);

  // Implementing apple authentication
  const appleAuthHandler = () => {
    console.log('Apple Authentication');
  };

  // Implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log('Facebook Authentication');
  };

  // Implementing google authentication
  const googleAuthHandler = async () => {
    try {
      await GoogleSignin.hasPlayServices(); // check play services are available
      const userInfo = await GoogleSignin.signIn();
      // Handle the signed-in user info here
      console.log(userInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.select({android: -350})}
      behavior={'padding'}>
      <SafeAreaView
        style={[
          styles.area,
          {
            backgroundColor: COLORS.white,
          },
        ]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: COLORS.white,
            },
          ]}>
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
              Login to Your Account
            </Text>
            <Form
              initialValues={{
                username: '',
                password: '',
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}>
              <ErrorMessage
                error={'Invalid Email Or Password! Try Again'}
                visible={loginFailed}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                name="username"
                placeholder="Email Address"
                textContentType="emailAddress"
                maxLength={30}
                style={{width: '100%', color: '#000000'}}
                //FiledIconType={MaterialCommunityIcons}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="password"
                placeholder="Password"
                secureTextEntry
                textContentType="password"
                maxLength={30}
                style={{width: '100%', color: '#000000'}}
                //FiledIconType={MaterialCommunityIcons}
              />
              {/* <View style={styles.checkBoxContainer}>
                <View style={{flexDirection: 'row'}}>
                  <CheckBox
                    style={styles.checkbox}
                    value={isChecked}
                    boxType="square"
                    onTintColor={isChecked ? COLORS.primary : 'gray'}
                    onFillColor={isChecked ? COLORS.primary : 'gray'}
                    onCheckColor={COLORS.white}
                    onValueChange={setChecked}
                    tintColors={{true: COLORS.primary, false: 'gray'}}
                  />
                  <View style={{flex: 1}}>
                    <Text
                      style={[
                        styles.privacy,
                        {
                          color: COLORS.black,
                        },
                      ]}>
                      Remenber me
                    </Text>
                  </View>
                </View>
              </View> */}
              <SubmitButton
                title="Sign In"
                buttonStyle={styles.button}
                width={300}
                isLoading={isLoading}
                disabled={isLoading}
                filled
              />
            </Form>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPasswordEmail')}>
              <Text style={styles.forgotPasswordBtnText}>
                Forgot the password?
              </Text>
            </TouchableOpacity>

            <View>
              {/* <OrSeparator text="or continue with" />
              <View style={styles.socialBtnContainer}>
                <SocialButton
                  icon={icons.appleLogo}
                  onPress={appleAuthHandler}
                  tintColor={COLORS.black}
                />
                <SocialButton
                  icon={icons.facebook}
                  onPress={facebookAuthHandler}
                />
                <SocialButton icon={icons.google} onPress={googleAuthHandler} />
              </View> */}
              <View style={styles.bottomContainer}>
                <Text
                  style={[
                    styles.bottomLeft,
                    {
                      color: COLORS.black,
                    },
                  ]}>
                  Don't have an account ?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.bottomRight}>{'  '}Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
    fontFamily: 'Urbanist SemiBold',
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginVertical: 24,
    bottom: 10,
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
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default Login;
