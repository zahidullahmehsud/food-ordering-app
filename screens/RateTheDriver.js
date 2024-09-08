import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, images} from '../constants';
import Header from '../components/Header';
// import {ScrollView} from 'react-native-virtualized-view';
import Rating from '../components/Rating';
import Button from '../components/Button';
import authStorage from '../auth/storage';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

const RateTheDriver = ({navigation, route}) => {
  const [currentRating, setCurrentRating] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const {item} = route.params;
  const scrollViewRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  console.log(item?.number);

  const submitRating = async () => {
    try {
      const Token = await authStorage.getToken();
      console.log('Token', Token);

      const myHeaders = new Headers();
      myHeaders.append('Authorization', Token);
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        rating: currentRating,
        review: reviewText,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        `https://server.saugeendrives.com:9001/api/v1.0/Rating/${item.number}/rating/driver`,
        requestOptions,
      );
      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Rating has been created successfully');
        setSuccessModalVisible(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setModalVisible(true);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}>
            <Header title="Order Rating" />
            <View style={styles.contentContainer}>
              <Image
                source={images.user12}
                resizeMode="contain"
                style={styles.avatar}
              />
              <Text style={styles.rateName}>
                Let's rate your driver's delivery service
              </Text>
              <Text style={styles.rateText}>
                How was the delivery of your order{' '}
                {/* {item?.vendorStore?.name} */}
              </Text>
              <Rating
                color="orange"
                size={40}
                onRatingChange={rating => setCurrentRating(rating)}
              />
              <TextInput
                style={styles.reviewInput}
                multiline
                numberOfLines={4}
                placeholder="Write your review here..."
                value={reviewText}
                onChangeText={setReviewText}
                placeholderTextColor={COLORS.black}
                onFocus={() => {
                  scrollViewRef.current.scrollToEnd({animated: true});
                }}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={styles.bottomContainer}>
          <Button title="Cancel" style={styles.cancelBtn} />
          <Button
            title="Submit"
            filled
            style={styles.submitBtn}
            onPress={submitRating}
          />
        </View>
      </KeyboardAvoidingView>
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
          navigation.goBack();
        }}
      />
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
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  contentContainer: {
    alignItems: 'center',
  },
  avatar: {
    height: 132,
    width: 132,
    borderRadius: 999,
    marginVertical: 12,
  },
  rateName: {
    fontSize: 28,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginVertical: 12,
  },
  rateText: {
    fontSize: 16,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
    textAlign: 'center',
    marginVertical: 12,
  },
  reviewInput: {
    width: '100%',
    height: 120,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginTop: 20,
    textAlignVertical: 'top',
    fontFamily: 'Urbanist Regular',
    color: COLORS.black,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.white,
  },
  cancelBtn: {
    width: (SIZES.width - 48) / 2,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary,
  },
  submitBtn: {
    width: (SIZES.width - 48) / 2,
  },
});

export default RateTheDriver;
