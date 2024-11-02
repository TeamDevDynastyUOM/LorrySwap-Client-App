import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import DatePicker from "../components/DatePicker";
import PageHead from "../components/PageHead";
import CartCard from "../components/CartCards";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "../../config";
import { useRideContext } from "../context/RideContext";

const MarketSellerCart = ({ navigation }) => {
  const { id, token } = useRideContext();
  const [items, setItems] = useState([]);
  const [value, setValue] = useState(null);
  const [date, setDate] = useState(new Date()); // Define the date state
  const formattedDate = date.toISOString().split("T")[0];

  const fetchItems = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/order/OnDateBuyer/${formattedDate}/1`,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error in MS Cart: ${response.status}`);
      }
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setItems(data);
    } catch (error) {
      console.error("Error fetching items in msCart:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [formattedDate]);

  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [formattedDate])
  );

  const handleCardPress = (item) => {
    setValue(item.economic_center_id);

    navigation.navigate("Details", {
      value: item.economic_center_id, // Use item.economic_center_id directly here
      economicCenter: item.economic_center,
      selectedDate: formattedDate,
      total_Weight: item.total_order
    });
    console.log("Selected item:", item);
  };

  const generateUniqueKey = (item) => {
    const id = item.id || "no_id";
    const date = item.date || formattedDate;
    const economicCenter = item.economic_center || "no_center";
    return `${id}_${date}_${economicCenter}`;
  };

  return (
    <View style={styles.container}>
      <PageHead title="My Cart" onPress={() => navigation.navigate("MSHome")} />

      <View style={styles.datePickerContainer}>
        <DatePicker date={date} onDateChange={setDate} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => generateUniqueKey(item)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <CartCard
              totalWeight={item.total_order}
              showText={true}
              showPercentageText={["Kg"]}
              economicCenter={item.economic_center}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  datePickerContainer: {
    paddingLeft: "10%",
    paddingRight: "10%",
    paddingTop: "5%",
    paddingBottom: "10%",
  },
  label: {
    color: "#132939",
    fontSize: 15,
    paddingTop: "3%",
  },
  dateInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#132939",
    alignSelf: "flex-start",
    lineHeight: 35,
    paddingLeft: "12%",
    paddingRight: "2%",
  },
});
export default MarketSellerCart;
