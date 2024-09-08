import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, SIZES, icons} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-virtualized-view';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import {err} from 'react-native-svg';

// Transaction ereceipt
const EReceipt = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const {orderData} = route.params;
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  console.log('Order data comming ... ', orderData);
  const dropdownItems = [
    {label: 'Share E-Receipt', value: 'share', icon: icons.shareOutline},
    {
      label: 'Download E-Receipt',
      value: 'downloadEReceipt',
      icon: icons.download2,
    },
    // { label: 'Print', value: 'print', icon: icons.documentOutline },
  ];

  const handleDropdownSelect = item => {
    setSelectedItem(item.value);
    setModalVisible(false);

    // Perform actions based on the selected item
    switch (item.value) {
      case 'share':
        shareEReceipt();
        // Handle Share action
        setModalVisible(false);
        // navigation.navigate("Home")
        break;
      case 'downloadEReceipt':
        downloadEReceipt();
        // Handle Download E-Receipt action
        setModalVisible(false);
        // navigation.navigate("Home")
        break;
      case 'print':
        // Handle Print action
        setModalVisible(false);
        navigation.navigate('Home');
        break;
      default:
        break;
    }
  };

  const shareEReceipt = async () => {
    try {
      // Create a string with all the order details
      const shareContent = `
  Order Information:
  Order Number: ${orderData.number}
  Status: ${orderData.status}
  Created Date: ${formatDate(orderData.createDate)}
  Expected Delivery: ${formatDate(orderData.expectedDeliveryDate)}
  
  Customer Address:
  ${orderData.customerAddress.address}
  
  Order Items:
  ${orderData.items
    .map(item => `${item.name} x ${item.quantity} - $${item.amount}`)
    .join('\n')}
  
  Billing Summary:
  Order Amount: $${orderData.billingSummary.orderAmount}
  Delivery Charges: $${orderData.billingSummary.deliveryCharges}
  Tax Amount: $${orderData.billingSummary.taxAmount}
  Total Amount: $${orderData.billingSummary.totalAmount}
  
  Payment Information:
  Payment Mode: ${orderData.paymentMode.name}
  Payment Status: ${orderData.paymentStatus}
  
  Vendor Information:
  Name: ${orderData.vendorStore.name}
  Address: ${orderData.vendorStore.address}
      `;

      const shareOptions = {
        message: shareContent,
        title: 'E-Receipt',
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing receipt:', error);
      // Alert.alert('Error', 'Failed to share the receipt. Please try again.');
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date
      .toLocaleString('default', {month: 'short'})
      .toUpperCase();
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }

  const downloadEReceipt = async () => {
    try {
      // Generate HTML content
      const htmlContent = `
        <html>
          <body>
            <h1>E-Receipt</h1>
            <h2>Order Information</h2>
            <p>Order Number: ${orderData.number}</p>
            <p>Status: ${orderData.status}</p>
            <p>Created Date: ${formatDate(orderData.createDate)}</p>
            <p>Expected Delivery: ${formatDate(
              orderData.expectedDeliveryDate,
            )}</p>
             <p>Delivery Date: ${orderData.status}</p>
  
            <h2>Customer Address</h2>
            <p>${orderData.customerAddress.address}</p>
  
            <h2>Order Items</h2>
            ${orderData.items
              .map(
                item => `
              <p>${item.name} x ${item.quantity} - $${item.amount}</p>
            `,
              )
              .join('')}
  
            <h2>Billing Summary</h2>
            <p>Order Amount: $${orderData.billingSummary.orderAmount}</p>
            <p>Delivery Charges: $${
              orderData.billingSummary.deliveryCharges
            }</p>
            <p>Tax Amount: $${orderData.billingSummary.taxAmount}</p>
            <p>Total Amount: $${orderData.billingSummary.totalAmount}</p>
  
            <h2>Payment Information</h2>
            <p>Payment Mode: ${orderData.paymentMode.name}</p>
            <p>Payment Status: ${orderData.paymentStatus}</p>
  
            <h2>Vendor Information</h2>
            <p>Name: ${orderData.vendorStore.name}</p>
            <p>Address: ${orderData.vendorStore.address}</p>
          </body>
        </html>
      `;

      // Generate PDF
      const options = {
        html: htmlContent,
        fileName: `E-Receipt_${orderData.number}`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);

      // Move the file to the Downloads folder
      const downloadPath = `${RNFS.DownloadDirectoryPath}/E-Receipt_${orderData.number}.pdf`;
      await RNFS.moveFile(file.filePath, downloadPath);

      console.log('PDF saved to:', downloadPath);
      setMessage('E-Receipt downloaded successfully!');
      setSuccessModalVisible(true);

      // Alert.alert('Success', 'E-Receipt downloaded successfully!');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setErrorModalVisible(true);
      setMessage(error);
      //  Alert.alert('Error', 'Failed to download the receipt. Please try again.');
    }
  };

  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: COLORS.black,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: COLORS.black,
              },
            ]}>
            E-Receipt
          </Text>
        </View>
        <View style={styles.shareAndDownloadConatiner}>
          <TouchableOpacity onPress={shareEReceipt}>
            <Image
              source={icons.shareOutline}
              resizeMode="contain"
              style={[
                styles.shareIcon,
                {
                  tintColor: COLORS.black,
                },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={downloadEReceipt}>
            <Image
              source={icons.downloadFile}
              resizeMode="contain"
              style={[
                styles.moreIcon,
                {
                  tintColor: COLORS.black,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  /**
   * Render content
   */
  const renderContent = () => {
    const transactionId = 'SKD354822747'; // Replace with your actual transaction ID

    const handleCopyToClipboard = () => {
      Clipboard.setString(transactionId);
      // Alert.alert('Copied!', 'Transaction ID copied to clipboard.');
    };

    // return (
    //   <View style={{ marginVertical: 22 }}>
    //     <Barcode
    //       format="EAN13"
    //       value="0123456789012"
    //       text="0123456789012"
    //       width={SIZES.width - 64}
    //       height={72}
    //       style={{
    //         marginBottom: 40,
    //         backgroundColor: COLORS.white,
    //       }}
    //       lineColor={COLORS.black}
    //       textStyle={{
    //         color: COLORS.black
    //       }}
    //       maxWidth={SIZES.width - 64}
    //     />
    //     <View style={[styles.summaryContainer, {
    //       backgroundColor: COLORS.white,
    //       borderRadius: 6,
    //     }]}>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Name</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>Daniel Austion</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Address</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>{orderData.customerAddress.address}</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Food Type</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>Detroit-style pizza</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Phone</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>+1 111 467 378 399</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Category</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>Pizza</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>ID</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>PIZZA XT134</Text>
    //       </View>
    //     </View>

    //     <View style={[styles.summaryContainer, {
    //       backgroundColor: COLORS.white,
    //       borderRadius: 6,
    //     }]}>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Amount</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>$60</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Tax</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>$5.55</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Country</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>United States</Text>
    //       </View>
    //     </View>
    //     <View style={[styles.summaryContainer, {
    //       backgroundColor: COLORS.white,
    //       borderRadius: 6,
    //     }]}>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Total</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>$605.55</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Payment Methods</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>Credit Card</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Date</Text>
    //         <Text style={[styles.viewRight, {
    //           color: COLORS.black
    //         }]}>Dec 16, 2026 | 12:23:45 PM</Text>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Transaction ID</Text>
    //         <View style={styles.copyContentContainer}>
    //           <Text style={styles.viewRight}>{transactionId}</Text>
    //           <TouchableOpacity style={{ marginLeft: 8 }} onPress={handleCopyToClipboard}>
    //             <MaterialCommunityIcons name="content-copy" size={24} color={COLORS.primary} />
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //       <View style={styles.viewContainer}>
    //         <Text style={styles.viewLeft}>Status</Text>
    //         <TouchableOpacity style={styles.statusBtn}>
    //           <Text style={styles.statusBtnText}>Paid</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </View>

    // )

    return (
      <View style={{marginVertical: 22}}>
        {/* Existing barcode component */}
        {/* <Barcode
          format="EAN13"
          value="0123456789012"
          text="0123456789012"
          width={SIZES.width - 64}
          height={72}
          style={{
            marginBottom: 40,
            backgroundColor: COLORS.white,
          }}
          lineColor={COLORS.black}
          textStyle={{
            color: COLORS.black
          }}
          maxWidth={SIZES.width - 64}
        /> */}

        {/* Order Information */}
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}>
          <Text style={[styles.viewLeftt, {marginBottom: 20}]}>
            Order Information
          </Text>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Order Number</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.number}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Status</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.status}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Created Date</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {formatDate(orderData.createDate)}
            </Text>
          </View>
          {orderData.status == 'Delivered' ? (
            <View style={styles.viewContainer}>
              <Text style={styles.viewLeft}>Delivered At</Text>
              <Text style={[styles.viewRight, {color: COLORS.black}]}>
                {orderData.deliveryDate == null
                  ? '.....'
                  : formatDate(orderData.deliveryDate)}
              </Text>
            </View>
          ) : (
            <View style={styles.viewContainer}>
              <Text style={styles.viewLeft}>Expected Delivery</Text>
              <Text style={[styles.viewRight, {color: COLORS.black}]}>
                {orderData.expectedDeliveryDate == null
                  ? '.....'
                  : formatDate(orderData.expectedDeliveryDate)}
              </Text>
            </View>
          )}
        </View>

        {/* Customer Address */}
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}>
          <Text style={[styles.viewLeftt, {marginBottom: 20}]}>
            Customer Address
          </Text>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Delivery Address</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.customerAddress.address}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Building</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.customerAddress?.building}....
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Room No</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.customerAddress?.roomNo}....
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Room No</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.customerAddress?.roomNo}....
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}>
          <Text style={[styles.viewLeftt, {marginBottom: 20}]}>
            Order Items
          </Text>
          {orderData.items.map((item, index) => (
            <View key={index} style={styles.viewContainer}>
              <Text style={styles.viewLeft}>
                {item.name} x {item.quantity}
              </Text>
              <Text style={[styles.viewRight, {color: COLORS.black}]}>
                ${item.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Billing Summary */}
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}>
          <Text style={[styles.viewLeftt, {marginBottom: 20}]}>
            Billing Summary
          </Text>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Order Amount</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              ${orderData.billingSummary.orderAmount}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Delivery Charges</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              ${orderData.billingSummary.deliveryCharges}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Service Charges</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              ${orderData.billingSummary.serviceCharges}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Tax Amount</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              ${orderData.billingSummary.taxAmount}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Total Amount</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              ${orderData.billingSummary.totalAmount}
            </Text>
          </View>
        </View>

        {/* Payment Information */}
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}>
          <Text style={[styles.viewLeftt, {marginBottom: 20}]}>
            Payment Information
          </Text>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Payment Mode</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.paymentMode.name}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Payment Status</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.paymentStatus}
            </Text>
          </View>
        </View>

        {/* Vendor Information */}
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: COLORS.white,
              borderRadius: 6,
            },
          ]}>
          <Text style={[styles.viewLeftt, {marginBottom: 20}]}>
            Vendor Information
          </Text>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Name</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.vendorStore.name}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={styles.viewLeft}>Address</Text>
            <Text style={[styles.viewRight, {color: COLORS.black}]}>
              {orderData.vendorStore.address}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, {backgroundColor: COLORS.white}]}>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        {renderHeader()}
        <ScrollView
          style={[styles.scrollView, {backgroundColor: COLORS.tertiaryWhite}]}
          showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </View>
      {/* Modal for dropdown selection */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{position: 'absolute', top: 112, right: 12}}>
            <View
              style={{
                width: 202,
                padding: 16,
                backgroundColor: COLORS.tertiaryWhite,
                borderRadius: 8,
              }}>
              <FlatList
                data={dropdownItems}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 12,
                    }}
                    onPress={() => handleDropdownSelect(item)}>
                    <Image
                      source={item.icon}
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 16,
                        tintColor: COLORS.black,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Urbanist SemiBold',
                        color: COLORS.black,
                      }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <SuccessModal
        visible={successModalVisible}
        message={message}
        onClose={() => {
          setSuccessModalVisible(false);
        }}
      />
      <ErrorModal
        visible={errorModalVisible}
        message={message}
        onClose={() => setErrorModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  scrollView: {
    backgroundColor: COLORS.tertiaryWhite,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 16,
  },
  shareIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  summaryContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    padding: 16,

    borderRadius: 6,
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed from "center" to "flex-start"
    width: '100%',
    marginVertical: 8,
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: 'Urbanist Regular',
    color: 'gray',
    flex: 1, // Added flex: 1
  },
  viewLeftt: {
    fontSize: 14,
    fontFamily: 'Urbanist Regular',
    color: 'gray',
    textAlign: 'center',
  },
  viewRight: {
    fontSize: 14,
    fontFamily: 'Urbanist Medium',
    color: COLORS.black,
    textAlign: 'right',
    flex: 2, // Added flex: 2
  },
  copyContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBtn: {
    width: 72,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 6,
  },
  statusBtnText: {
    fontSize: 12,
    fontFamily: 'Urbanist Medium',
    color: COLORS.primary,
  },
  shareAndDownloadConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '20%',
  },
});

export default EReceipt;
