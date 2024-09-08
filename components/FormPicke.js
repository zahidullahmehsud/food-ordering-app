// FormPicker.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import ErrorMessage from './ErrorMessage';

function FormPicker({ name, items, placeholder, ...otherProps }) {
  const { setFieldValue, errors, touched, values } = useFormikContext();

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={values[name]}
        onValueChange={(itemValue) => setFieldValue(name, itemValue)}
        {...otherProps}
      >
        <Picker.Item label={placeholder} value="" />
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
  },
});

export default FormPicker;