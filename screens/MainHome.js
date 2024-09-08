import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, SIZES, icons, images} from '../constants';
import {banners, categories, discountFoods, recommendedFoods} from '../data';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import authStorage from '../auth/storage';
import Banner from '../components/Banner';

const MainHome = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  /**
   * render header
   */
  const renderHeader = () => {
    return (
      // <View style={styles.headerContainer}>
      //   <View style={styles.viewLeft}>
      <View style={styles.viewNameContainer}>
        {/* <Text style={styles.greeeting}>Good Morning</Text> */}
        <Text
          style={[
            styles.title,
            {
              color: COLORS.greyscale900,
            },
          ]}>
          Saugeen Drives
        </Text>
      </View>
      //   </View>
      // </View>
    );
  };

  // const renderBannerItem = ({ item }) => (
  //   <View style={styles.bannerContainer}>
  //     <View style={styles.bannerTopContainer}>
  //       <View>
  //         <Text style={styles.bannerDicount}>{item.discount} OFF</Text>
  //         <Text style={styles.bannerDiscountName}>{item.discountName}</Text>
  //       </View>
  //       <Text style={styles.bannerDiscountNum}>{item.discount}</Text>
  //     </View>
  //     <View style={styles.bannerBottomContainer}>
  //       <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
  //       <Text style={styles.bannerBottomSubtitle}>{item.bottomSubtitle}</Text>
  //     </View>
  //   </View>
  // );

  const renderBannerItem = ({item}) => (
    <View style={styles.bannerContainer}>
      <Image source={{uri: item.image}} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const keyExtractor = item => item.id.toString();

  const handleEndReached = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
  };

  const renderDot = index => {
    return (
      <View
        style={[styles.dot, index === currentIndex ? styles.activeDot : null]}
        key={index}
      />
    );
  };

  const fetchDashboardData = async () => {
    const Token = await authStorage.getToken();
    const myHeaders = new Headers();
    myHeaders.append('Authorization', Token);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Customer/dashboard',
        requestOptions,
      );
      const result = await response.json();
      setDashboardData(result);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // const renderBanner = () => {
  //   return (
  //     <View style={styles.bannerItemContainer}>
  //       <FlatList
  //         data={banners}
  //         renderItem={renderBannerItem}
  //         keyExtractor={keyExtractor}
  //         horizontal
  //         pagingEnabled
  //         showsHorizontalScrollIndicator={false}
  //         onEndReached={handleEndReached}
  //         onEndReachedThreshold={0.5}
  //         onMomentumScrollEnd={(event) => {
  //           const newIndex = Math.round(
  //             event.nativeEvent.contentOffset.x / SIZES.width
  //           );
  //           setCurrentIndex(newIndex);
  //         }}
  //       />
  //       <View style={styles.dotContainer}>
  //         {banners.map((_, index) => renderDot(index))}
  //       </View>
  //     </View>
  //   )
  // }

  // const renderBanner = () => {
  //   if (!dashboardData || !dashboardData.ads) return null;

  //   return (
  //     <View style={styles.bannerContainer}>
  //       <FlatList
  //         data={dashboardData.ads}
  //         renderItem={({ item, index }) => (
  //           <View style={styles.bannerSlide}>
  //             <Image source={{ uri: item.image }} style={styles.bannerImage} />
  //             <LinearGradient
  //               colors={['transparent', 'rgba(0,0,0,0.8)']}
  //               style={styles.bannerGradient}
  //             >
  //               <Text style={styles.bannerDescription}>{item.description}</Text>
  //             </LinearGradient>
  //           </View>
  //         )}
  //         keyExtractor={(item) => item.code}
  //         horizontal
  //         pagingEnabled
  //         showsHorizontalScrollIndicator={false}
  //         snapToAlignment="center"
  //         decelerationRate="fast"
  //         snapToInterval={SIZES.width - 32}  // Adjust this to match the Home screen
  //         onMomentumScrollEnd={(event) => {
  //           const newIndex = Math.round(
  //             event.nativeEvent.contentOffset.x / (SIZES.width - 32)
  //           );
  //           setCurrentIndex(newIndex);
  //         }}
  //       />
  //       <View style={styles.dotContainer}>
  //         {dashboardData.ads.map((_, index) => (
  //           <View
  //             key={index}
  //             style={[
  //               styles.dot,
  //               index === currentIndex ? styles.activeDot : null,
  //             ]}
  //           />
  //         ))}
  //       </View>
  //     </View>
  //   );
  // };

  const renderMainBox = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 34,
          flexWrap: 'wrap',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            width: 150,
            height: 170,
            borderRadius: 12,
            shadowColor: 'black',
            shadowOffset: {
              height: 1,
              width: 1,
            },
            elevation: 15,
          }}
          onPress={() => navigation.navigate('')}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={images.ride}
              resizeMode="contain"
              style={{height: 90, width: 90}}
            />
            <Text style={{fontSize: 15, color: 'black', textAlign: 'center'}}>
              Book A Ride
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            width: 150,
            height: 170,
            borderRadius: 12,
            shadowColor: 'black',
            shadowOffset: {
              height: 1,
              width: 1,
            },
            elevation: 15,
          }}
          onPress={() => navigation.navigate('Home')}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={images.orderFood}
              resizeMode="contain"
              style={{height: 90, width: 90}}
            />
            <Text style={{fontSize: 15, color: 'black', textAlign: 'center'}}>
              Order Food
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            width: 150,
            height: 170,
            borderRadius: 12,
            shadowColor: 'black',
            shadowOffset: {
              height: 1,
              width: 1,
            },
            elevation: 15,
            marginTop: 20,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={images.shopAround}
              resizeMode="contain"
              style={{height: 90, width: 90}}
            />
            <Text style={{fontSize: 15, color: 'black', textAlign: 'center'}}>
              Shops Around
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * render recommended foods
   */
  const renderRecommendedFoods = () => {
    const [selectedCategories, setSelectedCategories] = useState(['1']);

    const filteredFoods = recommendedFoods.filter(
      food =>
        selectedCategories.includes('1') ||
        selectedCategories.includes(food.categoryId),
    );
  };
  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        {renderHeader()}
        {/* {renderBanner()} */}
        <Banner dashboardData={dashboardData} />
        {renderRecommendedFoods()}
        {renderMainBox()}
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
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: 'row',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23,
  },
  greeeting: {
    fontSize: 16,
    fontFamily: 'Urbanist Regular',
    color: 'gray',
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
  },
  viewNameContainer: {
    marginLeft: 12,
    marginTop: 12,
  },
  viewRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8,
  },
  bookmarkIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  searchBarContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.gray,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist Regular',
    marginHorizontal: 8,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  // bannerContainer: {
  //   width: SIZES.width - 32,
  //   height: 154,
  //   paddingHorizontal: 28,
  //   paddingTop: 28,
  //   borderRadius: 0.2,

  // },
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
export default MainHome;
