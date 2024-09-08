// SubmitButton.js
import React from 'react';
import { useFormikContext } from 'formik';
import Button from './Button';

function SubmitButton(props) {
  const { handleSubmit, isValid, dirty } = useFormikContext();

  return (
    <Button
      title={props.title}
      onPress={handleSubmit}
      isLoading={props.isLoading}
      disabled={!isValid || !dirty || props.isLoading}
      {...props}
    />
  );
}

export default SubmitButton;