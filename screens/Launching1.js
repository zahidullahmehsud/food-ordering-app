
import React, { useEffect, useRef } from 'react';
import { Text, ImageBackground, StyleSheet, View, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding1 = () => {
  const navigation = useNavigation();
  const progress = useRef(new Animated.Value(0)).current;
  const iconTranslateX = useRef(new Animated.Value(-50)).current; // Start off-screen
  const textTranslateX = useRef(new Animated.Value(-50)).current; // Start off-screen
  const iconOpacity = useRef(new Animated.Value(0)).current; // Start invisible
  const textOpacity = useRef(new Animated.Value(0)).current; // Start invisible

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Welcome');
    }, 5000); // Total time including all animations

    // Animate the logo and text from left (off-screen) to center and fade them in
    Animated.parallel([
      Animated.sequence([
        Animated.timing(iconTranslateX, {
          toValue: 0, // Center
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1, // Fully opaque
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(textTranslateX, {
          toValue: 0, // Center
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1, // Fully opaque
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Start the progress bar animation after 2 seconds
    setTimeout(() => {
      Animated.timing(progress, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }).start();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: '#FF6347' }]}>
      <View style={[styles.container, { backgroundColor: '#FF6347' }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View style={{ transform: [{ translateX: iconTranslateX }], opacity: iconOpacity }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={images.startLogo} resizeMode="contain" style={styles.logo} />
              <Text style={{ fontSize: 40, fontWeight: '800', color: 'white' }}>SPEEDY CHOW</Text>
              <Text style={{ fontSize: 18, fontWeight: '300', color: 'white', marginTop: 12 }}>Version 2.1.0</Text>
            </View>
          </Animated.View>
        </View>
        <Animated.View style={{ transform: [{ translateX: textTranslateX }], marginTop: 20, opacity: textOpacity }}>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: '500', color: 'white', textAlign: 'center', padding: 23, margin: 6, lineHeight: 34 }}>As fast as lightning, as delicious as thunder!</Text>
          </View>
        </Animated.View>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.innerBar, { width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }) }]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: '#FF6347',
  },
  container: {
    flex: 1,
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
    width: 200,
    height: 200,
  },
});

export default Onboarding1;

// =======
// import React, { useEffect, useRef } from 'react';
// import { Text, ImageBackground, StyleSheet, View , Animated, Image } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {COLORS, images} from '../constants';
// import {SafeAreaView} from 'react-native-safe-area-context';
// const Onboarding1 = () => {
//   const navigation = useNavigation();
//   const progress = useRef(new Animated.Value(0)).current;
//   const iconOpacity = useRef(new Animated.Value(0)).current;
//   const textOpacity = useRef(new Animated.Value(0)).current;
//   // add useeffect
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       navigation.navigate('Launching2');
//     }, 2500);

//     Animated.timing(progress, {
//       toValue: 1,
//       duration: 2500,
//       useNativeDriver: false,
//     }).start();

//     // Show the icon after 1 second
//     const iconTimeout = setTimeout(() => {
//       Animated.timing(iconOpacity, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }).start();
//     }, 800);



//      // Show the text after 1 second
//      const bottomText = setTimeout(() => {
//       Animated.timing(textOpacity, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }).start();
//     }, 1200);

//     return () => {
//       clearTimeout(timeout);
//       clearTimeout(iconTimeout);
//     };
//   }, []); // run only once after component mounts

//   return (
//     <SafeAreaView style={[styles.area, { backgroundColor: '#FF6347' }]}>
//       <View style={[styles.container, { backgroundColor: '#FF6347' }]}>
//       <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
//       <Animated.View style={{ opacity: iconOpacity }}>
//           <Image source={images.startLogo} resizeMode="contain" style={styles.logo} />
//         </Animated.View>
//       </View>
//       <Animated.View style={{ opacity: textOpacity }}>
//       <View style={{justifyContent:'center'}}>
//         <Text style={{fontSize:22,fontWeight:'500',color:'white',textAlign:'center',padding:23,margin:6,lineHeight:34}}>As fast as lightning, as delicious as thunder!</Text>
//       </View>
//       </Animated.View>
//       <View style={styles.progressBar}>
//           <Animated.View
//             style={[styles.innerBar, { width: progress.interpolate({
//               inputRange: [0, 1],
//               outputRange: ['0%', '80%'],
//             }) }]}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   )
// };

// const styles = StyleSheet.create({
//   area: {
//     flex: 1,
//     backgroundColor: '#FF6347',
//   },
//   container: {
//     flex:1,
//     backgroundColor: '#FF6347',
//     padding: 16,
//   },
//   progressBar: {
//     width: '100%',
//     height: 4,
//     backgroundColor: '#9290C3',
//     marginTop: 10,
//   },
//   innerBar: {
//     height: '100%',
//     backgroundColor: 'white',
//   },
//   logo: {
//     width: 200,
//     height: 200,
//   },
// })

// export default Onboarding1;
// >>>>>>> d53ce51a1be77bd336a0b56a5a6b8b5e8556e806
