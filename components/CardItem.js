import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../constants';
import { TouchableOpacity } from 'react-native';

const CardItem = ({name, value, icon}) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={styles.iconContainer}>{icon && icon}</View>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(CardItem);

const styles = StyleSheet.create({
  container: {
    marginTop:10,
    height: 150,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(27, 172, 75, 0.8)",
    borderRadius:20,
  },
  iconContainer:{
    backgroundColor:"rgba(0,0,0,0.1)",
    height:50,
    width:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:100
  },
  nameText:{
    marginTop:10,
    color:COLORS.white,
    fontFamily: "Urbanist Bold",
  },
  valueText:{
    marginTop:5,
    color:COLORS.white,
    fontFamily: "Urbanist Bold",
  }
});
