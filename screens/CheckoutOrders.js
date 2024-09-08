import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useRef, useState,useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import OrderSummaryCard from '../components/OrderSummaryCard';
import Button from '../components/Button';

const CheckoutOrders = ({ navigation }) => {

  // return (
  //   <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
  //     <View style={[styles.container, { backgroundColor: COLORS.white }]}>
  //       <Header title="Checkout Orders" />
  //       <ScrollView
  //         contentContainerStyle={{
  //           backgroundColor: COLORS.tertiaryWhite,
  //           marginTop: 12
  //         }}
  //         showsVerticalScrollIndicator={false}>
  //         <View style={[styles.summaryContainer, {
  //           backgroundColor: COLORS.white,
  //         }]}>
  //           <Text style={[styles.summaryTitle, {
  //             color: COLORS.greyscale900
  //           }]}>Deliver To</Text>
  //           <View style={[styles.separateLine, {
  //             backgroundColor: COLORS.grayscale200
  //           }]} />
  //           <TouchableOpacity
  //             onPress={() => navigation.navigate("CheckoutOrdersAddress")}
  //             style={styles.addressContainer}>
  //             <View style={styles.addressLeftContainer}>
  //               <View style={styles.view1}>
  //                 <View style={styles.view2}>
  //                   <Image
  //                     source={icons.location2}
  //                     resizeMode='contain'
  //                     style={styles.locationIcon}
  //                   />
  //                 </View>
  //               </View>
  //               <View style={styles.viewAddress}>
  //                 <View style={styles.viewView}>
  //                   <Text style={[styles.homeTitle, {
  //                     color: COLORS.greyscale900
  //                   }]}>Home</Text>
  //                   <View style={styles.defaultView}>
  //                     <Text style={styles.defaultTitle}>Default</Text>
  //                   </View>
  //                 </View>
  //                 <Text style={[styles.addressTitle, {
  //                   color: COLORS.grayscale700
  //                 }]}>
  //                   Time Square NYC, Nanhattan</Text>
  //               </View>
  //             </View>
  //             <Image
  //               source={icons.arrowRight}
  //               resizeMode='contain'
  //               style={[styles.arrowRightIcon, {
  //                 tintColor: COLORS.greyscale900
  //               }]}
  //             />
  //           </TouchableOpacity>
  //         </View>
  //         <View style={[styles.summaryContainer, {
  //           backgroundColor: COLORS.white,
  //         }]}>
  //           <View style={styles.orderSummaryView}>
  //             <Text style={[styles.summaryTitle, {
  //               color: COLORS.greyscale900
  //             }]}>Order Summary</Text>
  //             <TouchableOpacity style={styles.addItemView}>
  //               <Text style={styles.addItemText}>Add Items</Text>
  //             </TouchableOpacity>
  //           </View>
  //           <View style={[styles.separateLine, {
  //             backgroundColor:  COLORS.grayscale200
  //           }]} />
  //           <OrderSummaryCard
  //             name="Mixed Vegetable Sal..."
  //             image={images.salad1}
  //             price="$12.00"
  //             onPress={() => console.log("Clicked")}
  //           />
  //           <View style={[styles.separateLine, {
  //             backgroundColor: COLORS.grayscale200
  //           }]} />
  //           <OrderSummaryCard
  //             name="Special Pasta Salad"
  //             image={images.salad2}
  //             price="$8.00"
  //             onPress={() => console.log("Clicked")}
  //           />
  //           <View style={[styles.separateLine, {
  //             backgroundColor: COLORS.grayscale200
  //           }]} />
  //           <OrderSummaryCard
  //             name="Fresh Avocado Juice"
  //             image={images.salad3}
  //             price="$4.00"
  //             onPress={() => console.log("Clicked")}
  //           />
  //         </View>
  //         <View style={[styles.summaryContainer, {
  //           backgroundColor: COLORS.white,
  //         }]}>
  //           <TouchableOpacity
  //             onPress={() => navigation.navigate("PaymentMethods")}
  //             style={styles.viewItemTypeContainer}>
  //             <View style={styles.viewLeftItemTypeContainer}>
  //               <Image
  //                 source={icons.wallet2}
  //                 resizeMode='contain'
  //                 style={styles.walletIcon}
  //               />
  //               <Text style={[styles.viewItemTypeTitle, {
  //                 color: COLORS.grayscale700,
  //               }]}>Payment Methods</Text>
  //             </View>
  //             <Image
  //               source={icons.arrowRight}
  //               resizeMode='contain'
  //               style={styles.arrowRightIcon}
  //             />
  //           </TouchableOpacity>
  //           <View style={[styles.separateLine, {
  //             backgroundColor: COLORS.grayscale200
  //           }]} />
  //           <TouchableOpacity
  //             onPress={() => navigation.navigate("AddPromo")}
  //             style={styles.viewItemTypeContainer}>
  //             <View style={styles.viewLeftItemTypeContainer}>
  //               <Image
  //                 source={icons.discount}
  //                 resizeMode='contain'
  //                 style={styles.walletIcon}
  //               />
  //               <Text style={[styles.viewItemTypeTitle, {
  //                 color: COLORS.grayscale700,
  //               }]}>Get Discounts</Text>
  //             </View>
  //             <Image
  //               source={icons.arrowRight}
  //               resizeMode='contain'
  //               style={styles.arrowRightIcon}
  //             />
  //           </TouchableOpacity>
  //         </View>

  //         <View style={[styles.summaryContainer, {
  //           backgroundColor: COLORS.white,
  //         }]}>
  //           <View style={styles.view}>
  //             <Text style={[styles.viewLeft, {
  //               color: COLORS.grayscale700
  //             }]}>Subtitle</Text>
  //             <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>$24.00</Text>
  //           </View>
  //           <View style={styles.view}>
  //             <Text style={[styles.viewLeft, {
  //               color: COLORS.grayscale700
  //             }]}>Delivery Fee</Text>
  //             <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>$2.00</Text>
  //           </View>
  //           <View style={[styles.separateLine, {
  //             backgroundColor: COLORS.grayscale200
  //           }]} />
  //           <View style={styles.view}>
  //             <Text style={[styles.viewLeft, {
  //               color: COLORS.grayscale700
  //             }]}>Total</Text>
  //             <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>$26.00</Text>
  //           </View>
  //         </View>
  //       </ScrollView>
  //       <Button
  //         title="Place Order - $26.00"
  //         filled
  //         onPress={() => navigation.navigate("CheckoutOrdersCompleted")}
  //         style={styles.placeOrderButton}
  //       />
  //     </View>
  //   </SafeAreaView>
  // )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  summaryContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: 12,
    marginTop: 12,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  view1: {
    height: 52,
    width: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
  },
  view2: {
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  locationIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white
  },
  viewView: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeTitle: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  defaultView: {
    width: 64,
    height: 26,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
    marginHorizontal: 12
  },
  defaultTitle: {
    fontSize: 12,
    fontFamily: "Urbanist Medium",
    color: COLORS.primary,
  },
  addressTitle: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
    marginVertical: 4
  },
  viewAddress: {
    marginHorizontal: 16
  },
  arrowRightIcon: {
    height: 16,
    width: 16,
    tintColor: COLORS.greyscale900
  },
  orderSummaryView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  addItemView: {
    width: 78,
    height: 26,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.primary,
    borderWidth: 1.4,
  },
  addItemText: {
    fontSize: 12,
    fontFamily: "Urbanist Medium",
    color: COLORS.primary,
  },
  viewItemTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  viewLeftItemTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
    marginRight: 16
  },
  viewItemTypeTitle: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
    marginRight: 16
  },
  placeOrderButton: {
    marginBottom: 12,
    marginTop: 6
  }
})

export default CheckoutOrders