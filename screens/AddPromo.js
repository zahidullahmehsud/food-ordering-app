import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import PromoItem from '../components/PromoItem';
import Button from '../components/Button';

const AddPromo = ({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  // Handle checkbox
  const handleCheckboxPress = (itemTitle) => {
    if (selectedItem === itemTitle) {
      // If the clicked item is already selected, deselect it
      setSelectedItem(null);
    } else {
      // Otherwise, select the clicked item
      setSelectedItem(itemTitle);
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Add Promo" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            backgroundColor: COLORS.tertiaryWhite,
            marginTop: 16,
          }}>
            <PromoItem
              checked={selectedItem === 'Offer1'}
              onPress={() => handleCheckboxPress('Offer1')}
              title="Special 25% Off"
              description="Special promo only today!"
              primaryColor="rgba(124, 33, 255,1)"
              transparentColor="rgba(124, 33, 255,.6)"
            />
            <PromoItem
              checked={selectedItem === 'Offer2'}
              onPress={() => handleCheckboxPress('Offer2')}
              title="Discount 30% Off"
              description="New user special promo"
              primaryColor="rgba(251, 209, 42,1)"
              transparentColor="rgba(251, 209, 42,.6)"
            />
            <PromoItem
              checked={selectedItem === 'Offer3'}
              onPress={() => handleCheckboxPress('Offer3')}
              title="Special 20% Off"
              description="Special promo only today"
              primaryColor="rgba(255, 87, 111,1)"
              transparentColor="rgba(255, 87, 111,.6)"
            />
            <PromoItem
              checked={selectedItem === 'Offer4'}
              onPress={() => handleCheckboxPress('Offer4')}
              title="Discount 40% Off"
              description="Special promo only valid today!"
              primaryColor="rgba(38, 194, 162,1)"
              transparentColor="rgba(38, 194, 162,.6)"
            />
            <PromoItem
              checked={selectedItem === 'Offer5'}
              onPress={() => handleCheckboxPress('Offer5')}
              title="Discount 35% Off"
              description="Special promo only valid today!"
              primaryColor="rgba(254, 189, 33,1)"
              transparentColor="rgba(254, 189, 33,.6)"
            />
            <PromoItem
              checked={selectedItem === 'Offer6'}
              onPress={() => handleCheckboxPress('Offer6')}
              title="Discount 40% Off"
              description="Special promo only valid today!"
              primaryColor="rgba(254, 89, 33,1)"
              transparentColor="rgba(254, 89, 33,.6)"
            />
          </View>
        </ScrollView>
      </View>
      <View style={[styles.bottomContainer, {
        backgroundColor: COLORS.white
      }]}>
        <Button
          title="Apply Promo"
          filled
          style={{ width: SIZES.width - 32 }}
          onPress={() => navigation.goBack()}
        />
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
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    height: 112,
    backgroundColor: COLORS.white,
    width: SIZES.width,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  }
})

export default AddPromo