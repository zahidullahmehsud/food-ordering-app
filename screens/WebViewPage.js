// WebViewPage.js
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import {WebView} from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, SIZES} from '../constants'; // Ensure this path is correct
import authStorage from '../auth/storage';
import {BarIndicator} from 'react-native-indicators';
import Header from '../components/Header';

const WebViewPage = ({route, navigation}) => {
  const {title} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const Token = await authStorage.getToken();
      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);

      const urlWithParams = `https://server.saugeendrives.com:9001/api/v1.0/Customer/dashboard`;

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(urlWithParams, requestOptions);
      const result = await response.json();
      if (title == 'Terms of Usage') {
        setUrl(result.termsOfUsageURL);
      }
      if (title == 'Privacy Policy') {
        setUrl(result.privacyPolicyURL);
      }
      if (title == 'About App') {
        setUrl(result.aboutAppURL);
      }
      if (title == 'FAQs') {
        setUrl(result.faqURL);
      }
      if (title == 'Contact Us') {
        setUrl(result.contactUsURL);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.header}>
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}>
          <MaterialIcons name="arrow-back" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', color: COLORS.black}}>{title}</Text> */}
        <Header title={title} />
      </View>

      <View style={styles.horizontalLine} />
      <View style={{flex: 1, justifyContent: 'center'}}>
        {url ? (
          <WebView
            source={{uri: url}}
            style={styles.webView}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
        ) : (
          isLoading == false && (
            <Text
              style={{
                color: COLORS.black,
                textAlign: 'center',
                fontSize: 18,
                fontFamily: 'Urbanist SemiBold',
                fontWeight: '500',
              }}>
              Page not Found
            </Text>
          )
        )}
      </View>

      {isLoading && (
        <View style={styles.loaderContainer}>
          <BarIndicator color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    height: 45,

    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  closeButton: {
    padding: 5,
  },
  horizontalLine: {
    height: 2,
    backgroundColor: COLORS.gray3,
    width: '100%',
  },
  webView: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default WebViewPage;
