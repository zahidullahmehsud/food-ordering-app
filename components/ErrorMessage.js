import React from 'react';
import {StyleSheet,Text} from 'react-native';


function ErrorMessage({error, visible}) {
  if (!visible || !error) return null;

  return <Text style={styles.error}>{error}</Text>;
}

const styles = StyleSheet.create({
  error: {color: 'red',fontSize:12,fontStyle:'italic',fontWeight:'600',marginLeft:13},
});

export default ErrorMessage;
