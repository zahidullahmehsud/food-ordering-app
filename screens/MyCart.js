import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import Header from '../components/Header';
import { myCart } from '../data';
import CartItem from '../components/CartItem';

const MyCart = () => {

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white  }]}>
        <View style={{ paddingBottom: 12 }}>
          <Header title="My Cart" />
        </View>
        <ScrollView
          contentContainerStyle={{
            marginVertical: 22,
            backgroundColor: COLORS.tertiaryWhite
          }}
          showsVerticalScrollIndicator={false}>
          <FlatList
            data={myCart}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CartItem
                image1={item.image1}
                image2={item.image2}
                image3={item.image3}
                name={item.name}
                numItems={item.numItems}
                distance={item.distance}
                price={item.price}
              />
            )}
          />
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

export default MyCart