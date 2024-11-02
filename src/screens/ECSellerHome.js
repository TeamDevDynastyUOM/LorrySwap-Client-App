import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Entypo } from "@expo/vector-icons";
import BottomBar from "./BottomBar";
import FlatListCard from "../components/FlatListCard";
import { useFocusEffect } from "@react-navigation/native";
import BottomPopup from "../components/BottomPopup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import ButtonSet from "../components/ButtonSet";
import { BASE_URL } from '../../config';
import { useRideContext } from "../context/RideContext";

const images = [
  require("../assets/EconomicCenter.jpg"),
  require("../assets/SalesInsight.jpg"),
];

const ECSellerHome = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const now = new Date();
  const maxFutureDate = new Date();
  maxFutureDate.setDate(now.getDate() + 2);
  const text = currentIndex === 0 ? "Economic Center" : "Sales Insight";
  const { id, token } = useRideContext();

  const fetchItems = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/freshItem/${id}`, 
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  useEffect(() => {
    fetchItems();

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [])
  );

  const postID = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/economicCenter/insert_ecseller/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error in postID");
      }
      const data = await response.json();
      console.log("Post ID:", data);
    } catch (error) {
      console.error("Error in postID:", error);
    }
  };
  useEffect(() => {
    postID();
  }, []);

  const handleEconomicCenterPress = () => {
    navigation.navigate("EconomicCenter");
  };

  const handleSalesInsightsPress = () => {
    navigation.navigate("SalesInsight");
  };

  const handleCardPress = (item) => {
    const itemDate = new Date(item.date);
    if (itemDate > maxFutureDate) {
      setSelectedItem(item);
      setIsPopupVisible(true);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedItem(null);
    setQuantity("");
    setAdditionalNote("");
  };

  const generateUniqueKey = (item) => {
    return `${item.id}_${item.date}_${item.economic_center}`;
  };

  const updateButtonHandle = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/order/OnDateBuyerEC/${selectedItem.date}/${selectedItem.economic_center_id}/${id}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error(Error);
      }

      const rawData = await response.json();
      console.log("Raw API Response:", rawData);

      const fetchedTotalOrder = rawData[0]?.total_order ?? null;
      console.log("Fetched Total Order:", fetchedTotalOrder);

      const updatedData = {
        weight: selectedItem.weight,
        additionalNote: selectedItem.additionalNote,
      };

      if (quantity) {
        const parsedQuantity = parseInt(quantity);
        if (!isNaN(parsedQuantity)) {
          updatedData.weight = parsedQuantity;
        } else {
          Alert.alert("Invalid weight value");
          return;
        }
      }

      if (additionalNote) {
        updatedData.additionalNote = additionalNote;
      }

      if (Object.keys(updatedData).length === 0) {
        Alert.alert("No changes to update");
        return;
      }

      try {
        const updateFreshItemResponse = await fetch(
          `${BASE_URL}/freshItem/${selectedItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          }
        );

        if (!updateFreshItemResponse.ok) {
          throw new Error(Error);
        }

        const updateFreshItemData = await updateFreshItemResponse.json();
        console.log("Update FreshItem Response:", updateFreshItemData);

        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === selectedItem.id ? { ...item, ...updatedData } : item
          )
        );

        closePopup();
      } catch (error) {
        console.error("Error updating FreshItem:", error);
        Alert.alert("Failed to update FreshItem. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching total order:", error);
      Alert.alert("Failed to fetch total order. Please try again later.");
    }
  };

  const deleteButtonHandle = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/order/OnDateBuyerEC/${selectedItem.date}/${selectedItem.economic_center_id}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(Error);
      }

      const rawData = await response.json();
      console.log("Raw API Response:", rawData);

      const fetchedTotalOrder = rawData[0]?.total_order ?? null;
      console.log("Fetched Total Order:", fetchedTotalOrder);

      if (fetchedTotalOrder) {
        Alert.alert(
          "Cannot Delete",
          `There is an order for ${selectedItem.name} total on ${selectedItem.date}. Please delete the order first.`,
          [
            {
              text: "OK",
              onPress: () => closePopup(),
            },
          ],
          { cancelable: false }
        );
        return;
      }
    } catch (error) {
      console.error("Error fetching total order:", error);
      Alert.alert("Failed to fetch total order. Please try again later.");
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${selectedItem.name} total on ${selectedItem.date}?`,
      [
        {
          text: "Cancel",
          onPress: () => closePopup(),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/freshItem/${selectedItem.id}`, 
                {
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                },
                {
                  method: "DELETE",
                }
              );

              if (!response.ok) {
                throw new Error(Error);
              }

              const data = await response.json();
              console.log("Item deleted successfully:", data);

              setItems((prevItems) =>
                prevItems.filter((item) => item.id !== selectedItem.id)
              );

              closePopup();
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Failed to delete item. Please try again later.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={images[currentIndex]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <ButtonSet />
        <View style={styles.transparentBlock}>
          <View style={styles.block1}>
            <TouchableOpacity
              onPress={
                text === "Economic Center"
                  ? handleEconomicCenterPress
                  : handleSalesInsightsPress
              }
            >
              <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.barBlock}>
            <View
              style={[
                styles.bar,
                { opacity: text === "Economic Center" ? 1 : 0.5 },
              ]}
            />
            <View
              style={[
                styles.bar,
                { opacity: text === "Economic Center" ? 0.5 : 1 },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <FlatList
          data={items}
          keyExtractor={(item) => generateUniqueKey(item)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardPress(item)}>
              <FlatListCard
                key={item.id}
                source={item.image}
                date={item.date}
                title={item.name}
                totalWeight={item.weight}
                showPercentageText={["Kg"]}
                economicCenter={item.economic_center_name}
                additionalNote={item.additionalNote}
              />
            </TouchableOpacity>
          )}
        />

        <BottomPopup isVisible={isPopupVisible} onClose={closePopup}>
          <View style={styles.popupContent}>
            {selectedItem && (
              <>
                <Text style={styles.constant}>
                  {selectedItem.name} total on {selectedItem.date}
                </Text>
                <View style={styles.col}>
                  <MaterialCommunityIcons
                    name="weight-kilogram"
                    size={32}
                    color="#132939"
                    style={{ paddingHorizontal: "4%", paddingTop: "4%" }}
                  />
                  <View style={styles.col}>
                    <TextInput
                      style={styles.weightInput}
                      placeholder={
                        selectedItem.total_weight?.toString() ||
                        selectedItem.weight.toString()
                      }
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      value={quantity}
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, "");
                        setQuantity(numericText);
                      }}
                    />
                    <Text style={styles.constant}>Kg</Text>
                  </View>
                </View>
                <View style={styles.col}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={32}
                    color="#132939"
                    style={{ paddingHorizontal: "4%", paddingTop: "4%" }}
                  />
                  <View style={styles.col}>
                    <TextInput
                      style={styles.textInput}
                      placeholder={
                        selectedItem.additionalNote?.toString() ||
                        selectedItem.additionalNote.toString()
                      }
                      placeholderTextColor="#999"
                      value={additionalNote}
                      onChangeText={(text) => {
                        setAdditionalNote(text);
                      }}
                    />
                  </View>
                </View>
                <CustomButton title="Update" onPress={updateButtonHandle} />
                <View style={{ paddingTop: "4%" }}>
                  <TouchableOpacity onPress={deleteButtonHandle}>
                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: 15,
                        paddingRight: "2%",
                      }}
                    >
                      Delete &gt;&gt;
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </BottomPopup>
      </View>

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate("chat")}
      >
        <Entypo name="chat" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Add")}
      >
        <Icon name="plus" size={20} color="white" />
      </TouchableOpacity>
      <ButtonSet />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#132939",
  },
  header: {
    flex: 5,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  body: {
    flex: 13,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  transparentBlock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "20%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginRight: 10,
  },
  bar: {
    width: 10,
    height: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  chatButton: {
    position: "absolute",
    bottom: "15%",
    right: "5%",
    backgroundColor: "#132939",
    borderRadius: 100,
    padding: 13,
    paddingLeft: 13,
    paddingRight: 12,
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: "8%",
    right: "5%",
    backgroundColor: "#132939",
    borderRadius: 100,
    padding: 13,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
  },
  barBlock: {
    flexDirection: "row",
    marginBottom: "2%",
  },
  col: {
    paddingTop: "2%",
    flexDirection: "row",
  },
  constant: {
    fontSize: 15,
    paddingLeft: "4%",
    paddingRight: "4%",
    paddingTop: "4%",
  },
  weightInput: {
    backgroundColor: "#F1F3F6",
    borderWidth: 1,
    borderColor: "#132939",
    paddingLeft: 20,
    fontSize: 14,
    borderRadius: 10,
    paddingVertical: "1%",
    paddingHorizontal: "35%",
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: "#F1F3F6",
    width: "80%",
    borderWidth: 1,
    marginBottom: 18,
    borderColor: "#132939",
    paddingLeft: 20,
    fontSize: 14,
    borderRadius: 10,
    paddingVertical: "1%",
    paddingHorizontal: "35%",
    fontWeight: "bold",
  },
});

export default ECSellerHome;
