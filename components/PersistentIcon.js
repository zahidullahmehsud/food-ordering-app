import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useIcon } from './IconContext';

const PersistentIcon = () => {
  const navigation = useNavigation();
  const { isIconPressable } = useIcon();

  const handlePress = () => {
    if (isIconPressable) {
      navigation.navigate('PaymentMethods');
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.iconContainer, !isIconPressable && styles.disabled]} 
      onPress={handlePress}
      disabled={!isIconPressable}
    >
      <Image
        source={require('/Foodu/assets/images/your-icon-image.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: hp('2%'),
    right: wp('5%'),
    zIndex: 1000,
  },
  icon: {
    width: wp('10%'),
    height: wp('10%'),
    resizeMode: 'contain',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default PersistentIcon;