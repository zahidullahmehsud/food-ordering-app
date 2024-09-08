import React, {useState, useEffect, useRef} from 'react';
import {View, Image, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {COLORS} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AutoSlider = ({images}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const {width} = Dimensions.get('window');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
      scrollViewRef.current.scrollTo({
        animated: true,
        x: width * ((currentIndex + 1) % images.length),
        y: 0,
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, images.length, width]);

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
  };

  const handlePaginationPress = index => {
    setCurrentIndex(index);
    scrollViewRef.current.scrollTo({
      animated: true,
      x: width * index,
      y: 0,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.imageContainer, {width}]}
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {images.map((imageUrl, index) => (
          <View key={index} style={[styles.imageWrapper, {width}]}>
            <Image
              style={styles.image}
              source={{uri: imageUrl}}
              // resizeMethod="scale"
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  index === currentIndex ? COLORS.primary : '#C4C4C4',
              },
            ]}
            onPress={() => handlePaginationPress(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: hp(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: hp(30),
  },
  imageContainer: {
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});

export default AutoSlider;
