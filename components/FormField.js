import React from 'react';
import {useFormikContext} from 'formik';

import TextInput from './FormTextInput';
import ErrorMessage from './ErrorMessage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

function AppFormField({name, width,height, icon,FiledIconType,multiline, comment,keyboardType, onPressIn, ...otherProps}) {
  const {setFieldTouched, handleChange, errors, touched, values} =
    useFormikContext();

  return (
    <View style={{ marginBottom: 10, width: '100%' }}>
      <TextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        comment={comment}
        numberOfLines={4}
        value={values[name]}
        width={width}
        height={height}
        multiline={multiline}
        keyboardType={keyboardType}
        onPressIn={onPressIn}
        {...otherProps}
      />
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={'grey'}
          style={{
            position: 'absolute',
            top: 25, // Adjust the top position to align the icon with the input
            left: 10,
          }}
        />
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

export default AppFormField;
