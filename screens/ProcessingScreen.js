import * as React from "react";
import { Text, styles1heet, View, Image,TouchableOpacity,ActivityIndicator  } from "react-native";


const getstyles1 = (firstCardColor, secondCardColor, thirdCardColor) =>
  StyleSheet.create({
    cash: {
      marginLeft: 16,
      color: "black",
    },
   
 
  buttonShadowBox: {
    justifyContent: "center",
    shadowOpacity: 1,
    elevation: 12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    alignItems: "center",
    flexDirection: "row",
  },
  buttonIconLayout: {
    height: 42,
    width: 42,
    borderRadius: 22,
  },
  cardSpaceBlock: {
    paddingBottom: 24,
    paddingRight: 16,
    paddingTop: 24,
    paddingLeft: 24,
    alignItems: "center",
    flexDirection: "row",
    width: 345,
    borderRadius: 30,
  },
  cashTypo: {
    textAlign: "left",
    marginLeft: 16,
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    fontWeight: "600",
    flex: 1,
  },

 

 
  buttonIcon1: {
    opacity: 0,
    backgroundColor: "#fff",
    height: 42,
    width: 42,
    borderRadius: 22,
  },
  title: {
    top: 54,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: 345,
    left: 24,
    position: "absolute",
  },
 
  cardPayment: {
    borderColor: "#e9eaeb",
    paddingBottom: 24,
    paddingRight: 16,
    paddingTop: 24,
    paddingLeft: 24,
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: firstCardColor,
    marginBottom:20
  },
  cardPayment1: {
    borderColor: "#e9eaeb",
    paddingBottom: 24,
    paddingRight: 16,
    paddingTop: 24,
    paddingLeft: 24,
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor:secondCardColor,
    marginBottom:20
  },
  cardPayment2: {
    borderColor: "#e9eaeb",
    paddingBottom: 24,
    paddingRight: 16,
    paddingTop: 24,
    paddingLeft: 24,
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: thirdCardColor,
  },
  paymentLogoIcon: {
    overflow: "hidden",
  },
 
 
  space: {
    alignSelf: "stretch",
    backgroundColor: "#d9d9d9",
    height: 40,
    marginTop: 12,
    opacity: 0,
  },
  list: {
    top: 112,
    height: 740,
    left: 24,
    position: "absolute",
  },
  next: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    marginLeft: -178.5,
    top: 759,
    shadowColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 28,
    backgroundColor: "black",
    height: 53,
    paddingHorizontal: 22,
    paddingVertical: 0,
    width: 345,
    shadowOpacity: 1,
    elevation: 12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    left: "50%",
    position: "absolute",
  },
  });


const ProcessingScreen = ({navigation}) => {
    const [showFirstIndicator, setShowFirstIndicator] = React.useState(true);
    const [showSecondIndicator, setShowSecondIndicator] = React.useState(false);
    const [showThirdIndicator, setShowThirdIndicator] = React.useState(false);
    const [showFirstTick, setShowFirstTick] = React.useState(false);
    const [showSecondTick, setShowSecondTick] = React.useState(false);
    const [showThirdTick, setShowThirdTick] = React.useState(false);
    const [firstCardColor, setFirstCardColor] = React.useState('red');
    const [secondCardColor, setSecondCardColor] = React.useState('red');
    const [thirdCardColor, setThirdCardColor] = React.useState('red');
  const styles1 = getstyles1(firstCardColor, secondCardColor, thirdCardColor);

    React.useEffect(() => {
      const timeout1 = setTimeout(() => {
        setShowFirstIndicator(false);
        setShowFirstTick(true);
        setFirstCardColor('grey'); // Set the first card color to grey
      }, 5000);
    
      const timeout2 = setTimeout(() => {
        setShowSecondIndicator(true);
      }, 5000);
    
      const timeout3 = setTimeout(() => {
        setShowSecondIndicator(false);
        setShowSecondTick(true);
        setSecondCardColor('grey'); // Set the second card color to grey
      }, 10000);
    
      const timeout4 = setTimeout(() => {
        setShowThirdIndicator(true);
      }, 10000);
    
      const timeout5 = setTimeout(() => {
        setShowThirdIndicator(false);
        setShowThirdTick(true);
        navigation.navigate("PaymentMethods"); // Navigate to the PaymentMethods screen
      }, 15000);
    
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
        clearTimeout(timeout5);
      };
    }, []);


  return (
    <View style={styles1.payment}>
    
      <View style={styles1.title}>
        
        <View style={[styles1.buttonIcon1, styles1.buttonIconLayout]} />
      </View>
      <View style={styles1.list}>
        <View style={[styles1.cardPayment, styles1.cardSpaceBlock]}>
          <Image
            style={styles1.iconLayout}
            resizeMode="cover"
           // source={require("../assets/money-1.png")}
          />
          <Text style={[styles1.cash, styles1.cashTypo]}>Sending request to resturant...</Text>
          {showFirstIndicator ? <ActivityIndicator color="black" style={{ marginLeft: 8 }} /> : showFirstTick ? <Image source={require("../assets/images/ic_select.png")} style={{ width: 20, height: 20 }} /> : null}

          <Image
            style={[styles1.outlineVideoAudioSound, styles1.iconLayout]}
            resizeMode="cover"
           // source={require("../assets/outline--video-audio-sound--record.png")}
          />
        </View>
        <View style={[styles1.cardPayment1, styles1.cardSpaceBlock]}>
          <Image
            style={[styles1.paymentLogoIcon, styles1.iconLayout]}
            resizeMode="cover"
         //   source={require("../assets/payment-logo.png")}
          />
          <Text style={[styles1.cash, styles1.cashTypo]}>Finding your nearby driver...</Text>
          {showSecondIndicator ? <ActivityIndicator color="black" style={{ marginLeft: 8 }} /> : showSecondTick ? <Image source={require("../assets/images/ic_select.png")} style={{ width: 20, height: 20 }} /> : null}

          <Image
            style={[styles1.outlineVideoAudioSound, styles1.iconLayout]}
            resizeMode="cover"
         //   source={require("../assets/outline--video-audio-sound--record.png")}
          />
        </View>
        <View style={[styles1.cardPayment2, styles1.cardSpaceBlock]}>
          <Image
            style={[styles1.paymentLogoIcon, styles1.iconLayout]}
            resizeMode="cover"
          //  source={require("../assets/payment-logo1.png")}
          />
          <Text style={[styles1.cash, styles1.cashTypo]} >Add payment method</Text>
          {/* {showThirdIndicator ? <ActivityIndicator color="black" style={{ marginLeft: 8 }} /> : showThirdTick ? <Image source={require("../assets/images/ic_select.png")} style={{ width: 20, height: 20 }} /> : null} */}

         <Image
            style={[styles1.outlineVideoAudioSound, styles1.iconLayout]}
            resizeMode="cover"
          //  source={require("../assets/outline--video-audio-sound--record.png")}
          />
        </View>
      
        <View style={styles1.space} />
      </View>
      {/* <TouchableOpacity style={[styles1.button, styles1.buttonShadowBox]}  onPress={() => { navigation.navigate("PaymentMethods") }}>
        <Text style={styles1.next}>Pay now</Text>
      </TouchableOpacity> */}
    </View>
  );
};



export default ProcessingScreen;
