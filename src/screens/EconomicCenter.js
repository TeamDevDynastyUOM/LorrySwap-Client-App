import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import FlatListCard from "../components/FlatListCard";
import PageHead from "../components/PageHead";
import SelectECDropDown from "../components/SelectECDropDown";
import DatePicker from "../components/DatePicker";
import { BASE_URL } from '../../config';
import { useRideContext } from "../context/RideContext";
import axios from "axios";
import ButtonSet from "../components/ButtonSet";

const EconomicCenter = ({ navigation }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date());
  const formattedDate = date.toISOString().split("T")[0];
  const { id, token } = useRideContext();
  const [isLoading, setIsLoading] = useState(false);


  const fetchItems = async () => {
    try {
      let url;
      if (value === null) {
        url = `${BASE_URL}/freshItem/OnSellerDate/${id}/${formattedDate}`;
      } else {
        (url = `${BASE_URL}/freshItem/OnSellerDateEC/${id}/${
          value + 1
        }/${formattedDate}`),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
      }
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
  const generateKey = (item, index) => {
    return item.id ? item.id.toString() : `${index}-${item.name}`;
  };

  return (
    <View style={styles.container}>
      <PageHead
        title="Economic Center"
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
          keyExtractor={(item, index) => generateKey(item, index)}
          renderItem={({ item, index }) => (
            <FlatListCard
              key={generateKey(item, index)}
              source={item.image}
              title={item.name}
              totalWeight={item.total_weight}
              ownContribution={item.percentage}
              showText={true}
              showPercentageText={["Kg", "From Yours"]}
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
  datePickerContainer:{
    paddingBottom: "7%"
  },
  body: {
    marginTop: 20,
    flex: 13,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});

export default EconomicCenter;
