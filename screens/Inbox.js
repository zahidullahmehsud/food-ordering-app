import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {COLORS, SIZES, icons, images} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Feather from 'react-native-vector-icons/Feather';
import {Calls, Chats} from '../tabs';

const renderScene = SceneMap({
  first: Chats,
  second: Calls,
});

// Inbox tabs
const Inbox = () => {
  const layout = useWindowDimensions();

  //  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Chats'},
    {key: 'second', title: 'Calls'},
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: COLORS.white,
      }}
      renderLabel={({route, focused}) => (
        <Text
          style={[
            {
              color: focused ? COLORS.primary : 'gray',
              fontSize: 16,
              fontFamily: 'Urbanist Bold',
            },
          ]}>
          {route.title}
        </Text>
      )}
    />
  );

  /**
   * render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          {/* <Image
            source={images.logo}
            resizeMode='contain'
            style={styles.headerLogo}
          /> */}
          <Text
            style={[
              styles.headerTitle,
              {
                color: COLORS.greyscale900,
              },
            ]}>
            Inbox
          </Text>
        </View>
        <View style={styles.headerRight}>
          {/* <TouchableOpacity>
            <Image
              source={icons.search}
              resizeMode="contain"
              style={[
                styles.searchIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
            <Image
              source={icons.moreCircle}
              resizeMode="contain"
              style={[
                styles.moreCircleIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  const ComingSoonBanner = () => (
    <View style={styles.bannerContainer}>
      <Text style={styles.bannerText}>Coming soon</Text>
    </View>
  );
  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        {renderHeader()}
        <ComingSoonBanner />
        {/* <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        /> */}
        {/* Implementing adding post */}
        {/* <TouchableOpacity style={styles.addPostBtn}>
          <Feather name="plus" size={24} color={COLORS.white} />
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontFamily: 'Urbanist Bold',
    color: COLORS.primary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },

  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    height: 36,
    width: 36,
    tintColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    marginLeft: 12,
  },
  addPostBtn: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: 72,
    right: 16,
    zIndex: 999,
    shadowRadius: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 10},
  },
});

export default Inbox;
