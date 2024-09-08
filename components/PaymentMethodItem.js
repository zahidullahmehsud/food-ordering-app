import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';

const PaymentMethodItem = ({ checked, onPress, title, icon, tintColor,description }) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container,
            Platform.OS === 'android' ? styles.androidShadow : styles.iosShadow,
            { backgroundColor: COLORS.white }]}>
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Image
                        source={icon}
                        resizeMode='contain'
                        style={[styles.icon, {
                            tintColor: tintColor
                        }]}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{description}</Text>
                </View>
            </View>
            <View style={styles.checkboxContainer}>
                <TouchableOpacity>
                    <View style={styles.roundedChecked}>
                        {checked && <View style={styles.roundedCheckedCheck} />}
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        minHeight: 74,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    icon: {
        height: 26,
        width: 26,
    },
    title: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
    },
    description: {
        fontSize: 14,
        fontFamily: "Urbanist Regular",
        color: COLORS.greyscale900,
        marginTop: 4,
    },
    checkboxContainer: {
        justifyContent: 'center',
        paddingLeft: 12,
    },
    roundedChecked: {
        width: 20,
        height: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundedCheckedCheck: {
        height: 10,
        width: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 999,
    },
    androidShadow: {
        elevation: 4,
    },
    iosShadow: {
        shadowColor: 'rgba(4, 6, 15, 0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
});

export default PaymentMethodItem;