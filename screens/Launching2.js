import React, { useEffect, useRef } from 'react';
import { Text, ImageBackground, StyleSheet, View , Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS,images } from '../constants';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
const Onboarding1 = () => {
  const navigation = useNavigation();
  const progress = useRef(new Animated.Value(0)).current;
  // add useeffect
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Onboarding1');
    }, 1000);

    Animated.timing(progress, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    return () => {
      clearTimeout(timeout);
    };
  }, []); // run only once after component mounts

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: '#FF6347' }]}>
      <View style={[styles.container, { backgroundColor: '#FF6347' }]}>
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Image source={images.startLogo} resizeMode="contain" style={styles.logo} />
          <Text style={{fontSize:40,fontWeight:'800',color:'white'}}>SPEEDY CHOW</Text>
          <Text style={{fontSize:18,fontWeight:'300',color:'white',marginTop:12}}>Version 2.1.0</Text>
      </View>
      <View style={{justifyContent:'center'}}>
        <Text style={{fontSize:22,fontWeight:'500',color:'white',textAlign:'center',padding:23,margin:6,lineHeight:34}}>As fast as lightning, as delicious as thunder!</Text>
      </View>
      <View style={styles.progressBar}>
          <Animated.View
            style={[styles.innerBar, { width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['80%', '100%'],
            }) }]}
          />
        </View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: '#FF6347',
  },
  container: {
    flex:1,
    backgroundColor: '#FF6347',
    padding: 16,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#9290C3',
    marginTop: 10,
  },
  innerBar: {
    height: '100%',
    backgroundColor: 'white',
  },
  logo: {
    width: 230,
    height: 200,
    marginRight:30
  },
})

export default Onboarding1;