// AddToBasketModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {COLORS, SIZES, icons, images} from '../constants'; // Adjust the import path as needed
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const AddToBasketModal = ({isVisible, onClose, onCheckout}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      style={styles.modal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* <Text style={styles.modalTitle}>Item Added to Basket</Text> */}
          <Image
            source={icons.check}
            resizeMode="contain"
            style={{width: 60, height: 60}}
          />
          <Text style={styles.modalText}>
            Your item has been successfully added to the basket.
          </Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.continueButton]}
              onPress={onClose}>
              <Text style={styles.buttonText}>Continue Shopping</Text>
            </TouchableOpacity>
            <Text style={{marginHorizontal: SIZES.base}}></Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.checkoutButton]}
              onPress={onCheckout}>
              <Text style={styles.buttonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: wp(20),
    height: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(100),
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SIZES.padding + 12,
    paddingHorizontal: SIZES.padding + 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: wp(95),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  modalText: {
    //marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.blackTie,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // width: wp(40),
    marginTop: 30,
  },
  modalButton: {
    borderRadius: 18,
    padding: 10,
    elevation: 2,
    justifyContent: 'center',

    width: wp(40),
    height: 40,
    borderColor: 'gray',
  },
  continueButton: {
    backgroundColor: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default AddToBasketModal;
