import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const NearResturantCard = ({
    name,
    image,
    distance,
    price,
    fee,
    rating,
    numReviews,
    onPress,
    onFavoritePress,
    isFavorite
}) => {
    const [isFavourite, setIsFavourite] = useState(false);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, {
                backgroundColor: COLORS.white
            }]}>
            <Image
                source={image}
                resizeMode='cover'
                style={styles.image}
            />
            {/* <View style={styles.reviewContainer}>
                <Text style={styles.rating}>PROMO</Text>
            </View> */}
            <Text style={[styles.name, {
                color: COLORS.greyscale900,
            }]}>{name}</Text>



<View style={styles.infoContainer}>
                <Text style={styles.infoText}>Distance: {distance}</Text>
                <Text style={styles.infoText}>Delivery: ${price}</Text>
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
                    <Image
                        source={isFavorite ? icons.heart2 : icons.heart2Outline}
                        resizeMode='contain'
                        style={styles.heartIcon}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>











        //     <View style={styles.viewContainer}>
        //         <Text style={[styles.location, {
        //             color: COLORS.grayscale700,
        //         }]}>Distance: {distance}</Text>
        //         <View style={{flexDirection:'row',justifyContent:'space-evenly',marginVertical:5}}>
        //             <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" />
        //         <Text style={[styles.location, {
        //             color: COLORS.grayscale700,
        //         }]}>{" "}{rating}</Text>
        //         </View>
                
        //     </View>
        //     <View style={styles.bottomPriceContainer}>
        //         <View style={styles.priceContainer}>
        //             <Text style={styles.price}>Delivery Charges: {price } {"$"}</Text>
        //             <Text style={styles.location}>{""}| {" "}</Text>
        //             <Image
        //                 source={icons.moto}
        //                 resizeMode='contain'
        //                 style={styles.motoIcon}
        //             />
        //             <Text style={styles.location}>{fee}</Text>
        //         </View>
        //         <TouchableOpacity onPress={onFavoritePress}>
        //         <Image
        //             source={isFavorite ? icons.heart2 : icons.heart2Outline}
        //             resizeMode='contain'
        //             style={styles.heartIcon}
        //         />
        //     </TouchableOpacity>
        //     </View>
        // </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: wp('45%'),
        backgroundColor: COLORS.white,
        borderRadius: wp('4%'),
        marginBottom: hp('1.5%'),
        marginRight: wp('2%'),
        padding: wp('2%'),
        marginLeft:wp(1),
        marginTop:wp(1),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: hp('15%'),
        borderRadius: wp('2%'),
    },
    name: {
        fontSize: wp('4%'),
        fontFamily: "Urbanist-Bold",
        color: COLORS.greyscale900,
        marginVertical: hp('1%'),
    },

    infoContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    infoText: {
        fontSize: wp('3%'),
        fontFamily: "Urbanist-Regular",
        color: COLORS.grayscale700,
        marginBottom: hp('0.5%'),
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      
    },
    favoriteButton: {
        padding: wp('2%'),
    },
    location: {
        fontSize: 12,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700,
    },
    bottomPriceContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    // price: {
    //     fontSize: 16,
    //     fontFamily: "Urbanist SemiBold",
    //     color: COLORS.primary,
    //     marginRight: 8
    // },
    price: {
        fontSize: 12,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700,
        marginRight: 8
    },
    duration: {
        fontSize: 10,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.primary,
        marginRight: 8
    },
    durationText: {
        fontSize: 14,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700
    },
    heartIcon: {
        width: wp('5%'),
        height: wp('5%'),
        tintColor: COLORS.red,
    },
    reviewContainer: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 56,
        height: 20,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rating: {
        fontSize: 12,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.white,
        marginLeft: 4
    },
    viewContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:'space-between'
    },
    motoIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.primary,
        marginRight: 4
    }
})

export default NearResturantCard