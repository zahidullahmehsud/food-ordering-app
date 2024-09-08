import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import React, {useState} from 'react';
import {COLORS, SIZES, icons, images} from '../constants';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Banner = ({dashboardData}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!dashboardData || !dashboardData.ads) return null;

  return (
    <View style={styles.bannerContainer}>
      <FlatList
        data={dashboardData.ads}
        renderItem={({item, index}) => (
          <View style={styles.bannerSlide}>
            <Image source={{uri: item.image}} style={styles.bannerImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.bannerGradient}>
              <Text style={styles.bannerDescription}>{item.description}</Text>
            </LinearGradient>
          </View>
        )}
        keyExtractor={item => item.code}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate={0.8}
        snapToInterval={SIZES.width - 32} // Adjust this to match the Home screen
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / (SIZES.width - 32),
          );
          setCurrentIndex(newIndex);
        }}
      />
      <View style={styles.dotContainer}>
        {dashboardData.ads.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  bannerContainer: {
    width: SIZES.width,
    height: hp(25),
    marginVertical: 20,
    paddingHorizontal: 16, // Add horizontal padding
  },
  bannerSlide: {
    width: SIZES.width - 32, // Adjust width to account for padding
    height: hp(25),
    position: 'relative',

    overflow: 'hidden', // Ensure image respects border radius
    borderRadius: 10,
  },
  bannerImage: {
    width: wp(100),
    height: hp(25),
    resizeMode: 'cover',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  bannerDescription: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  bannerTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerDicount: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerDiscountName: {
    fontSize: 16,
    fontFamily: 'Urbanist Medium',
    color: COLORS.white,
  },
  bannerDiscountNum: {
    fontSize: 46,
    fontFamily: 'Urbanist Bold',
    color: COLORS.white,
  },
  bannerBottomContainer: {
    marginTop: 8,
  },
  bannerBottomTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist Medium',
    color: COLORS.white,
  },
  bannerBottomSubtitle: {
    fontSize: 16,
    fontFamily: 'Urbanist Medium',
    color: COLORS.white,
    marginTop: 4,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
  },
  firstName: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.dark2,
    marginTop: 6,
  },
  // bannerItemContainer: {
  //   width: "100%",
  //   paddingBottom: 10,
  //   backgroundColor: COLORS.primary,
  //   height: 170,
  //   borderRadius: 8,
  // },
  bannerItemContainer: {
    width: wp(100),
    height: hp(25),
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.white,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
