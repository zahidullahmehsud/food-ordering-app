// import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import React, { useState } from 'react';
// import { COLORS, icons } from '../constants';
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const VerticalFoodCard = ({
//     name,
//     image,
//     distance,
//     price,
//     fee,
//     rating,
//     numReviews,
//     onPress,
//     code,
//     vendorName,
//     onFavoritePress,
//     isFavorite
// }) => {
//     const [isFavourite, setIsFavourite] = useState(false);

//     return (
//         <TouchableOpacity
//             onPress={() => onPress({ itemCode: code })}
//             style={[styles.container, { backgroundColor: COLORS.white }]}
//         >
//             <Image
//                 source={{ uri: image }}
//                 resizeMode='cover'
//                 style={styles.image}
//                 onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
//             />
//             {/* <View style={styles.reviewContainer}>
//                 <Text style={styles.rating}>PROMO</Text>
//             </View> */}
//             <Text style={[styles.name, {
//                 color: COLORS.greyscale900,
//             }]}>{name}</Text>

//             {/* <View style={styles.viewContainer}>
//                 <Text style={[styles.location, {
//                     color: COLORS.grayscale700,
//                 }]}>{distance}  | {" "}</Text>
//                 <FontAwesome name="star" size={wp('3.5%')} color="rgb(250, 159, 28)" />
//                 <Text style={[styles.location, {
//                     color: COLORS.grayscale700,
//                 }]}>{" "}{rating}  ({numReviews})</Text>
//             </View> */}
//             <View style={styles.bottomContainer}>
//                 <Text style={styles.vendorName}>{vendorName}</Text>
//                 {/* <View style={styles.priceContainer}>
//                     <Text style={styles.price}>{price} {"$"}</Text>
//                     <Text style={styles.location}>{""}| {" "}</Text>
//                     <Image
//                         source={icons.moto}
//                         resizeMode='contain'
//                         style={styles.motoIcon}
//                     />
//                     <Text style={styles.location}>{fee}</Text>
//                 </View> */}
//             </View>
//             <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
//                 <Image
//                     source={isFavorite ? icons.heart2 : icons.heart2Outline}
//                     resizeMode='contain'
//                     style={styles.heartIcon}
//                 />
//             </TouchableOpacity>
//         </TouchableOpacity>
//     )
// };

// const styles = StyleSheet.create({
//     container: {
//         width: wp('45%'),
//         backgroundColor: COLORS.white,
//         borderRadius: wp('4%'),
//         marginBottom: hp('1.5%'),
//         marginRight: wp('2%'),
//         marginLeft: wp('1%'),
//         marginTop: wp('1%'),
//         padding: wp('2%'),
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.23,
//         shadowRadius: 2.62,
//         elevation: 4,
//         position: 'relative',
//     },
//     image: {
//         width: '100%',
//         height: hp('18%'),
//         borderRadius: wp('2%'),
//     },
//     name: {
//         fontSize: wp('4%'),
//         fontFamily: "Urbanist-Bold",
//         color: COLORS.greyscale900,
//         marginVertical: hp('1%'),
//     },
//     vendorName: {
//         fontSize: wp('3%'),
//         fontFamily: "Urbanist-Regular",
//         color: COLORS.grayscale700,
//     },
//     location: {
//         fontSize: wp('3%'),
//         fontFamily: "Urbanist-Regular",
//         color: COLORS.grayscale700,
//         marginVertical: hp('0.5%'),
//     },
//     bottomContainer: {
//         width: "100%",
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: hp('0.5%'),
//         marginTop: 'auto',
//         paddingBottom:hp(4.5)

//     },
//     priceContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     price: {
//         fontSize: wp('4%'),
//         fontFamily: "Urbanist-SemiBold",
//         color: COLORS.primary,
//         marginRight: wp('2%'),
//     },
//     favoriteButton: {
//         position: 'absolute',
//         bottom: wp('2%'),
//         right: wp('2%'),
//         padding: wp('2%'),
//     },
//     heartIcon: {
//         width: wp('5%'),
//         height: wp('5%'),
//         tintColor: COLORS.red,
//     },
//     reviewContainer: {
//         position: "absolute",
//         top: hp('2%'),
//         left: wp('4%'),
//         width: wp('14%'),
//         height: hp('2.5%'),
//         borderRadius: wp('1.5%'),
//         backgroundColor: COLORS.primary,
//         zIndex: 999,
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     rating: {
//         fontSize: wp('3%'),
//         fontFamily: "Urbanist-SemiBold",
//         color: COLORS.white,
//         marginLeft: wp('1%'),
//     },
//     viewContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     motoIcon: {
//         height: wp('4.5%'),
//         width: wp('4.5%'),
//         tintColor: COLORS.primary,
//         marginRight: wp('1%'),
//     }
// });

// export default VerticalFoodCard;

import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {COLORS, icons} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const VerticalFoodCard = ({
  name,
  image,
  distance,
  price,
  fee,
  rating,
  numReviews,
  onPress,
  code,
  vendorName,
  onFavoritePress,
  isFavorite,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress({itemCode: code})}
      style={[styles.container, {backgroundColor: COLORS.white}]}>
      <Image
        source={{uri: image}}
        resizeMode="cover"
        style={styles.image}
        onError={e => console.log('Image load error:', e.nativeEvent.error)}
      />
      <Text style={[styles.name, {color: COLORS.greyscale900}]}>{name}</Text>

      <View style={styles.bottomContainer}>
        <Text style={styles.vendorName}>{vendorName}</Text>
      </View>
      <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
        <Image
          source={isFavorite ? icons.heart2 : icons.heart2Outline}
          resizeMode="contain"
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('45%'),
    backgroundColor: COLORS.white,
    borderRadius: wp('4%'),
    marginBottom: hp('1.5%'),
    marginRight: wp('2%'),
    marginLeft: wp('1%'),
    marginTop: wp('1%'),
    padding: wp('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
    position: 'relative',
  },
  image: {
    resizeMode: 'contain',
    height: hp('12%'),
    borderRadius: wp('2%'),
  },
  name: {
    fontSize: wp('4%'),
    fontFamily: 'Urbanist-Bold',
    color: COLORS.greyscale900,
    marginVertical: hp('1%'),
  },
  vendorName: {
    fontSize: wp('3%'),
    fontFamily: 'Urbanist-Regular',
    color: COLORS.grayscale700,
  },
  bottomContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
    marginTop: 'auto',
    paddingBottom: hp(4.5),
  },
  favoriteButton: {
    position: 'absolute',
    bottom: wp('2%'),
    right: wp('2%'),
    padding: wp('2%'),
  },
  heartIcon: {
    width: wp('5%'),
    height: wp('5%'),
    tintColor: COLORS.red,
  },
});

export default VerticalFoodCard;
