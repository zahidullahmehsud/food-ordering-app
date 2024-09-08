import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {COLORS, SIZES, icons} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-virtualized-view';
import {categories, cuisines, foods, ratings} from '../data';
import NotFoundCard from '../components/NotFoundCard';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../components/Button';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import VerticalFoodCard from '../components/VerticalFoodCard';
import HorizontalFoodCard from '../components/HorizontalFoodCard';
import authStorage from '../auth/storage';
import {BarIndicator} from 'react-native-indicators';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Handler slider
const CustomSliderHandle = ({enabled, markerStyle}) => {
  return (
    <View
      style={[
        markerStyle,
        {
          backgroundColor: enabled ? COLORS.primary : 'lightgray',
          borderColor: 'white',
          borderWidth: 2,
          borderRadius: 10,
          width: 20,
          height: 20,
        },
      ]}
    />
  );
};

const Search = ({navigation, route}) => {
  const refRBSheet = useRef();
  const [selectedCategories, setSelectedCategories] = useState(['1']);
  const [selectedRating, setSelectedRating] = useState(['1']);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentInput, setCurrentInput] = useState(''); // New state for current input
  const inputRef = useRef(null);
  const {latitude, longitude} = route.params;
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async newFavorites => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = item => {
    setFavorites(prevFavorites => {
      const isCurrentlyFavorite = prevFavorites.some(
        fav => fav.code === item.code,
      );
      let newFavorites;
      if (isCurrentlyFavorite) {
        newFavorites = prevFavorites.filter(fav => fav.code !== item.code);
      } else {
        newFavorites = [...prevFavorites, item];
      }
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  // useEffect(() => {
  //    fetchSearchResults("pizza");
  // }, [navigation]);

  useEffect(() => {
    loadFavorites();
    fetchSearchResults();
  }, []);

  const fetchSearchResults = async (searchQuery = '') => {
    const Token = await authStorage.getToken();
    const myHeaders = new Headers();
    myHeaders.append('Authorization', Token);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const url = `https://server.saugeendrives.com:9001/api/v1.0/Customer/dashboard?SearchKey=${searchQuery}`;

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('results = ', result);
      setApiResponse(result);

      const filteredItems = result.items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      filteredItems.forEach(item => {
        console.log('Item Code:', item.code);
      });

      if (filteredItems.length === 0) {
        // No items found, show error modal
        setErrorMessage('No items found for your search.');
        setModalVisible(true);
        setFilteredFoods([]);
        setResultsCount(0);
      } else {
        const allFoods = filteredItems.map(item => ({
          id: item.code,
          name: item.name,
          image: item.logo,
          distance: item.vendorStore.radius,
          price: item.amount,
          fee: item.vendorStore.deliveryChargesMinimum,
          rating: 4.5, // Assuming a default rating
          numReviews: 100, // Assuming a default number of reviews
          isPromo: item.isInRange,
        }));

        setFilteredFoods(allFoods);
        setResultsCount(allFoods.length);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while searching. Please try again.');
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    // setSearchQuery(currentInput); // Update searchQuery with currentInput
    fetchSearchResults(currentInput);
  };

  // useEffect(() => {
  //     handleSearch();
  // }, [searchQuery]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <BarIndicator color={COLORS.primary} />
        </View>
      );
    }
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in kilometers
      return Number(distance.toFixed(1)); // Convert to number with one decimal place
    }

    console.log(latitude, longitude);

    return (
      <View>
        {/* Search bar */}

        <View style={styles.reusltTabContainer}>
          <Text
            style={[
              styles.tabText,
              {
                color: COLORS.black,
              },
            ]}>
            {resultsCount} found
          </Text>
        </View>

        {/* Results container */}
        <View
          style={{
            backgroundColor: COLORS.secondaryWhite,
            marginVertical: 16,
          }}>
          <FlatList
            data={
              resultsCount > 0
                ? searchQuery
                  ? filteredFoods
                  : apiResponse?.items.map(item => ({
                      vendorStore: item.vendorStore.name,
                      id: item.code,
                      name: item.name,
                      image: item.logo,
                      distance: item.distance,
                      price: item.amount,
                      fee: item.vendorStore.deliveryChargesMinimum,
                      rating: 4.5,
                      numReviews: 100,
                      isPromo: item.isInRange,
                      latitude: item.vendorStore.latitude,
                      longitude: item.vendorStore.longitude,
                    }))
                : []
            }
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              const distance = calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(item.latitude),
                parseFloat(item.longitude),
              );
              console.log(item);
              return (
                <HorizontalFoodCard
                  vendorStore={item.vendorStore}
                  name={item.name}
                  image={{uri: item.image}}
                  distance={distance}
                  price={item.price}
                  fee={item.fee}
                  rating={item.rating || 0}
                  numReviews={item.numReviews || 0}
                  isPromo={item.isPromo || false}
                  onPress={() =>
                    navigation.navigate('FoodDetailsAddItem', {
                      itemCode: item.id,
                    })
                  }
                />
              );
            }}
            ListEmptyComponent={<View />}
          />
        </View>
      </View>
    );
  };

  //     const renderContent = () => {
  //         const [selectedTab, setSelectedTab] = useState('row');
  //         // const [searchQuery, setSearchQuery] = useState('');
  //         // const [filteredFoods, setFilteredFoods] = useState(foods);
  //         // const [resultsCount, setResultsCount] = useState(0);

  //         // useEffect(() => {
  //         //     handleSearch();
  //         // }, [searchQuery, selectedTab]);

  //         // const handleSearch = () => {
  //         //     const allFoods = foods.filter((food) =>
  //         //         food.name.toLowerCase().includes(searchQuery.toLowerCase())
  //         //     );
  //         //     setFilteredFoods(allFoods);
  //         //     setResultsCount(allFoods.length);
  //         // };

  //         if (isLoading) {
  //             return (
  //               <View style={styles.loadingContainer}>
  //                 <BarIndicator color={COLORS.primary} />
  //               </View>
  //             );
  //           }

  //         return (
  //             <View>
  //                 {/* Search bar */}
  //                 <View
  //                     onPress={() => console.log("Search")}
  //                     style={[styles.searchBarContainer, {
  //                         backgroundColor: COLORS.secondaryWhite
  //                     }]}>
  //                     <TouchableOpacity
  //                         onPress={handleSearch}>
  //                         <Image
  //                             source={icons.search2}
  //                             resizeMode='contain'
  //                             style={styles.searchIcon}
  //                         />
  //                     </TouchableOpacity>
  //                     <TextInput
  //                      ref={inputRef}
  //                         placeholder='Search'
  //                         selectionColor='black'
  //                         placeholderTextColor='black'
  //                         style={[styles.searchInput, {
  //                             color: COLORS.white // Change COLORS.black to COLORS.white or another contrasting color
  //                         }]}
  //                         value={currentInput}
  //                         onChangeText={(text) => setCurrentInput(text)}
  //                         onSubmitEditing={handleSearch} // Add this line
  //                         returnKeyType="search" // Optional: changes the return key to "Search"
  //                         blurOnSubmit={false} // This prevents the keyboard from dismissing on submit
  //                     />
  //                     {/* <TouchableOpacity
  //                         onPress={() => refRBSheet.current.open()}>
  //                         <Image
  //                             source={icons.filter}
  //                             resizeMode='contain'
  //                             style={styles.filterIcon}
  //                         />
  //                     </TouchableOpacity> */}
  //                 </View>

  //                 <View style={styles.reusltTabContainer}>
  //                     <Text style={[styles.tabText, {
  //                         color: COLORS.black
  //                     }]}>{resultsCount} founds</Text>
  //                     <View style={styles.viewDashboard}>
  //                         <TouchableOpacity
  //                             onPress={() => {
  //                                 setSelectedTab('column');
  //                                 setSearchQuery(''); // Clear search query when changing tab
  //                             }}>
  //                             <Image
  //                                 source={selectedTab === 'column' ? icons.document2 : icons.document2Outline}
  //                                 resizeMode='contain'
  //                                 style={styles.dashboardIcon}
  //                             />
  //                         </TouchableOpacity>
  //                         <TouchableOpacity
  //                             onPress={() => {
  //                                 setSelectedTab('row');
  //                                 setSearchQuery(''); // Clear search query when changing tab
  //                             }}>
  //                             <Image
  //                                 source={selectedTab === 'row' ? icons.dashboard : icons.dashboardOutline}
  //                                 resizeMode='contain'
  //                                 style={styles.dashboardIcon}
  //                             />
  //                         </TouchableOpacity>
  //                     </View>
  //                 </View>

  //                 {/* Results container  */}
  //                 <View>
  //                     {/* Events result list */}
  //                     <View style={{
  //                         backgroundColor: COLORS.secondaryWhite,
  //                         marginVertical: 16
  //                     }}>
  //                         {resultsCount && resultsCount > 0 ? (
  //                             <>
  //                                 {
  //                                     selectedTab === 'row' ? (
  //                                       <FlatList
  //     data={searchQuery ? filteredFoods : apiResponse?.items.map(item => ({
  //         id: item.code,
  //         name: item.name,
  //         image: item.logo,
  //         distance: item.vendorStore.radius,
  //         price: item.amount,
  //         fee: item.vendorStore.deliveryChargesMinimum,
  //         rating: 4.5,
  //         numReviews: 100,
  //         isPromo: item.isInRange
  //     }))}
  //     keyExtractor={(item) => item.id}
  //     numColumns={2}
  //     columnWrapperStyle={{ gap: 16 }}
  //     renderItem={({ item }) => {
  //         return (
  //             <VerticalFoodCard
  //             name={item.name}
  //             image={item.image}
  //             distance={item.distance}
  //             price={item.price}
  //             fee={item.fee}
  //             rating={item.rating}
  //             numReviews={item.numReviews}
  //             onPress={() => navigation.navigate("FoodDetailsAddItem", { itemCode: item.id })}
  //             onFavoritePress={() => toggleFavorite(item)}
  //             isFavorite={favorites.some(fav => fav.code === item.code)}
  //           />
  //         );
  //     }}
  // />
  //                                     ) : (
  //                                         <FlatList
  //                                         data={searchQuery ? filteredFoods : apiResponse?.items.map(item => ({
  //                                             id: item.code,
  //                                             name: item.name,
  //                                             image: item.logo,
  //                                             distance: item.vendorStore.radius,
  //                                             price: item.amount,
  //                                             fee: item.vendorStore.deliveryChargesMinimum,
  //                                             rating: 4.5,
  //                                             numReviews: 100,
  //                                             isPromo: item.isInRange
  //                                         }))}
  //                                         keyExtractor={(item) => item.id}
  //                                         renderItem={({ item }) => {
  //                                             return (
  //                                                 <HorizontalFoodCard
  //                                                     name={item.name}
  //                                                     image={item.image}
  //                                                     distance={item.distance}
  //                                                     price={item.price}
  //                                                     fee={item.fee}
  //                                                     rating={item.rating}
  //                                                     numReviews={item.numReviews}
  //                                                     isPromo={item.isPromo}
  //                                                     onPress={() => navigation.navigate("FoodDetailsAddItem", { itemCode: item.id })}
  //                                                 />
  //                                             );
  //                                         }}
  //                                     />
  //                                     )
  //                                 }
  //                             </>
  //                         ) : (
  //                             <NotFoundCard />
  //                         )}
  //                     </View>
  //                 </View>
  //             </View>
  //         )
  //     }

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
            Search
          </Text>
        </View>
        {/* <TouchableOpacity>
                    <Image
                        source={icons.moreCircle}
                        resizeMode='contain'
                        style={[styles.moreIcon, {
                            tintColor: COLORS.greyscale900
                        }]}
                    />
                </TouchableOpacity> */}
      </View>
    );
  };

  const handleSliderChange = values => {
    setPriceRange(values);
  };

  // Toggle category selection
  const toggleCategory = categoryId => {
    const updatedCategories = [...selectedCategories];
    const index = updatedCategories.indexOf(categoryId);

    if (index === -1) {
      updatedCategories.push(categoryId);
    } else {
      updatedCategories.splice(index, 1);
    }

    setSelectedCategories(updatedCategories);
  };

  // toggle rating selection
  const toggleRating = ratingId => {
    const updatedRatings = [...selectedRating];
    const index = updatedRatings.indexOf(ratingId);

    if (index === -1) {
      updatedRatings.push(ratingId);
    } else {
      updatedRatings.splice(index, 1);
    }

    setSelectedRating(updatedRatings);
  };

  // Function to toggle selected cuisine
  const toggleCuisine = cuisineId => {
    // Check if the cuisine is already selected
    if (selectedCuisines.includes(cuisineId)) {
      // If selected, remove it
      setSelectedCuisines(selectedCuisines.filter(id => id !== cuisineId));
    } else {
      // If not selected, add it
      setSelectedCuisines([...selectedCuisines, cuisineId]);
    }
  };

  const renderCuisinesItem = ({item}) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedCuisines.includes(item.id)
          ? COLORS.primary
          : 'transparent',
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
      }}
      onPress={() => toggleCuisine(item.id)}>
      <Text
        style={{
          color: selectedCuisines.includes(item.id)
            ? COLORS.white
            : COLORS.primary,
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Category item
  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedCategories.includes(item.id)
          ? COLORS.primary
          : 'transparent',
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
      }}
      onPress={() => toggleCategory(item.id)}>
      <Text
        style={{
          color: selectedCategories.includes(item.id)
            ? COLORS.white
            : COLORS.primary,
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRatingItem = ({item}) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedRating.includes(item.id)
          ? COLORS.primary
          : 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 6,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => toggleRating(item.id)}>
      <View style={{marginRight: 6}}>
        <FontAwesome
          name="star"
          size={14}
          color={
            selectedRating.includes(item.id) ? COLORS.white : COLORS.primary
          }
        />
      </View>
      <Text
        style={{
          color: selectedRating.includes(item.id)
            ? COLORS.white
            : COLORS.primary,
        }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        {renderHeader()}
        <View style={[styles.searchBarContainer]}>
          <Image
            source={icons.search2}
            resizeMode="contain"
            style={styles.searchIcon}
          />

          <TextInput
            ref={inputRef}
            placeholder="search"
            selectionColor="black"
            // placeholderTextColor="black"
            style={[styles.searchInput]}
            // value={currentInput}
            onChangeText={text => setCurrentInput(text)}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            blurOnSubmit={true}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={580}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              borderTopRightRadius: 32,
              borderTopLeftRadius: 32,
              height: 580,
              backgroundColor: COLORS.white,
              alignItems: 'center',
            },
          }}>
          <Text
            style={[
              styles.bottomTitle,
              {
                color: COLORS.greyscale900,
              },
            ]}>
            Filter
          </Text>
          <View style={styles.separateLine} />
          <View style={{width: SIZES.width - 32}}>
            <Text
              style={[
                styles.sheetTitle,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              Category
            </Text>
            <FlatList
              data={categories}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={renderCategoryItem}
            />
            <Text
              style={[
                styles.sheetTitle,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              Filter
            </Text>
            <MultiSlider
              values={priceRange}
              sliderLength={SIZES.width - 32}
              onValuesChange={handleSliderChange}
              min={0}
              max={100}
              step={1}
              allowOverlap={false}
              snapped
              minMarkerOverlapDistance={40}
              customMarker={CustomSliderHandle}
              selectedStyle={{backgroundColor: COLORS.primary}}
              unselectedStyle={{backgroundColor: 'lightgray'}}
              containerStyle={{height: 40}}
              trackStyle={{height: 3}}
            />

            <Text
              style={[
                styles.sheetTitle,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              Cuisines
            </Text>

            <FlatList
              data={cuisines}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={renderCuisinesItem}
            />

            <Text
              style={[
                styles.sheetTitle,
                {
                  color: COLORS.greyscale900,
                },
              ]}>
              Rating
            </Text>
            <FlatList
              data={ratings}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={renderRatingItem}
            />
          </View>

          <View style={styles.separateLine} />

          <View style={styles.bottomContainer}>
            <Button
              title="Reset"
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
              title="Filter"
              filled
              style={styles.logoutButton}
              onPress={() => refRBSheet.current.close()}
            />
          </View>
        </RBSheet>
      </View>

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
          navigation.navigate('Login');
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchBarContainer: {
    // width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    // padding: 16,
    borderRadius: 12,
    height: 54,

    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  searchIcon: {
    height: 24,
    tintColor: COLORS.gray,
    width: 24,
    marginLeft: 10,
  },
  searchInput: {
    fontSize: 18,

    marginHorizontal: 5,
    paddingHorizontal: 2,
    width: '100%',
    color: 'black',
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

export default Search;
