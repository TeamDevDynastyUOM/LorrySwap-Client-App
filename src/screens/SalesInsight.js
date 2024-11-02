import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import PageHead from "../components/PageHead";
import SelectECDropDown from "../components/SelectECDropDown";
import FlatListCard from "../components/FlatListCard";
import DatePicker from "../components/DatePicker";
import { useRideContext } from "../context/RideContext";
import { BASE_URL } from "../../config";

const SalesInsight = ({ navigation }) => {
  const { id, token } = useRideContext();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date());
  const formattedDate = date.toISOString().split("T")[0];

  const fetchItems = async () => {
    try {
      let url;
      if (value === null) {
        url = `${BASE_URL}/freshItem/1003/${formattedDate}`;
      } else {
        url = `${BASE_URL}/freshItem/1003/${
          value + 1
        }/${formattedDate}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          };
      }
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(
        "Fetching on:",
        value === null ? formattedDate : value + 1,
        formattedDate
      );
      setItems(data);
    } catch (error) {
      console.error("Error fetching items in SalesInsight:", error);
    }
  };
  useEffect(() => {
    fetchItems();
  }, [date, value]);

  return (
    <View style={styles.container}>
      <PageHead
        title="Sales Insight"
        onPress={() => navigation.navigate("ECHome")}
      />
      <View style={styles.header}>
        <SelectECDropDown
          value={value}
          isFocus={isFocus}
          setValue={setValue}
          setIsFocus={setIsFocus}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.datePickerContainer}>
          <DatePicker date={date} onDateChange={setDate} />
        </View>
        <FlatList
          data={items}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          renderItem={({ item }) => (
            <FlatListCard
              source={item.image}
              title={item.name}
              totalWeight={item.contribution}
              showPercentageText={["Kg"]}
              {...(item.order && item.order > 0
                ? {
                    sold: item.order,
                    showText: true,
                    showPercentageText: ["Kg", "Has Gone"],
                  }
                : {})}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#132939",
  },
  datePickerContainer: {
    paddingBottom: "7%",
  },
  body: {
    marginTop: 20,
    flex: 13,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});

export default SalesInsight;
