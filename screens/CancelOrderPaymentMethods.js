import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import PaymentMethodItem from '../components/PaymentMethodItem';
import Button from '../components/Button';

const CancelOrderPaymentMethods = ({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCheckboxPress = (itemTitle) => {
    if (selectedItem === itemTitle) {
      // If the clicked item is already selected, deselect it
      setSelectedItem(null);
    } else {
      // Otherwise, select the clicked item
      setSelectedItem(itemTitle);
    }
  };

  // Render modal
  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalSubContainer, {
              backgroundColor: COLORS.white
            }]}>
              <Text style={styles.sadEmoji}>😥</Text>
              <Text style={[styles.modalTitle, {
                color: COLORS.greyscale900,
              }]}>We're sad about your cancelllation</Text>
              <Text style={[styles.modalSubtitle, {
                color: COLORS.black,
              }]}>
                You have successfully canceled your order. 80% funds will returned to your account.
              </Text>
              <Button
                title="Okay"
                filled
                onPress={() => {
                  setModalVisible(false)
                  navigation.goBack()
                }}
                style={styles.successBtn}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Cancel Order" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, {
            color: COLORS.greyscale900
          }]}>Please select a payment refund method (only 80% will be refunded)</Text>
          <PaymentMethodItem
            checked={selectedItem === 'Paypal'}
            onPress={() => handleCheckboxPress('Paypal')}
            title="Paypal"
            icon={icons.paypal}
          />
          <PaymentMethodItem
            checked={selectedItem === 'Google Pay'}
            onPress={() => handleCheckboxPress('Google Pay')}
            title="Google Pay"
            icon={icons.google}
          />
          <PaymentMethodItem
            checked={selectedItem === 'Apple Pay'}
            onPress={() => handleCheckboxPress('Apple Pay')}
            title="Apple Pay"
            icon={icons.apple}
            tintColor={COLORS.black}
          />
          <PaymentMethodItem
            checked={selectedItem === 'Credit Card'}
            onPress={() => handleCheckboxPress('Credit Card')}
            title="•••• •••• •••• •••• 4679"
            icon={icons.creditCard}
          />
          <Button
            title="Add New Card"
            onPress={() => { navigation.navigate("AddNewCard") }}
            style={{
              width: SIZES.width - 32,
              borderRadius: 32,
              backgroundColor: COLORS.tansparentPrimary,
              borderColor: COLORS.tansparentPrimary
            }}
            textColor={COLORS.primary}
          />
        </ScrollView>
        <View style={styles.bottomContainer}>
          <View style={[styles.separateLine, {
            backgroundColor: COLORS.grayscale200,
          }]} />
          <View style={styles.refundContainer}>
            <Text style={[styles.paidText, {
              color: COLORS.grayscale700,
            }]}>Paid: $16.00</Text>
            <Text style={[styles.refundText, {
              color: COLORS.greyscale900,
            }]}>Refund: $14.40</Text>
          </View>
          <Button
            title="Continue"
            filled
            style={styles.continueBtn}
            onPress={() => { setModalVisible(true) }}
          />
        </View>
      </View>
      {renderModal()}
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  title: {
    fontSize: 16,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyscale900,
    marginVertical: 32
  },
  bottomContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: SIZES.width - 32,
  },
  separateLine: {
    width: SIZES.width - 32,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 6
  },
  refundContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    width: SIZES.width - 32
  },
  paidText: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    marginRight: 12,
    textDecorationLine: "line-through"
  },
  refundText: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
  },
  continueBtn: {
    borderRadius: 32,
    backgroundColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  modalSubContainer: {
    height: 460,
    width: SIZES.width * 0.85,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22
  },
  successBtn: {
    width: "100%",
    marginTop: 12,
    borderRadius: 32
  },
  receiptBtn: {
    width: "100%",
    marginTop: 12,
    borderRadius: 32,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary
  },
  editPencilIcon: {
    width: 42,
    height: 42,
    tintColor: COLORS.white,
    zIndex: 99999,
    position: "absolute",
    top: 54,
    left: 58,
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -999
  },
  sadEmoji: {
    fontSize: 160
  }
})

export default CancelOrderPaymentMethods