
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import { COLORS } from '../constants';

const Rating = ({ color, size=30 ,onRatingChange }) => {
  const [rating, setRating] = useState(0);

 
  const handleRating = (value) => {
    setRating(value);
    // Call the callback function with the new rating value
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  const renderRatingIcons = () => {
    const maxRating = 5;
    const ratingIcons = [];

    for (let i = 1; i <= maxRating; i++) {
      const iconName = i <= rating ? 'star' : 'staro';

      ratingIcons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRating(i)}
          style={styles.iconContainer}
        >
          <AntDesign name={iconName} size={size} color={color} />
        </TouchableOpacity>
      );
    }

    return ratingIcons;
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingIcons}>{renderRatingIcons()}</View>
      {/* <Text style={styles.ratingText}>{rating} / 5</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16
  },
  ratingIcons: {
    flexDirection: 'row',
  },
  iconContainer: {
    margin: 5,
  },
  ratingText: {
    fontFamily: "Urbanist Medium",
    fontSize: 20,
    marginLeft: 10,
    color: COLORS.primary
  },
});
export default Rating;