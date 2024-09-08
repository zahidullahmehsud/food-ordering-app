import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';

const SubHeaderItem = ({ title, onPress, navTitle }) => {

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { 
                 color: COLORS.greyscale900
            }]}>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.navTitle}>{navTitle}</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 16
    },
    title: {
        fontSize: 18,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.black,
    },
    navTitle: {
        fontSize: 16,
        fontFamily: "Urbanist Medium",
        color: COLORS.primary,
        marginLeft: 12,
    }
})

export default SubHeaderItem