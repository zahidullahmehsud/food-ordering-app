import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, {useState, useRef, useContext, useEffect} from 'react';
import {COLORS, SIZES, icons, images} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {ScrollView} from 'react-native-virtualized-view';
import {launchImageLibrary} from 'react-native-image-picker';
import SettingsItem from '../components/SettingsItem';
import RBSheet from 'react-native-raw-bottom-sheet';
import {BarIndicator} from 'react-native-indicators';
import Button from '../components/Button';
import authStorage from '../auth/storage';
import AuthContext from '../auth/context';
import TermsModal from '../components/TermsModal';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useFocusEffect} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {WebView} from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Profile = ({navigation}) => {
  const refRBSheet = useRef();
  const authContext = useContext(AuthContext);
  const {user, setUser} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(images.user12);
  const [modalVisible, setModalVisible] = useState(false);
  const [terms, setTerms] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSound, setisSound] = useState(false);
  const [isAutoUpdated, setisAutoUpdated] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);

  const openWebView = url => {
    setWebViewUrl(url);
    setShowWebView(true);
    setIsWebViewLoading(true);
  };

  const closeWebView = () => {
    setShowWebView(false);
    setWebViewUrl('');
    setIsWebViewLoading(true);
  };

  const renderWebView = () => {
    if (!showWebView) return null;

    return (
      <View style={styles.webViewContainer}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <View style={styles.webViewHeader}>
          <TouchableOpacity onPress={closeWebView} style={styles.closeButton}>
            <MaterialIcons name="close" size={25} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalLine} />
        <WebView
          source={{uri: webViewUrl}}
          style={styles.webView}
          onLoadStart={() => setIsWebViewLoading(true)}
          onLoadEnd={() => setIsWebViewLoading(false)}
        />
        {isWebViewLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </View>
    );
  };

  const uploadImage = async imageLocalPath => {
    try {
      setIsLoading(true);
      const Token = await authStorage.getToken();

      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri: imageLocalPath,
        name: 'profile.jpg', // Set the appropriate file name and extension
        type: 'image/jpeg', // Ensure the correct MIME type
      });

      // Prepare request options
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Token}`, // Add Bearer token
        },
        body: formData,
        redirect: 'follow',
      };

      // Send the request
      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Customer/update-profile-picture',
        requestOptions,
      );

      // Handle response
      const result = await response.json();
      console.log('image uploaded response:', result);
      if (response.ok) {
        setImage({uri: result.profile.image});
        setIsLoading(false);
        // handleImageUploadSucessMessage();
      }

      //fetchProfileImage();
    } catch (error) {
      console.log('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileImage = async () => {
    try {
      setIsLoading(true);
      const Token = await authStorage.getToken();

      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Token}`, // Add Bearer token
        },
        redirect: 'follow',
      };

      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Customer',
        requestOptions,
      );

      const result = await response.json();
      console.log('fetch profile data:', result.profile.image);
      setImage({uri: result.profile.image});
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(fasle);
    }
  };

  const handleImageUploadSucessMessage = () => {
    toast.success('Image upoad successfully', {
      duration: 2000,
      position: ToastPosition.BOTTOM,
      styles: {
        view: {
          backgroundColor: COLORS.primary,
          borderRadius: 5,
          bottom: 30,
        },
        // pressable: ViewStyle,
        text: {
          color: 'white',
          fontWeight: '600',
        },
        indicator: {
          backgroundColor: 'white',
        },
      },
    });
  };

  const getInfo = async () => {
    try {
      setIsLoading(true);
      const Token = await authStorage.getToken();

      // Prepare request options
      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Token}`, // Add Bearer token
        },
        redirect: 'follow',
      };

      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Info',
        requestOptions,
      );
      const info = await response.json();
      console.log('my info is ==>', info);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTerms = async () => {
    try {
      setIsLoading(true);
      const Token = await authStorage.getToken();

      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Token}`,
        },
        redirect: 'follow',
      };

      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Info',
        requestOptions,
      );
      const info = await response.json();
      setTerms(info.termsAndConditions);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleTermsPress = () => {
  //   setModalVisible(true);
  //   fetchTerms();
  // };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileImage();
      getInfo();
    }, []),
  );

  // useEffect(() => {
  //   fetchProfileImage();
  //   getInfo();
  // }, []);

  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          {/* <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          /> */}
          <Text
            style={[
              styles.headerTitle,
              {
                color: COLORS.greyscale900,
              },
            ]}>
            Profile
          </Text>
        </View>
        {/* <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode="contain"
            style={[
              styles.headerIcon,
              {
                tintColor: COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
  };
  /**
   * Render User Profile
   */
  const renderProfile = () => {
    // Image Profile handler
    const pickImage = () => {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('Image picker error: ', response.error);
        } else {
          let imageUri = response.uri || response.assets?.[0]?.uri;
          // setImage({uri: imageUri});
          console.log('image path :', imageUri);
          uploadImage(imageUri);
        }
      });
    };

    return (
      <View style={styles.profileContainer}>
        <View>
          <Image source={image} resizeMode="cover" style={styles.avatar} />
          <TouchableOpacity onPress={pickImage} style={styles.picContainer}>
            <MaterialIcons name="edit" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, {color: COLORS.greyscale900}]}>
          {user.unique_name}
        </Text>
        <Text style={[styles.subtitle, {color: COLORS.greyscale900}]}>
          {user.email}
        </Text>
      </View>
    );
  };
  /**
   * Render Settings
   */
  const renderSettings = () => {
    const toggleDarkMode = () => {
      setIsDarkMode(prev => !prev);
    };

    const toggleisSound = () => {
      setisSound(prev => !prev);
      prev => !prev;
    };
    const toggleisAutoUpdated = () => {
      setisAutoUpdated(prev => !prev);
    };

    return (
      <View style={styles.settingsContainer}>
        {/* <SettingsItem
          icon={icons.userOutline}
          name="Personal Info"
          // onPress={() => navigation.navigate('CheckoutOrdersAddress')}
        /> */}
        {/* <SettingsItem
          icon={icons.cartOutline}
          name="My Cart"
          onPress={() => navigation.navigate("MyCart")}
        /> */}
        <SettingsItem
          icon={icons.location2Outline}
          name="My Locations"
          onPress={() => navigation.navigate('CheckoutOrdersAddress')}
        />
        {/* <SettingsItem
         icon={icons.promotion}
          name="My Promotions"
          onPress={() => navigation.navigate("")}
        /> */}
        {/* <SettingsItem
          icon={icons.wallet2Outline}
          name="Payment Methods"
          onPress={() => navigation.navigate("SettingsPayment")}
        /> */}
        {/* <SettingsItem
          icon={icons.messeges}
          name="Messeges"
          onPress={() => navigation.navigate("Inbox")}
        /> */}

        {/* <SettingsItem
          icon={icons.people4}
          name="Invite Friends"
          onPress={() => navigation.navigate("InviteFriends")}
        /> */}

        {/* <SettingsItem
          icon={icons.shieldOutline}
          name="Security"
         // onPress={() => navigation.navigate("SettingsSecurity")}
        /> */}
        <SettingsItem
          icon={icons.lock}
          name="Change Password"
          onPress={() =>
            navigation.navigate('ChangePasswordEmail', {
              title: 'Change Password',
            })
          }
        />
        {/* <SettingsItem
          icon={icons.telephoneOutline}
          name="Contact Us"
          onPress={() => {
            navigation.navigate('WebViewPage', {
              title: 'Contact Us',
            });
          }}
        />
        <SettingsItem
          icon={icons.messeges}
          name="FAQs"
          onPress={() => {
            navigation.navigate('WebViewPage', {
              title: 'FAQs',
            });
          }}
        /> */}

        <View
          style={[
            styles.separateLine,
            {
              marginVertical: 10,
              backgroundColor: COLORS.grayscale200,
            },
          ]}
        />

        {/* <TouchableOpacity
          onPress={() => navigation.navigate("SettingsLanguage")}
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.more}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: COLORS.greyscale900
            }]}>Language</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.rightLanguage, {
              color: COLORS.greyscale900
            }]}>English (US)</Text>
            <Image
              source={icons.arrowRight}
              resizeMode='contain'
              style={[styles.settingsArrowRight, {
                tintColor: COLORS.greyscale900
              }]}
            />
          </View>
        </TouchableOpacity> */}

        {/* <SettingsItem
         // icon={icons.bell2}
          name="Push Notification"
        //  onPress={() => navigation.navigate("SettingsNotifications")}
        /> */}

        {/* <TouchableOpacity
          style={styles.settingsItemContainer} onPress={() => navigation.navigate("")}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.show}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: COLORS.greyscale900
            }]}>Push Notification</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>

 */}

        {/* 

        <TouchableOpacity
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.show}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: COLORS.greyscale900
            }]}>Dark Mode</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.show}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: COLORS.greyscale900
            }]}>Sound</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isSound}
              onValueChange={toggleisSound}
              thumbColor={isSound ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.show}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: COLORS.greyscale900
            }]}>Automatically updated</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isAutoUpdated}
              onValueChange={toggleisAutoUpdated}
              thumbColor={isAutoUpdated ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>

        */}

        {/* <SettingsItem
          icon={icons.userOutline}
          name="Edit Profile"
          onPress={() => navigation.navigate("EditProfile")}
        />
       */}

        {/* <TouchableOpacity
          style={styles.settingsItemContainer}
          onPress={() => navigation.navigate('TermsOfServices')}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.show}
              resizeMode="contain"
              style={[
                styles.settingsIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
            <Text
              style={[
                styles.settingsName,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              Terms of service
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{false: '#EEEEEE', true: COLORS.primary}}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.settingsItemContainer}
          onPress={() =>
            navigation.navigate('WebViewPage', {
              title: 'Contact Us',
            })
          }>
          <View style={styles.leftContainer}>
            <Image
              source={icons.telephoneOutline}
              resizeMode="contain"
              style={[
                styles.settingsIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
            <Text
              style={[
                styles.settingsName,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              Contact Us
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItemContainer}
          onPress={() =>
            navigation.navigate('WebViewPage', {
              title: 'FAQs',
            })
          }>
          <View style={styles.leftContainer}>
            <Image
              source={icons.messeges}
              resizeMode="contain"
              style={[
                styles.settingsIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
            <Text
              style={[
                styles.settingsName,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              FAQs
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItemContainer}
          onPress={() =>
            navigation.navigate('WebViewPage', {
              title: 'Privacy Policy',
            })
          }>
          <View style={styles.leftContainer}>
            <Image
              source={icons.privacy}
              resizeMode="contain"
              style={[
                styles.settingsIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
            <Text
              style={[
                styles.settingsName,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              Privacy Policy
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItemContainer}
          onPress={() =>
            navigation.navigate('WebViewPage', {
              url: 'https://facebook.com',
              title: 'Terms of Usage',
            })
          }>
          <View style={styles.leftContainer}>
            <Image
              source={icons.terms}
              resizeMode="contain"
              style={[
                styles.settingsIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
            <Text
              style={[
                styles.settingsName,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              Terms of Usage
            </Text>
          </View>
          {/* <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItemContainer}
          onPress={() =>
            navigation.navigate('WebViewPage', {
              url: 'https://google.com',
              title: 'About App',
            })
          }>
          <View style={styles.leftContainer}>
            <Image
              source={icons.info}
              resizeMode="contain"
              style={[
                styles.settingsIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
            <Text
              style={[
                styles.settingsName,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              About App
            </Text>
          </View>
          {/* <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View> */}
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.settingsItemContainer}
          onPress={() =>
            navigation.navigate('RateTheDriver', {
              orderCode: '81a25cac-4f68-4aff-b37e-9d0b51782144',
            })
          }>
          <View style={styles.leftContainer}>
            <Text
              style={[
                styles.settingsName,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              Order Rating
            </Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          style={styles.logoutContainer}>
          <View style={styles.logoutLeftContainer}>
            <Image
              source={icons.logout}
              resizeMode="contain"
              style={[
                styles.logoutIcon,
                {
                  tintColor: 'red',
                },
              ]}
            />
            <Text
              style={[
                styles.logoutName,
                {
                  color: 'red',
                },
              ]}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('basketItems');
    await AsyncStorage.removeItem('basketCount');
    await authStorage.storeToken('');
    await authContext.setUser('');
    await authStorage.removeUser();
    setUser(null);
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <BarIndicator color={COLORS.primary} />
        </View>
      ) : (
        <View style={[styles.container, {backgroundColor: COLORS.white}]}>
          {renderHeader()}
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderProfile()}
            {renderSettings()}
          </ScrollView>
        </View>
      )}
      {renderWebView()}
      {/* <TermsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        terms={terms}
      /> */}

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={SIZES.height * 0.8}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: COLORS.grayscale200,
            height: 4,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 260,
            backgroundColor: COLORS.white,
          },
        }}>
        <Text style={styles.bottomTitle}>Logout</Text>
        <View
          style={[
            styles.separateLine,
            {
              backgroundColor: COLORS.grayscale200,
            },
          ]}
        />
        <Text
          style={[
            styles.bottomSubtitle,
            {
              color: COLORS.black,
            },
          ]}>
          Are you sure you want to log out?
        </Text>
        <View style={styles.bottomContainer}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: COLORS.tansparentPrimary,
            }}
            textColor={COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Yes, Logout"
            filled
            style={styles.logoutButton}
            onPress={handleLogout}
          />
        </View>
      </RBSheet>
      <Toasts />
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
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 32,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separateLine: {
    width: '100%',
    height: 0.7,
    backgroundColor: COLORS.greyScale800,
    marginVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  profileContainer: {
    alignItems: 'center',
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: 0.4,
    paddingVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999,
    // backgroundColor: COLORS.greyscale900,
  },
  picContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    position: 'absolute',
    right: 0,
    bottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: 'Urbanist Medium',
    marginTop: 4,
  },
  settingsContainer: {
    marginVertical: 12,
  },
  settingsItemContainer: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  settingsName: {
    fontSize: 18,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  settingsArrowRight: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightLanguage: {
    fontSize: 18,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.greyscale900,
    marginRight: 8,
  },
  switch: {
    marginLeft: 8,
    transform: [{scaleX: 0.8}, {scaleY: 0.8}], // Adjust the size of the switch
  },
  logoutContainer: {
    width: wp(90),
    height: hp(7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    backgroundColor: '#FFEFED',
    borderRadius: 10,
  },
  logoutLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  logoutName: {
    fontSize: 18,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32,
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist SemiBold',
    color: 'red',
    textAlign: 'center',
    marginTop: 12,
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginVertical: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    zIndex: 22,
    position: 'absolute',
    flex: 1,
  },
  webViewHeader: {
    height: hp(6),
    // backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    // paddingBottom: 10,
  },
  webView: {
    flex: 1,
  },
  closeButton: {
    padding: 5,
    backgroundColor: COLORS.black,
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalLine: {
    height: 4,
    backgroundColor: COLORS.black,
    width: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default Profile;
