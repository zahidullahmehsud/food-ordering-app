import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {COLORS, SIZES, icons, images} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-virtualized-view';
import {categories, myFavouriteFoods} from '../data';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../components/Button';
import NotFoundCard from '../components/NotFoundCard';
import VerticalFoodCardFavourite from '../components/VerticalFoodCardFavourite';
import HorizontalFoodCardFavourite from '../components/HorizontalFoodCardFavourite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import CategoryItem from './CategoryItem';
import SubHeaderItem from '../components/SubHeaderItem';
import {Toasts, toast, ToastPosition} from '@backpackapp-io/react-native-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import authStorage from '../auth/storage';
const Favourite = ({navigation}) => {
  const refRBSheet = useRef();
  const [selectedBookmarkItem, setSelectedBookmarkItem] = useState(null);
  const [myBookmarkFoods, setMyBookmarkFoods] = useState([]);
  const [myCategoryItem, setCategoryItem] = useState([]);
  const [selectedCategoryItem, setSelectedCategoryItem] = useState(null);
  const [itemType, setItemType] = useState('');

  const [resultsCount, setResultsCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState('row');

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
      loadFavoritesCategory();
    }, []),
  );

  const fetchFavoriteItems = async () => {
    try {
      const Token = await authStorage.getToken();
      const response = await fetch(
        'https://server.saugeendrives.com:9001/api/v1.0/Customer/favourite-items',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: Token,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch favorite items');
      }
      const data = await response.json();
      if (data.code === 'OK' && Array.isArray(data.items)) {
        setCategoryItem(data.items);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching favorite items:', error);
    }
  };
  const deleteFavoriteItem = async itemCode => {
    try {
      const Token = await authStorage.getToken();
      const response = await fetch(
        `https://server.saugeendrives.com:9001/api/v1.0/Customer/favourite-items/${itemCode}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: Token,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to delete favorite item');
      }
      // Refresh the list after successful deletion
      fetchFavoriteItems();
    } catch (error) {
      console.error('Error deleting favorite item:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites !== null) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setMyBookmarkFoods(parsedFavorites);
        console.log('Loaded favorites:', parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };
  const loadFavoritesCategory = async () => {
    fetchFavoriteItems();
    // try {
    //   const storedFavorites = await AsyncStorage.getItem('CategoryItemsfav');
    //   if (storedFavorites !== null) {
    //     const parsedFavorites = JSON.parse(storedFavorites);
    //     setCategoryItem(parsedFavorites);
    //     console.log('Loaded favorites Categories:', parsedFavorites);
    //   }
    // } catch (error) {
    //   console.error('Error loading favorites:', error);
    // }
  };

  const handleRemoveBookmark = async () => {
    if (selectedBookmarkItem) {
      const updatedBookmarks = myBookmarkFoods.filter(
        food => food.code !== selectedBookmarkItem.code,
      );
      setMyBookmarkFoods(updatedBookmarks);

      try {
        await AsyncStorage.setItem(
          'favorites',
          JSON.stringify(updatedBookmarks),
        );
      } catch (error) {
        console.error('Error saving updated favorites:', error);
      }

      refRBSheet.current.close();
    }
  };

  const handleRemoveCategory = async () => {
    if (selectedCategoryItem) {
      try {
        const Token = await authStorage.getToken();
        const response = await fetch(
          `https://server.saugeendrives.com:9001/api/v1.0/Customer/favourite-items/${selectedCategoryItem.code}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: Token,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to delete favorite item');
        }

        // If deletion was successful, update the local state
        const updatedItems = myCategoryItem.filter(
          item => item.code !== selectedCategoryItem.code,
        );
        setCategoryItem(updatedItems);

        refRBSheet.current.close();
        removeFromFavoriteMessage();
      } catch (error) {
        console.error('Error deleting favorite item:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  // const handleRemoveCategory = async () => {
  //   if (selectedCategoryItem) {
  //     const updatedBookmarks = myCategoryItem.filter(
  //       food => food.code !== selectedCategoryItem.code,
  //     );
  //     setCategoryItem(updatedBookmarks);

  //     try {
  //       await AsyncStorage.setItem(
  //         'CategoryItemsfav',
  //         JSON.stringify(updatedBookmarks),
  //       );
  //     } catch (error) {
  //       console.error('Error saving updated favorites:', error);
  //     }

  //     refRBSheet.current.close();
  //   }
  // };

  const addToFavoriteMessage = () => {
    toast.success('Added to favorite', {
      duration: 2000,
      position: ToastPosition.BOTTOM,
      styles: {
        view: {
          backgroundColor: COLORS.primary,
          borderRadius: 5,
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

  // const handleRemoveBookmark = () => {
  //   // Implement your logic to remove the selectedBookmarkItem from the bookmark list
  //   if (selectedBookmarkItem) {
  //     const updatedBookmarkFoods = myBookmarkFoods.filter(
  //       (food) => food.id !== selectedBookmarkItem.id
  //     );
  //     setMyBookmarkFoods(updatedBookmarkFoods);

  //     // Close the bottom sheet
  //     refRBSheet.current.close();
  //   }
  // };
  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: COLORS.greyscale900,
              },
            ]}>
            Favourite
          </Text>
        </View>
        {/* <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode="contain"
            style={[
              styles.moreIcon,
              {
                tintColor: COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity> */}
      </View>
    );
  };
  /**
   * Render my bookmark events
   */
  // const renderMyBookmarkEvents = () => {
  //   const [selectedCategories, setSelectedCategories] = useState(["1"]);

  //   const filteredFoods = myBookmarkFoods.filter(food => selectedCategories.includes("1") || selectedCategories.includes(food.categoryId));

  //   useEffect(() => {
  //     setResultsCount(filteredFoods.length);
  //   }, [myBookmarkFoods, selectedCategories])

  //   // Category item
  //   const renderCategoryItem = ({ item }) => (
  //     <TouchableOpacity
  //       style={{
  //         backgroundColor: selectedCategories.includes(item.id) ? COLORS.primary : "transparent",
  //         padding: 10,
  //         marginVertical: 5,
  //         borderColor: COLORS.primary,
  //         borderWidth: 1.3,
  //         borderRadius: 24,
  //         marginRight: 12,
  //       }}
  //       onPress={() => toggleCategory(item.id)}>
  //       <Text style={{
  //         color: selectedCategories.includes(item.id) ? COLORS.white : COLORS.primary
  //       }}>{item.name}</Text>
  //     </TouchableOpacity>
  //   );

  //   // Toggle category selection
  //   const toggleCategory = (categoryId) => {
  //     const updatedCategories = [...selectedCategories];
  //     const index = updatedCategories.indexOf(categoryId);

  //     if (index === -1) {
  //       updatedCategories.push(categoryId);
  //     } else {
  //       updatedCategories.splice(index, 1);
  //     }

  //     setSelectedCategories(updatedCategories)
  //   };

  //   return (
  //     <View>
  //       <View style={styles.categoryContainer}>
  //         <FlatList
  //           data={categories}
  //           keyExtractor={item => item.id}
  //           showsHorizontalScrollIndicator={false}
  //           horizontal
  //           renderItem={renderCategoryItem}
  //         />
  //       </View>

  //       <View style={styles.reusltTabContainer}>
  //         <Text style={[styles.tabText, {
  //           color: COLORS.black
  //         }]}>{resultsCount} founds</Text>
  //         <View style={styles.viewDashboard}>
  //           <TouchableOpacity
  //             onPress={() => {
  //               setSelectedTab('column');
  //             }}>
  //             <Image
  //               source={selectedTab === 'column' ? icons.document2 : icons.document2Outline}
  //               resizeMode='contain'
  //               style={styles.dashboardIcon}
  //             />
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             onPress={() => {
  //               setSelectedTab('row');
  //             }}>
  //             <Image
  //               source={selectedTab === 'row' ? icons.dashboard : icons.dashboardOutline}
  //               resizeMode='contain'
  //               style={styles.dashboardIcon}
  //             />
  //           </TouchableOpacity>
  //         </View>
  //       </View>

  //       {/* Results container  */}
  //       <View>
  //         {/* Events result list */}
  //         <View style={{
  //           backgroundColor: COLORS.secondaryWhite,
  //           marginVertical: 16
  //         }}>
  //           {resultsCount && resultsCount > 0 ? (
  //             <>
  //               {
  //                 selectedTab === 'row' ? (
  //                   <FlatList
  //                     data={filteredFoods}
  //                     keyExtractor={(item) => item.id}
  //                     numColumns={2}
  //                     columnWrapperStyle={{ gap: 16 }}
  //                     renderItem={({ item }) => {
  //                       return (
  //                         <VerticalFoodCardFavourite
  //                           name={item.name}
  //                           image={item.image}
  //                           distance={item.distance}
  //                           price={item.price}
  //                           fee={item.fee}
  //                           rating={item.rating}
  //                           numReviews={item.numReviews}
  //                           onPress={() => {
  //                             // Show the bookmark item in the bottom sheet
  //                             setSelectedBookmarkItem(item);
  //                             refRBSheet.current.open()
  //                           }}
  //                         />
  //                       )
  //                     }}
  //                   />
  //                 ) : (
  //                   <FlatList
  //                     data={filteredFoods}
  //                     keyExtractor={(item) => item.id}
  //                     renderItem={({ item }) => {
  //                       return (
  //                         <HorizontalFoodCardFavourite
  //                           name={item.name}
  //                           image={item.image}
  //                           distance={item.distance}
  //                           price={item.price}
  //                           fee={item.fee}
  //                           rating={item.rating}
  //                           numReviews={item.numReviews}
  //                           onPress={() => {
  //                             // Show the bookmark item in the bottom sheet
  //                             setSelectedBookmarkItem(item);
  //                             refRBSheet.current.open()
  //                           }}
  //                         />
  //                       );
  //                     }}
  //                   />
  //                 )
  //               }
  //             </>
  //           ) : (
  //             <NotFoundCard />
  //           )}
  //         </View>
  //       </View>
  //     </View>
  //   )
  // }

  const renderMyBookmarkEvents = () => {
    return (
      <View>
        <View style={styles.reusltTabContainer}>
          <Text style={[styles.tabText, {color: COLORS.black}]}>
            {myBookmarkFoods.length} Resturant Found
          </Text>

          <View style={styles.viewDashboard}>
            <TouchableOpacity onPress={() => setSelectedTab('column')}>
              <Image
                source={
                  selectedTab === 'column'
                    ? icons.document2
                    : icons.document2Outline
                }
                resizeMode="contain"
                style={styles.dashboardIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab('row')}>
              <Image
                source={
                  selectedTab === 'row'
                    ? icons.dashboard
                    : icons.dashboardOutline
                }
                resizeMode="contain"
                style={styles.dashboardIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginVertical: 16}}>
          {myBookmarkFoods.length > 0 ? (
            <FlatList
              data={myBookmarkFoods}
              keyExtractor={item => item.code.toString()}
              numColumns={selectedTab === 'row' ? 2 : 1}
              key={selectedTab} // This forces the FlatList to re-render when the layout changes
              renderItem={({item}) => {
                const CardComponent =
                  selectedTab === 'row'
                    ? VerticalFoodCardFavourite
                    : HorizontalFoodCardFavourite;
                return (
                  <CardComponent
                    name={item.name}
                    image={
                      item.logo != 'N/A' ? {uri: item.logo} : images.hamburger3
                    } // Fallback to a default icon if image is not available
                    distance={item.distance}
                    price={item.deliveryCharges}
                    rating={item.rating}
                    onPress={() => {
                      navigation.navigate('CategoryHamburger', {
                        vendorcode: item.code,
                        distance: item.distance,
                        deliveryCharges: item.deliveryCharges,
                      });
                    }}
                    onLongPress={() => {
                      setSelectedBookmarkItem(item);
                      setItemType('resturant');
                      refRBSheet.current.open();
                    }}
                  />
                );
              }}
              columnWrapperStyle={selectedTab === 'row' ? {gap: 16} : null}
            />
          ) : (
            <Text></Text>
          )}
        </View>
      </View>
    );
  };

  const renderMyCategories = () => {
    return (
      <View>
        <View style={styles.reusltTabContainer}>
          <Text style={[styles.tabText, {color: COLORS.black}]}>
            {myCategoryItem.length} Items Found
          </Text>
        </View>

        <View style={{marginVertical: 16}}>
          {myCategoryItem.length > 0 ? (
            <FlatList
              data={myCategoryItem}
              keyExtractor={item => item.code.toString()}
              numColumns={selectedTab === 'row' ? 2 : 1}
              key={selectedTab} // This forces the FlatList to re-render when the layout changes
              renderItem={({item}) => {
                const CardComponent =
                  selectedTab === 'row'
                    ? VerticalFoodCardFavourite
                    : HorizontalFoodCardFavourite;
                return (
                  <CardComponent
                    name={item.name}
                    image={{uri: item.logo}} // Fallback to a default icon if image is not available
                    distance={item.distance}
                    price={item.deliveryCharges}
                    rating={item.rating}
                    onPress={() => {
                      navigation.navigate('FoodDetailsAddItem', {
                        itemCode: item.code,
                      });
                    }}
                    onLongPress={() => {
                      setSelectedCategoryItem(item);
                      setItemType('food');
                      refRBSheet.current.open();
                    }}
                  />
                );
              }}
              columnWrapperStyle={selectedTab === 'row' ? {gap: 16} : null}
            />
          ) : (
            <Text></Text>
          )}
        </View>
      </View>
    );
  };

  const removeFromFavoriteMessage = () => {
    toast.success('Removed from favorite', {
      duration: 2000,
      position: ToastPosition.BOTTOM,

      styles: {
        view: {
          backgroundColor: COLORS.red,
          borderRadius: 5,
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

  const BottomContainer = () => {
    return (
      <View>
        <View style={[styles.selectedBookmarkContainer]}>
          <HorizontalFoodCardFavourite
            name={
              itemType == 'resturant'
                ? selectedBookmarkItem?.name
                : selectedCategoryItem.name
            }
            image={
              itemType == 'resturant'
                ? selectedBookmarkItem.logo != 'N/A'
                  ? selectedBookmarkItem?.logo
                  : images.hamburger3
                : {uri: selectedCategoryItem?.logo} || icons.burger
            }
            distance={selectedBookmarkItem?.distance}
            price={selectedBookmarkItem?.deliveryCharges}
            rating={selectedBookmarkItem?.rating}
          />
        </View>
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
            title="Yes, Remove"
            filled
            style={styles.removeButton}
            onPress={() => {
              if (itemType == 'resturant') {
                handleRemoveBookmark();
              } else {
                handleRemoveCategory();
              }
            }}
          />
        </View>
      </View>
    );
  };
  //   return (
  //     <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
  //       <View style={[styles.container, { backgroundColor: COLORS.white }]}>
  //         {renderHeader()}
  //         <ScrollView showsVerticalScrollIndicator={false}>
  //           {renderMyBookmarkEvents()}
  //         </ScrollView>
  //       </View>
  //       <RBSheet
  //         ref={refRBSheet}
  //         closeOnDragDown={true}
  //         closeOnPressMask={false}
  //         height={360}
  //         customStyles={{
  //           wrapper: {
  //             backgroundColor: "rgba(0,0,0,0.5)",
  //           },
  //           draggableIcon: {
  //             backgroundColor: COLORS.greyscale300,
  //           },
  //           container: {
  //             borderTopRightRadius: 32,
  //             borderTopLeftRadius: 32,
  //             height: 360,
  //             backgroundColor: COLORS.white,
  //             alignItems: "center",
  //             width: "100%",
  //             paddingVertical: 12
  //           }
  //         }}>
  //         <Text style={[styles.bottomSubtitle, {
  //           color: COLORS.black
  //         }]}>Remove from Bookmark?</Text>
  //         <View style={styles.separateLine} />

  //         <View style={[styles.selectedBookmarkContainer,
  //         { backgroundColor: COLORS.tertiaryWhite }]}>
  //           <HorizontalFoodCardFavourite
  //             name={selectedBookmarkItem?.name}
  //             image={selectedBookmarkItem?.image}
  //             distance={selectedBookmarkItem?.distance}
  //             price={selectedBookmarkItem?.price}
  //             fee={selectedBookmarkItem?.fee}
  //             rating={selectedBookmarkItem?.rating}
  //             numReviews={selectedBookmarkItem?.numReviews}
  //             onPress={() => navigation.navigate("FoodDetails")}
  //           />
  //         </View>

  //         <View style={styles.bottomContainer}>
  //           <Button
  //             title="Cancel"
  //             style={{
  //               width: (SIZES.width - 32) / 2 - 8,
  //               backgroundColor: COLORS.tansparentPrimary,
  //               borderRadius: 32,
  //               borderColor: COLORS.tansparentPrimary
  //             }}
  //             textColor={COLORS.primary}
  //             onPress={() => refRBSheet.current.close()}
  //           />
  //           <Button
  //             title="Yes, Remove"
  //             filled
  //             style={styles.removeButton}
  //             onPress={handleRemoveBookmark}
  //           />
  //         </View>
  //       </RBSheet>
  //     </SafeAreaView>
  //   )

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        {renderHeader()}
        {myBookmarkFoods.length > 0 || myCategoryItem.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={true}>
            {renderMyBookmarkEvents()}
            {renderMyCategories()}
          </ScrollView>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: hp(65),
            }}>
            <Image
              resizeMode="contain"
              source={icons.favIcon}
              style={{
                height: hp(20),
                width: wp(70),
                marginTop: 60,
              }}
            />
            <Text
              style={{
                fontWeight: '500',
                fontSize: 18,
                marginTop: 10,
                color: 'black',
              }}>
              No Favorites Found
            </Text>
            <Text style={{textAlign: 'center', marginTop: 15}}>
              Explore and add your favorite items and restaurants!
            </Text>
          </View>
        )}
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={360}
        customStyles={{
          wrapper: {backgroundColor: 'rgba(0,0,0,0.5)'},
          draggableIcon: {backgroundColor: COLORS.greyscale300},
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 360,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            width: '100%',
            paddingVertical: 12,
          },
        }}>
        <Text style={[styles.bottomSubtitle, {color: COLORS.black}]}>
          Remove from Bookmark?
        </Text>
        <View style={styles.separateLine} />

        <BottomContainer />
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
  },
  headerContainer: {
    flexDirection: 'row',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
    marginLeft: 16,
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  categoryContainer: {
    marginTop: 0,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32,
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist SemiBold',
    color: 'red',
    textAlign: 'center',
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginVertical: 12,
  },
  selectedBookmarkContainer: {
    marginVertical: 16,
  },
  separateLine: {
    width: '100%',
    height: 0.2,
    backgroundColor: COLORS.greyscale300,
    marginHorizontal: 16,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
  },
  tabBtn: {
    width: (SIZES.width - 32) / 2 - 6,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.4,
    borderColor: COLORS.primary,
    borderRadius: 32,
  },
  selectedTab: {
    width: (SIZES.width - 32) / 2 - 6,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.4,
    borderColor: COLORS.primary,
    borderRadius: 32,
  },
  tabBtnText: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  selectedTabText: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.white,
    textAlign: 'center',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SIZES.width - 32,
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
  },
  subResult: {
    fontSize: 14,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
  },
  resultLeftView: {
    flexDirection: 'row',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 16,
    width: SIZES.width,
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
    color: COLORS.black,
    textAlign: 'center',
    marginTop: 12,
  },
  separateLine: {
    height: 0.4,
    width: SIZES.width - 32,
    backgroundColor: COLORS.greyscale300,
    marginVertical: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.black,
    marginVertical: 12,
  },
  reusltTabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  viewDashboard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 36,
    justifyContent: 'space-between',
  },
  dashboardIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
  },
  tabText: {
    fontSize: 20,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.black,
  },
});

export default Favourite;
