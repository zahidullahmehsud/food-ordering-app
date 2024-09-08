import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants'

const Button = (props) => {
    const filledBgColor = props.color || COLORS.primary
    const outlinedBgColor = COLORS.white
    const bgColor = props.filled ? filledBgColor : outlinedBgColor
    const textColor = props.filled
        ? COLORS.white || props.textColor
        : props.textColor || COLORS.primary
    const isLoading = props.isLoading || false

    return (
        <TouchableOpacity
            style={{
                ...styles.btn,
                ...{ backgroundColor: bgColor },
                ...props.style,
                ...props.disabled && styles.disabledBtn,
            }}
            onPress={props.onPress}
            disabled={props.disabled} 
        >
            {isLoading && isLoading == true ? (
                <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
                <Text style={{ fontSize: 18, fontFamily: "Urbanist SemiBold", ...{ color: textColor } }}>
                    {props.title}
                </Text>
            )}
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        marginBottom: 20,
      },
      disabledBtn: {
        backgroundColor: COLORS.disabled, // Use the 'disabled' color from the COLORS constant
      },
    
})

export default Button