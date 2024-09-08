const HorizontalFoodCardForResturants = ({
    name,
    address,
    description,
    deliveryChargesMinimum,
    deliveryChargesPerKm,
    serviceCharges,
    taxPercentage,
    onPress
  }) => {
    const [isFavourite, setIsFavourite] = useState(false);
  
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Image
          source={require('../assets/images/placeholder.png')} // Use a placeholder image
          resizeMode='cover'
          style={styles.image}
        />
        <View style={styles.columnContainer}>
          <View style={styles.topViewContainer}>
            <Text style={[styles.name, { color: COLORS.greyscale900 }]}>{name}</Text>
          </View>
          <View style={styles.viewContainer}>
            <Text style={[styles.location, { color: COLORS.grayscale700 }]}>{address}</Text>
          </View>
          <Text style={[styles.description, { color: COLORS.grayscale600 }]} numberOfLines={2}>{description}</Text>
          <View style={styles.bottomViewContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>Delivery: ${deliveryChargesMinimum} + ${deliveryChargesPerKm}/km</Text>
            </View>
            <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
              <Image
                source={isFavourite ? icons.heart2 : icons.heart2Outline}
                resizeMode='contain'
                style={styles.heartIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.location, { color: COLORS.grayscale700 }]}>Service Charge: ${serviceCharges}, Tax: {taxPercentage}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: SIZES.width - 32,
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
        marginBottom: 12,
        height: 112,
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 16
    },
    columnContainer: {
        flexDirection: "column",
        marginLeft: 12,
        flex: 1
    },
    name: {
        fontSize: 17,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
        marginVertical: 4,
        marginRight: 40
    },
    location: {
        fontSize: 14,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700,
        marginVertical: 4
    },
    priceContainer: {
        flexDirection: "column",
        marginVertical: 4,
    },
    duration: {
        fontSize: 12,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.primary,
        marginRight: 8
    },
    heartIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.red,
        marginLeft: 6
    },
    reviewContainer: {
        position: "absolute",
        top: 16,
        left: 54,
        width: 46,
        height: 20,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rating: {
        fontSize: 10,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.white,
        marginLeft: 4
    },
    topViewContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: SIZES.width - 164
    },
    bottomViewContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 2
    },
    viewContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    price: {
        fontSize: 16,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.primary,
        marginRight: 8
    },
    motoIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.primary,
        marginRight: 4
    }
});

export default HorizontalFoodCard