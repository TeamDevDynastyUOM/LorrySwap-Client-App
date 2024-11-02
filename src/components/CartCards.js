import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const FlatListCard = ({totalWeight,date,economicCenter,showPercentageText = [], // Array of strings for multiple options
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{date}</Text>
      <View style={styles.column}>        
       <Text style={styles.economicCenter}>{economicCenter}</Text>
          <View style={styles.weightRow}>
            <Text style={styles.constant1}>Total Weight : </Text>
            <Text style={styles.totalWeight}>{totalWeight}</Text>
            {showPercentageText.includes("Kg") && (
              <Text style={styles.totalWeight}>Kg</Text>
            )}
          </View>
            
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
    padding: "3%",
    marginVertical: "2%",
    shadowColor: "#000",
    elevation: 5,
  },
  column: {
    flexDirection: "column",
  },
  date: {
    textAlign: "right",
    fontSize: 12,
    color: "#004344",
  },
  weightRow: {
    flexDirection: "row",
  },
  totalWeight: {
    fontSize: 14,
    color: "#004344",
  },
  economicCenter: {
    fontSize: 18,
    color: "#004344",
    fontWeight: "bold",
    paddingBottom: "1%",
  },
  constant2: {
    fontSize: 14,
    color: "#004344",
    top: "6%",
  },
  constant1: {
    fontSize: 14,
    color: "#004344",
  },
});

export default FlatListCard;
