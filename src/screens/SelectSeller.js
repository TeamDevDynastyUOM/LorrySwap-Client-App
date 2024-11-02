import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomPopup from "../components/BottomPopup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PageHead from "../components/PageHead";
import { BASE_URL } from "../../config";
import { useRideContext } from "../context/RideContext";


const SelectSeller = ({ route }) => {
  const navigation = useNavigation();
  const { title, itemId, selectedDate, value, total_remain, source } =
    route.params;
  const [items, setItems] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [remainingStock, setRemainingStock] = useState(total_remain);
  const [date, setDate] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0); // State to force data refresh
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  
  const fetchItems = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/freshItem/OnDateNameEC/${selectedDate}/${
          value + 1
        }/${itemId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const mappedItems = data.map((item) => ({
        seller_id: item.seller_id,
        fname: item.fname,
        lname: item.lname,
        contact: item.contact,
        additionalNote: item.additionalNote,
        total_remain: item.total_remain,
        item_id: item.item_id,
        image: item.image,
      }));
      setItems(mappedItems);
      const totalRemainingStock = mappedItems.reduce(
        (total, item) => total + item.total_remain,
        0
      );
      setRemainingStock(totalRemainingStock);
    } catch (error) {
      console.error("Error fetching items in SelectSeller:", error);
      Alert.alert(
        "Error",
        "Failed to fetch seller information. Please try again later"
      );
    }
  };
  useEffect(() => {
    fetchItems();
  }, [selectedDate, value, itemId, refreshKey]);

  const handleCardPress = (item) => {
    setIsPopupVisible(true);
    setSelectedSellerId(item.seller_id);
    console.log("Selected seller:", item);
  };

  const buttonHandle = () => {
    const formattedDate = new Date(selectedDate).toISOString(); // Ensure selectedDate is properly formatted
    const data = {
      dueDate: formattedDate,
      quantity: parseInt(quantity),
      economic_center_id: value + 1,
      name: itemId,
      seller_id: selectedSellerId,
    };

    console.log("Order data:", data);

    if (isNaN(data.quantity) || data.quantity <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    } else {
      if (data.quantity > remainingStock) {
        Alert.alert(
          "Error",
          `Currently only ${remainingStock} Kg is available. Please enter a valid quantity.`
        );
        return;
      } else {
        fetch(`${BASE_URL}/order/1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((responseData) => {
            console.log("Added order successfully:", responseData);
            setIsPopupVisible(false);
            setRefreshKey((prevKey) => prevKey + 1); // Trigger data refresh after successful order
          })
          .catch((error) => {
            console.error("Error creating order:", error);
            Alert.alert(
              "Error",
              "Failed to create order. Please try again later."
            );
          });
        setRefreshKey((prevKey) => prevKey + 1);
        fetchItems();
      }
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setQuantity("");
  };

  return (
    <View style={styles.container}>
      <PageHead title={title} onPress={() => navigation.navigate("MSHome")} />

      <View style={styles.body}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: source }}
              style={{ marginTop: "10%", width: "90%", height: "100%" }}
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.remainingStock}>Remaining Stock:</Text>
            <Text style={styles.remainingWeight}>{remainingStock} Kg</Text>
          </View>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardPress(item)}>
              <View style={styles.card}>
                <View style={styles.row}>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: "35%",
                      height: "120%",
                      paddingHorizontal: "1%",
                      paddingVertical: "3%",
                    }}
                  />
                  <View style={styles.contentContainer}>
                    <Text style={styles.title}>
                      {item.fname} {item.lname}
                    </Text>
                    <Text style={styles.soldValue}>{item.contact}</Text>
                    <View style={styles.weightRow}>
                      <Text style={{ paddingTop: "1%", color: "#132939" }}>
                        {" "}
                        Remaining:{" "}
                      </Text>
                      <Text style={styles.weight}>{item.total_remain} Kg</Text>
                    </View>
                    {item.additionalNote && (
                      <View style={styles.weightRow}>
                        <Text style={styles.totalWeight}>Ps:</Text>
                        <Text style={styles.totalWeight}>
                          {item.additionalNote}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <BottomPopup isVisible={isPopupVisible} onClose={closePopup}>
        <View style={styles.popupContent}>
          <View style={styles.col}>
            <MaterialCommunityIcons
              name="weight-kilogram"
              size={32}
              color="#132939"
              style={{ paddingHorizontal: "4%" }}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter weight"
              keyboardType="numeric"
              placeholderTextColor="#999"
              value={quantity}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setQuantity(numericText);
                setDate(new Date());
              }}
            />
            <Text style={styles.constant}>Kg</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={buttonHandle}>
            <Text style={styles.buttonText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </BottomPopup>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#132939",
  },
  body: {
    flex: 14,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  imageContainer: {
    alignItems: "center",
    height: "60%",
    width: "50%",
  },
  content: {
    alignSelf: "flex-end",
    marginRight: "3%",
  },
  remainingStock: {
    fontSize: 15,
    color: "#132939",
    marginEnd: "7%",
  },
  remainingWeight: {
    fontSize: 25,
    marginLeft: 20,
    color: "#132939",
    fontWeight: "bold",
  },
  card: {
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
    padding: "3%",
    paddingVertical: "5%",
    marginVertical: "2%",
    shadowColor: "#000",
    elevation: 5,
  },
  row: {
    flexDirection: "row",
  },
  contentContainer: {
    justifyContent: "space-between",
    paddingStart: "15%",
    paddingBottom: "3%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#004344",
  },
  weightRow: {
    flexDirection: "row",
  },
  weight: {
    fontSize: 17,
    color: "#004344",
    fontWeight: "bold",
  },
  soldValue: {
    fontSize: 14,
    color: "#132939",
  },
  constant2: {
    fontSize: 14,
    color: "#132939",
  },
  totalWeight: {
    fontSize: 14,
    color: "#132939",
    marginTop: 5,
  },
  popupContent: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
  },
  textInput: {
    backgroundColor: "#F1F3F6",
    borderWidth: 1,
    marginBottom: 18,
    borderColor: "#132939",
    paddingLeft: 20,
    fontSize: 14,
    borderRadius: 10,
    paddingHorizontal: "50%",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#132939",
    paddingVertical: "2%",
    paddingHorizontal: "18%",
    marginTop: "6%",
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  col: {
    flexDirection: "row",
  },
  constant: {
    paddingTop: "2%",
    fontSize: 15,
    paddingLeft: "4%",
    paddingRight: "4%",
  },
});

export default SelectSeller;
