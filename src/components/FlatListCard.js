import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const FlatListCard = ({title,totalWeight,date,source,ownContribution,economicCenter,contactNumber,sold,additionalNote, sellerName,showPercentageText = [], // Array of strings for multiple options
}) => {
  return (
    <View style={styles.card}>
      {date && (
        <View style={styles.dateRow}>
          <Text style={styles.date}>Due bring on:</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Image source={{ uri: source }} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.weightRow}>
            <Text style={styles.constant1}>Total : </Text>
            <Text style={styles.totalWeight}>{totalWeight}</Text>
            {showPercentageText.includes("Kg") && (
              <Text style={styles.totalWeight}>Kg</Text>
            )}
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.ownContribution}>{ownContribution}</Text>
            <Text style={styles.sold}>{sold}</Text>
            <View>
              <Text style={styles.sellerName}>{sellerName}</Text>
              <Text style={styles.contactNumber}>{contactNumber}</Text>
            </View>
            <Text style={styles.economicCenter}>{economicCenter}</Text>
            {showPercentageText.includes("From Yours") && (
              <Text style={styles.constant2}>% From Yours</Text>
            )}
            {showPercentageText.includes("Has Gone") && (
              <Text style={styles.constant2}>Kg Has Gone</Text>
            )}
          </View>
          {additionalNote && (
            <View style={styles.psRow}>
              <Text style={styles.constant1}>Ps:</Text>
              <Text style={styles.totalWeight}>{additionalNote}</Text>
            </View>
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
    paddingRight: "5%",
    paddingLeft:0,
    paddingVertical:"5%",
    marginVertical: "2%",
    shadowColor: "#000",
    elevation: 5,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: "5%",
    paddingLeft: "55%",
    paddingBottom: "5%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingStart: "15%", 

  },
  psRow:{
    flexDirection: "row",
  },
  date: {
    textAlign: "right",
    fontSize: 12,
    color: "#004344",
  },
  image: {
    width: "32%",
    height: "85%",
    marginRight: "5%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#004344",
  },
  weightRow: {
    flexDirection: "row",
  },
  totalWeight: {
    fontSize: 14,
    color: "#004344",
  },
  sold: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#004344",
  },
  constant1: {
    fontSize: 14,
    color: "#004344",
  },
  detailRow: {
    flexDirection: "row",
  },
  ownContribution: {
    fontSize: 24,
    fontWeight: "400",
    color: "#004344",
  },
  economicCenter: {
    fontSize: 14,
    color: "#004344",
    paddingBottom: "1%",
  },
  constant2: {
    fontSize: 14,
    color: "#004344",
    top: "6%",
  },
  contactNumber: {
    fontSize: 14,
    color: "#004344",
  },
  sellerName: {
    fontSize: 14,
    color: "#004344",
  },
});

export default FlatListCard;
