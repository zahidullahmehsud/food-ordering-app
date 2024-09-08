import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import HorizontalFoodCard from '../components/HorizontalFoodCard';
import { meatFoods } from '../data';

// render category meat
const CategoryMeat = ({ navigation }) => {

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Meat" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            backgroundColor: COLORS.secondaryWhite,
            marginVertical: 16
          }}>
            <FlatList
              data={meatFoods}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                return (
                  <HorizontalFoodCard
                    name={item.name}
                    image={item.image}
                    distance={item.distance}
                    price={item.price}
                    fee={item.fee}
                    rating={item.rating}
                    numReviews={item.numReviews}
                    isPromo={item.isPromo}
                    onPress={() => navigation.navigate("FoodDetails")}
                  />
                )
              }}
            />
          </View>
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
  }
})

export default CategoryMeat