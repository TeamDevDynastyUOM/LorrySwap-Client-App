import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PageHead = ({ title, onPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.pageTopic}>
        <TouchableOpacity onPress={onPress}>
          <Ionicons
            name="arrow-back-sharp"
            size={24}
            color="white"
            paddingTop={"1.75%"}
          />
        </TouchableOpacity>
        <Text style={styles.pageName}>{title}</Text>
      </View>
    </View>
  );
};

const styles = {
  header: {
    backgroundColor: "#132939",
    flexDirection: "column",
    alignItems: "left",
    paddingLeft: "5%",

  },
  pageTopic: {
    flexDirection: "row",
    paddingTop: "18%",
    paddingBottom: "8%",
  },
  pageName: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "5%",
  },
};

export default PageHead;
