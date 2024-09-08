import React from 'react';
import { Formik } from 'formik';

function AppForm({initialValues, onSubmit, validationSchema, children, key}) {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
        validationSchema={validationSchema}>
        {() => <>{children}</>}
      </Formik>
    );
  }
  
  export default AppForm;