import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  useColorScheme,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../constants';
import Header from '../components/Header';
import {ScrollView} from 'react-native-virtualized-view';
import authStorage from '../auth/storage';
import RenderHTML from 'react-native-render-html';

const TermsOfServices = () => {
  const [terms, setTerms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scheme = useColorScheme();

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

  useEffect(() => {
    fetchTerms();
  }, []);

  const isDarkMode = scheme === 'dark';

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header title="Terms Of Services" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <View style={styles.contentContainer}>
              <RenderHTML
                contentWidth={Dimensions.get('window').width}
                source={{html: terms}}
                baseStyle={{color: COLORS.black}}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    padding: 16,
  },
});

export default TermsOfServices;
