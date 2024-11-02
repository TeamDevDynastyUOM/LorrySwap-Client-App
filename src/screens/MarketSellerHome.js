import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MarketSellerHomeCard from "../components/MarketSellerHomeCard";
import SelectECDropDown from "../components/SelectECDropDown";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DatePicker from "../components/DatePicker";
import { useCallback } from "react";
import { BASE_URL } from "../../config";
import ButtonSet from "../components/ButtonSet";
import { useRideContext } from "../context/RideContext";

const MarketSellerHome = ({ navigation }) => {
  const { id, token } = useRideContext();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date());
  const formattedDate = date.toISOString().split("T")[0];
  const data = filteredItems.length > 0 ? filteredItems : items;

  const fetchItems = async () => {
    try {
      let url;
      if (value === null) {
        (url = `${BASE_URL}/freshItem/${formattedDate}`),
          {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
            },
          };
      } else {
        (url = `${BASE_URL}/freshItem/OnDateEC/${formattedDate}/${value + 1}`),
          {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
            },
          };
      }
      const response = await fetch(url);
      const data = await response.json();
      console.log(
        "Fetching on:",
        value === null ? formattedDate : value + 1,
        formattedDate
      );
      setItems(data);
    } catch (error) {
      console.error("Error fetching items in msHome:", error);
    }
  };
  useEffect(() => {
    fetchItems();
  }, [date, value, formattedDate, navigation]);
  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [navigation])
  );

  const handleSearch = () => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const generateUniqueKey = (item) => {
    return `${item.item_id}_${item.name}_${item.seller_id}`;
  };

  const handleCrossIconPress = () => {
    setSearchText("");
    const filtered = items.filter(
      (item) => !value || item.economicCenter === value
    );
    setFilteredItems(filtered);
  };

  const handleCardPress = (item) => {
    if (value === null) {
      alert("Please select an economic center.");
      return;
    }
    console.log("Selected item:", item);
    navigation.navigate("SelectSeller", {
      title: item.name,
      itemId: item.item_id,
      value: value,
      seller_id: item.seller_id,
      selectedDate: formattedDate,
      total_remain: item.total_remain,
      source: item.image,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../assets/TopImage.jpg")}
        style={styles.imageTop}
      />
      <Image
        source={require("../assets/MainImage.jpg")}
        style={styles.imageMain}
      />
      <View
        style={[styles.dropdownContainer, isFocus && { borderColor: "blue" }]}
      >
        <SelectECDropDown
          value={value}
          isFocus={isFocus}
          setValue={setValue}
          setIsFocus={setIsFocus}
        />
      </View>
      <Text style={styles.welcome}>Hello,{"\n"}Fresh Day</Text>

      <View style={styles.body}>
        <View style={styles.datePickerContainer}>
          <DatePicker date={date} onDateChange={setDate} />
        </View>
      </View>

      <View style={styles.middleRow}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchText.trim() !== "" ? (
            <TouchableOpacity onPress={handleCrossIconPress}>
              <Icon name="times" size={20} color="#666" style={styles.icon} />
            </TouchableOpacity>
          ) : (
            <Icon
              name={searchText.trim() === "" ? "search" : "times-circle"}
              size={20}
              color="#666"
              style={styles.icon}
              onPress={handleSearch}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Cart")}
        >
          <View style={styles.viewCart}>
            <MaterialCommunityIcons
              name="cart-variant"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredItems.length > 0 ? filteredItems : items}
        keyExtractor={(item) => generateUniqueKey(item)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <MarketSellerHomeCard
              source={item.image}
              title={item.name}
              weight={item.total_remain}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>No matches found</Text>
        )}
      />
      <ButtonSet />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageTop: {
    width: "100%",
    height: "10%",
    resizeMode: "cover",
  },
  dropdownContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    marginLeft: "5%",
    marginRight: "5%",
    transform: [{ translateY: -375 }],
  },
  placeholderStyle: {
    fontSize: 16,
    opacity: 0.6,
    fontWeight: "bold",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  imageMain: {
    width: "100%",
    height: "30%",
    resizeMode: "cover",
  },
  welcome: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    top: "25%",
    left: "3%",
    marginLeft: "3%",
    position: "absolute",
  },
  middleRow: {
    flexDirection: "row",
    margin: "5%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    width: "80%",
    height: "80%",
  },
  input: {
    flex: 1,
    height: 40,
    paddingVertical: 0,
  },
  emptyMessage: {
    color: "#132939",
    fontSize: 15,
    alignSelf: "center",
  },
  icon: {
    marginLeft: 10,
  },
  viewCart: {
    backgroundColor: "#C5C5C5",
    borderRadius: 50,
    padding: 13,
  },
  label: {
    color: "#132939",
    fontSize: 15,
    paddingTop: "3%",
  },
});

export default MarketSellerHome;
