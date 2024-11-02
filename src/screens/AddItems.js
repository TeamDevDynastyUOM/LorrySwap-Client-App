import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SelectECDropDown from "../components/SelectECDropDown";
import PageHead from "../components/PageHead";
import axios from "axios";
import CustomButton from "../components/CustomButton";
import DatePicker from "../components/DatePicker";
import { BASE_URL } from "../../config";
import { useRideContext } from "../context/RideContext";
import DateTimePicker from "@react-native-community/datetimepicker";


const AddItems = ({ navigation }) => {
  const { id, token } = useRideContext();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());
  const [additionalNote, setAdditionalNote] = useState("");
  const now = new Date();
  const maxFutureDate = new Date();
  maxFutureDate.setDate(now.getDate() + 7);
  const [typeError, setTypeError] = useState("");
  const [nameError, setNameError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTypePickerVisible, setIsTypePickerVisible] = useState(false);
  const [isNamePickerVisible, setIsNamePickerVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const today = new Date();
  const maxDate = new Date(today);

  maxDate.setDate(today.getDate() + 7);

  const handleButtonPress = () => {
    if (value === null) {
      alert("Please select an economic center.");
      return;
    }

    if (!type) {
      setTypeError("Type is required");
      return;
    }
    if (!name) {
      setNameError("Name is required");
      return;
    }
    if (!weight) {
      setWeightError("Weight is required");
      return;
    }
    setTypeError("");
    setNameError("");
    setWeightError("");

    const formattedDate = date.toISOString();

    const data = {
      name: parseInt(selectedName),
      weight: parseInt(weight),
      date: formattedDate,
      additionalNote: additionalNote.toString(),
      value: parseInt(value + 1),
    };

    fetch(`${BASE_URL}/freshItem/1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("Item added successfully:", data);
        navigation.navigate("ECHome");
      })
      .catch((error) => {
        console.error("Error adding item:", error);
      });
  };

  useEffect(() => {
    if (type === "Fruits") {
      fetchFruitItems();
    } else if (type === "Leaf") {
      fetchLeafItems();
    } else if (type === "Vegetables") {
      fetchVegetableItems();
    }
  }, [type]);

  const fetchFruitItems = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/item/fruit`)
      .then((response) => {
        setItems(response.data.fruits);
      })
      .catch((error) => {
        console.error("Error fetching fruit items:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchLeafItems = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/item/leaf`)
      .then((response) => {
        setItems(response.data.leaf);
      })
      .catch((error) => {
        console.error("Error fetching leaf items:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchVegetableItems = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/item/vegetable`)
      .then((response) => {
        setItems(response.data.vegetables);
      })
      .catch((error) => {
        console.error("Error fetching vegetable items:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectType = (itemValue) => {
    setType(itemValue);
    setSelectedType(itemValue); // Set selected type
    setIsTypePickerVisible(false);
  };

  const handleSelectName = (itemID, itemName) => {
    setName(itemName);
    setSelectedName(itemID); // Set selected name
    setIsNamePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <PageHead
        title="Add Item"
        onPress={() => navigation.navigate("ECHome")}
      />
      <SelectECDropDown
        value={value}
        isFocus={isFocus}
        setValue={setValue}
        setIsFocus={setIsFocus}
      />
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.form}>
            <KeyboardAvoidingView>
              <Text style={styles.label}>Type</Text>
              <TouchableOpacity
                style={styles.pickerBorder}
                onPress={() => setIsTypePickerVisible(true)}
              >
                <Text
                  style={[
                    styles.placeholderText,
                    selectedType ? { color: "black" } : null,
                  ]}
                >
                  {type ? type : "Select Type"}
                </Text>
              </TouchableOpacity>
              {typeError ? <Text style={styles.error}>{typeError}</Text> : null}

              <Modal
                transparent={true}
                visible={isTypePickerVisible}
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <FlatList
                      data={[
                        { id: "Fruits", name: "Fruits" },
                        { id: "Leaf", name: "Leaves" },
                        { id: "Vegetables", name: "Vegetables" },
                      ]}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.pickerItem}
                          onPress={() => {
                            handleSelectType(item.id);
                          }}
                        >
                          <Text
                            style={[
                              {
                                color:
                                  selectedType === item.id
                                    ? "black"
                                    : "rgba(0, 0, 0, 0.6)",
                              },
                            ]}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity
                      onPress={() => setIsTypePickerVisible(false)}
                    >
                      <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <Text style={styles.label}>Name</Text>
              <TouchableOpacity
                style={styles.pickerBorder}
                onPress={() => setIsNamePickerVisible(true)}
              >
                <Text
                  style={[
                    styles.placeholderText,
                    selectedName ? { color: "black" } : null,
                  ]}
                >
                  {name || "Select Name"}
                </Text>
              </TouchableOpacity>
              {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

              <Modal
                transparent={true}
                visible={isNamePickerVisible}
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TextInput
                      style={styles.searchBar}
                      placeholder="Search..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    <FlatList
                      data={filteredItems}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.pickerItem}
                          onPress={() => handleSelectName(item.id, item.name)}
                        >
                          <Text
                            style={[
                              {
                                color:
                                  selectedName === item.name
                                    ? "black"
                                    : "rgba(0, 0, 0, 0.6)",
                              },
                            ]}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity
                      onPress={() => setIsNamePickerVisible(false)}
                    >
                      <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <Text style={styles.label}>Weight</Text>
              <View style={styles.row}>
                <TextInput
                  style={styles.weightInput}
                  value={weight}
                  placeholder="Enter Weight"
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, "");
                    setWeight(numericText);
                  }}
                />
                <Text style={styles.weightLabel}>Kg</Text>
              </View>
              {weightError ? (
                <Text style={styles.error}>{weightError}</Text>
              ) : null}

              <View style={styles.datePickerContainer}>
                <Text style={styles.label}>Brings on</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateInput}>{date.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    testID="datePicker"
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate || date;
                      setShowDatePicker(false);
                      setDate(currentDate); // Ensure date is updated here
                    }}
                    minimumDate={today}
                    maximumDate={maxDate}
                  />
                )}
              </View>

              <Text style={styles.label}>Additional Note</Text>
              <TextInput
                style={styles.textArea}
                value={additionalNote}
                onChangeText={setAdditionalNote}
                multiline
                placeholder="Add your note here"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
              />
            </KeyboardAvoidingView>

            <View style={styles.buttonSpace}>
              <CustomButton title="Add Items →" onPress={handleButtonPress} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#132939",
  },
  body: {
    marginTop: 20,
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },
  form: {
    width: "82%",
    marginTop: "7%",
  },
  label: {
    color: "#132939",
    fontSize: 15,
    paddingTop: "3%",
  },
  weightLabel: {
    color: "#132939",
    fontSize: 15,
    paddingTop: "5%",
    paddingLeft: "2%",
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
  weightInput: {
    height: 50,
    width: "90%",
    borderBottomWidth: 1,
    borderColor: "#132939",
    paddingLeft: "5%",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "3%",
  },
  pickerBorder: {
    borderBottomWidth: 1,
    borderColor: "#132939",
    paddingBottom: 10, // Padding added here
  },
  placeholderText: {
    color: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10, // Padding adjusted here
  },
  textArea: {
    paddingTop: "3%",
    paddingLeft: "5%",
    paddingBottom: "3%",
    borderColor: "#132939",
    borderBottomWidth: 1,
    fontSize: 15,
  },
  error: {
    color: "red",
    fontSize: 12,
    paddingTop: 5,
  },
  buttonSpace: {
    marginTop: 20,
    marginBottom: "50%",
    width: "100%",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    color: "blue",
    marginTop: 10,
    textAlign: "center",
  },
  datePickerContainer: {
    borderColor: "#132939",
    marginBottom: "3%",
  },
  pickerItem: {
    padding: 10,
  },
});

export default AddItems;
