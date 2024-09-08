import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

//import defaultStyles from '../config/style';
import { COLORS } from '../constants';
import { commonStyles } from '../styles/CommonStyles';

function AppTextInput({
  icon,
  height,
  width = '100%',
  comment,
  backgroundColor,
  borderRadius,
  iconLib,
  FiledIconType,
  borderColor,
  paddingLeft,
  inputStyle,
  keyboardType,
  onPressIn,
  ...otherProps
}) {
  return (
    <View
      style={[
        comment ? styles.textAreaContainer : styles.container,
        {
          width,
          height: height ? height : 50,
          borderRadius: borderRadius !== undefined ? borderRadius : 8,
          borderWidth: 1,
          paddingLeft: paddingLeft !== undefined ? paddingLeft : 30 ,
          borderColor: borderColor ? borderColor : '#dfe1e5',
          backgroundColor: backgroundColor ? backgroundColor : '#fff',
        },
      ]}>
      <TextInput
        placeholderTextColor={COLORS.gray}
        style={commonStyles.text}
        numberOfLines={1}
        keyboardType={keyboardType}
        onPressIn={onPressIn}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    // paddingLeft: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  textAreaContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 150,
    textAlignVertical: 'top',
    paddingLeft: 15,
    paddingVertical: 0,
    paddingTop: 20,
    paddingRight: 15,
    width: 200,
    color : '000000',
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default AppTextInput;
