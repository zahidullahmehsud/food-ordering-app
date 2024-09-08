import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, icons, SIZES} from '../constants';

const OrderSummaryCard = ({
  name,
  logo,
  price = 0,
  onRemove,
  addons,
  attributes,
}) => {
  // const formattedPrice = price.toFixed(2);
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.viewLeftContainer}>
          {logo && (
            <Image
              source={{uri: logo}}
              resizeMode="contain"
              style={styles.image}
            />
          )}
          <View>
            <Text style={styles.name}>{name.substring(0, 21)}....</Text>
            <Text style={styles.price}>${price.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Image
            source={icons.close}
            resizeMode="contain"
            style={styles.crossIcon}
          />
        </TouchableOpacity>
      </View>

      {/* {addons && addons.length > 0 && (
                <View style={styles.addonsContainer}>
                    <Text style={styles.sectionTitle}>Addons:</Text>
                    {addons.map((addon, index) => (
                        <Text key={index} style={styles.addonText}>
                            {addon.name}   
                            (+${addon.price})
                        </Text>
                    ))}
                </View>
            )} */}

      {addons && addons.length > 0 && (
        <View style={styles.addonsContainer}>
          <Text style={styles.sectionTitle}>Addons:</Text>
          {addons.map((addon, index) => (
            <Text key={index} style={styles.addonText}>
              {addon.name}
            </Text>
          ))}
        </View>
      )}

      {attributes && attributes.length > 0 && (
        <View style={styles.attributesContainer}>
          <Text style={styles.sectionTitle}>Attributes:</Text>
          {attributes.map((attr, index) => (
            <View key={index}>
              <Text style={styles.attributeText}>
                {attr.categoryName} : {attr.name}
              </Text>
              {attr.items &&
                attr.items.map((item, itemIndex) => (
                  <Text key={itemIndex} style={styles.attributeItemText}>
                    - {item.name} (Qty: {item.quantity})
                  </Text>
                ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
    paddingBottom: 16,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  viewLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 12,
  },
  name: {
    fontSize: SIZES.font + 2,
    fontFamily: 'Urbanist Bold',
    color: COLORS.greyscale900,
    marginBottom: 4,
  },
  price: {
    fontSize: SIZES.font - 2,
    fontFamily: 'Urbanist Bold',
    color: COLORS.primary,
  },
  removeButton: {
    padding: 10,
  },
  crossIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.grayscale700,
  },
  addonsContainer: {
    marginTop: 8,
    paddingLeft: 84, // Aligns with the start of the item name
  },
  attributesContainer: {
    marginTop: 8,
    paddingLeft: 84, // Aligns with the start of the item name
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Urbanist Bold',
    color: COLORS.grayscale700,
    marginBottom: 4,
  },
  addonText: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
  },
  attributeItemText: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
  },

  attributeText: {
    fontSize: 12,
    fontFamily: 'Urbanist Regular',
    color: COLORS.grayscale700,
  },
});

export default OrderSummaryCard;
