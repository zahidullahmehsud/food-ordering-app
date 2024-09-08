import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';

const MenuCard = ({
    id,
    name,
    image,
    price,
    isNew,
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
            <View style={styles.columnContainer}>
                {
                    isNew && isNew === true && (
                        <View style={styles.reviewContainer}>
                            <Text style={styles.rating}>NEW</Text>
                        </View>
                    )
                }
                <View style={styles.topViewContainer}>
                    <Text style={[styles.name, {
                        color: COLORS.greyscale900
                    }]}>{name}</Text>
                </View>

                <View style={styles.bottomViewContainer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{price}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: SIZES.width - 32,
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
        marginBottom: 12,
        height: 112,
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 16
    },
    columnContainer: {
        flexDirection: "column",
        marginLeft: 12,
        flex: 1
    },
    name: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
        marginVertical: 8,
        marginRight: 40
    },
    priceContainer: {
        flexDirection: "column",
        marginVertical: 4,
    },
    reviewContainer: {
        width: 46,
        height: 20,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    topViewContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: SIZES.width - 164
    },
    bottomViewContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 2
    },
    viewContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    price: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.primary,
        marginRight: 8
    },
    rating: {
        fontSize: 12,
        fontFamily: "Urbanist Medium",
        color: COLORS.white,
        marginLeft: 4
    }
});

export default MenuCard