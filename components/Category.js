import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';

const Category = ({ name, icon, backgroundColor, onPress,description }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPress}
                style={[styles.iconContainer, {
                    backgroundColor: backgroundColor
                }]}>
                <Image
                    source={icon}
                    resizeMode='contain'
                    style={styles.icon}
                />
            </TouchableOpacity>
            <Text style={[styles.name, {
                color: COLORS.greyscale900
            }]}>{name}</Text>

<Text style={[styles.description, {
                color: COLORS.greyscale900
            }]}>{description}</Text>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 12,
        width: (SIZES.width - 32) / 4
    },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        shadowColor:'black',
        textShadowOffset: {
            height:1,
            width:1
        },
        shadowOpacity: 0.9,
       // elevation:9
    },
    icon: {
        height: 35,
        width: 35
    },
    name: {
        fontSize: 12,
        fontFamily: "Urbanist Medium",
        color: COLORS.black
    },
description: {
    fontSize: 10,
    fontFamily: "Urbanist Medium",
    color: COLORS.black,
    marginTop:15,
    }
})

export default Category