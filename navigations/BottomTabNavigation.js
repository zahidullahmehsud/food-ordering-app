import {View, Platform, Image, Text} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTS, icons} from '../constants';
import {Home, Inbox, Orders, Profile, Wallet} from '../screens';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = ({route}) => {
  const navigation = useNavigation();
  const initialRouteName = route?.params?.initialRouteName || 'Home';

  useFocusEffect(
    React.useCallback(() => {
      // Navigate to the initial route when the component mounts
      navigation.navigate(initialRouteName);
    }, [initialRouteName, navigation]),
  );

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          justifyContent: 'center',
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 90 : 60,
          backgroundColor: COLORS.white,
          borderTopColor: 'transparent',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={focused ? icons.home : icons.home2Outline}
                  resizeMode="contain"
                  style={{
                    height: 24,
                    width: 24,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.body4,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}>
                  Home
                </Text>
              </View>
            );
          },
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            if (route.name !== initialRouteName) {
              e.preventDefault();
              navigation.navigate('Home');
            }
          },
        })}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={focused ? icons.document : icons.documentOutline}
                  resizeMode="contain"
                  style={{
                    height: 24,
                    width: 24,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.body4,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}>
                  Orders
                </Text>
              </View>
            );
          },
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            if (route.name !== initialRouteName) {
              e.preventDefault();
              navigation.navigate('Orders');
            }
          },
        })}
      />
      <Tab.Screen
        name="Inbox"
        component={Inbox}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={
                    focused ? icons.chatBubble2 : icons.chatBubble2Outline
                  }
                  resizeMode="contain"
                  style={{
                    height: 24,
                    width: 24,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.body4,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}>
                  Inbox
                </Text>
              </View>
            );
          },
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            if (route.name !== initialRouteName) {
              e.preventDefault();
              navigation.navigate('Inbox');
            }
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={focused ? icons.user : icons.userOutline}
                  resizeMode="contain"
                  style={{
                    height: 24,
                    width: 24,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.body4,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}>
                  Profile
                </Text>
              </View>
            );
          },
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            if (route.name !== initialRouteName) {
              e.preventDefault();
              navigation.navigate('Profile');
            }
          },
        })}
      />
      {/* <Tab.Screen
                name="Wallet"
                component={Wallet}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    source={focused ? icons.wallet2 : icons.wallet2Outline}
                                    resizeMode='contain'
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: focused ? COLORS.primary : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? COLORS.primary : COLORS.gray3,
                                }}>Wallet</Text>
                            </View>
                        )
                    },
                }}
            /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
