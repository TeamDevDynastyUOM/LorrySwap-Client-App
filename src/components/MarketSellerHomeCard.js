import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const MarketSellerHomeCard = ({ title, weight, ECName, date, source }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topColumn}>
        <Text style={styles.weight}>{weight}</Text>
        <Text style={styles.kg}>Kg</Text>
      </View>
      <View style={styles.row}>
        <Image source={{ uri: source }} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: "90%",
    paddingLeft: "7%",
    paddingRight: "3%",
    paddingBottom: "12%",
    marginVertical: "2%",
    marginHorizontal: "5%",
    borderTopRightRadius: 33,
    borderBottomLeftRadius: 33,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4,
  },
  topColumn: {
    backgroundColor: "#004344",
    width: "25%",
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    marginLeft: "77%",
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
  },
  image: {
    width: "25%",
    height: "240%",
    borderRadius: 8,
    marginRight: "5%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#004344",
  },
  weight: {
    fontSize: 14,
    color: "white",
    paddingLeft: "28%",
  },
  kg: {
    fontSize: 14,
    color: "white",
    paddingLeft: "5%",
  },
});

export default MarketSellerHomeCard;
