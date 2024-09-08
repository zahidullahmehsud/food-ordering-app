import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';

const FoodMenuCard = ({
    id,
    name,
    image,
    price,
    isBestSeller,
    isSelected,
    onSelect
}) => {

    return (
        <TouchableOpacity
            onPress={() => onSelect(id)}
            style={[styles.container, {
                backgroundColor: COLORS.white,
                borderColor: isSelected ? COLORS.primary : "transparent",
                borderWidth: isSelected ? 2 : 0,
            }]}>
            <Image
                source={image}
                resizeMode='cover'
                style={styles.image}
            />
            {
                isBestSeller && isBestSeller == true && (
                    <View style={styles.reviewContainer}>
                        <Text style={styles.rating}>Best Seller</Text>
                    </View>
                )
            }
            <Text style={[styles.name, {
                color: COLORS.greyscale900,
            }]}>{name}</Text>
            <View style={styles.bottomPriceContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: (SIZES.width - 32) / 2 - 12,
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
        marginBottom: 12,
        marginRight: 16
    },
    image: {
        width: "100%",
        height: 140,
        borderRadius: 16
    },
    name: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
        marginVertical: 4
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
    price: {
        fontSize: 16,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.primary,
        marginRight: 8
    },
    reviewContainer: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 68,
        height: 26,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rating: {
        fontSize: 12,
        fontFamily: "Urbanist Medium",
        color: COLORS.white,
        marginLeft: 4
    },
    viewContainer: {
        flexDirection: "row",
        alignItems: "center",
    }
})

export default FoodMenuCard;
