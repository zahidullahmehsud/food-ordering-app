import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../constants';
import {useNavigation} from '@react-navigation/native';

const AddressPromptModal = ({
  visible,
  onClose,
  title,
  message,
  buttonLabel,
  onButtonPress,
  hasAddress,
  address,
  secondaryAction,
  secondaryLabel,
  handleAddAddress,
}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(visible);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        if (!hasAddress) {
          alert('Please add an address before closing this modal.');
        } else {
          onClose();
        }
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddressPromptModal;
