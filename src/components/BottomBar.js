import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";

// BottomBar component
const BottomBar = ({ navigation }) => {
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={styles.keyboardAvoidingContainer}
    >
      <View style={styles.container}>
        <BottomTab
          onPress={() => navigateToScreen("Home")}
          icon={<Entypo name="home" size={24} color="black" />}
          text="Home"
        />
        <BottomTab
          onPress={() => navigateToScreen("Notification")}
          icon={<Ionicons name="notifications" size={22} color="black" />}
          text="Notification"
        />
        <BottomTab
          onPress={() => navigateToScreen("Profile")}
          icon={<Ionicons name="person" size={22} color="black" />}
          text="Profile"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

// BottomTab component for each tab
const BottomTab = ({ onPress, icon, text }) => (
  <TouchableOpacity style={styles.tab} onPress={onPress}>
    {icon}
    <Text style={styles.tabText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
    paddingVertical: "2%",
    backgroundColor: "#e0e0e0",
    position: "absolute", 
    bottom: 0,
    left: 0, 
    right: 0, 
  },
  tab: {
    alignItems: "center",
  },
  tabText: {
    marginTop: 3,
    fontSize: 10,
  },
});

export default BottomBar;
