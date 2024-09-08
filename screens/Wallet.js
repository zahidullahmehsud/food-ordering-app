import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionHeader from '../components/SectionHeader';
import { transactionHistory } from '../data';
import TransactionHistoryItem from '../components/TransactionHistoryItem';
import { ScrollView } from 'react-native-virtualized-view';

const Wallet = ({ navigation }) => {
  /**
   * render header
   */
  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={styles.logo}
          />
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>My Wallet</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.headerIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  /**
   * render wallet card
   */
  const renderWalletCard = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.topCardContainer}>
          <View style={styles.topCardLeftContainer}>
            <Text style={styles.cardHolderName}>Andrew Ainsley</Text>
            <Text style={styles.cardNumber}>•••• •••• •••• ••••</Text>
          </View>
          <View style={styles.topCardRightContainer}>
            <Text style={styles.cardType}>VISA</Text>
            <Image
              source={icons.masterCardLogo}
              resizeMode='contain'
              style={styles.cardLogo}
            />
          </View>
        </View>
        <Text style={styles.balanceText}>Your balance</Text>
        <View style={styles.bottomCardContainer}>
          <Text style={styles.amountNumber}>$957,5</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("TopupEwalletAmount")}
            style={styles.topupBtn}>
            <Image
              source={icons.arrowDownSquare}
              resizeMode='contain'
              style={styles.arrowDown}
            />
            <Text style={styles.topupBtnText}>Top Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  const renderTransactionHistory = () => {
    return (
      <View>
        <SectionHeader
          title="Transaction History"
          subtitle="See All"
          onPress={() => navigation.navigate("TransactionHistory")}
        />
        <FlatList
          data={transactionHistory.slice(0, 6)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransactionHistoryItem
              image={item.image}
              name={item.name}
              date={item.date}
              type={item.type}
              amount={item.amount}
            />
          )}
        />
      </View>
    )
  }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderWalletCard()}
          {renderTransactionHistory()}
        </ScrollView>
      </View>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: COLORS.primary
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 32,
    marginTop: 16,
    height: 212,
    backgroundColor: COLORS.primary,
    padding: 16
  },
  topCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  topCardLeftContainer: {
    marginTop: 6
  },
  topCardRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22
  },
  cardHolderName: {
    fontSize: 22,
    color: COLORS.white,
    fontFamily: "Urbanist Bold",
  },
  cardNumber: {
    fontSize: 20,
    color: COLORS.white,
    fontFamily: "Urbanist SemiBold",
  },
  cardType: {
    fontSize: 26,
    color: COLORS.white,
    fontFamily: "extraBoldItalic",
  },
  cardLogo: {
    height: 52,
    width: 52,
    marginLeft: 6
  },
  balanceText: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: "Urbanist Medium",
  },
  bottomCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22
  },
  amountNumber: {
    fontSize: 42,
    color: COLORS.white,
    fontFamily: "Urbanist Bold",
  },
  topupBtn: {
    width: 132,
    height: 42,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  arrowDown: {
    width: 16,
    height: 16,
    tintColor: COLORS.black
  },
  topupBtnText: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: "Urbanist SemiBold",
    marginLeft: 12
  }
})

export default Wallet