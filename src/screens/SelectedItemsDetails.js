import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Text,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PageHead from "../components/PageHead";
import BottomPopup from "../components/BottomPopup";
import FlatListCard from "../components/FlatListCard";
import CustomButton from "../components/CustomButton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_URL } from "../../config";
import SearchLocation from "../components/SearchLocation";
import CFPopupStyles from "../styles/CargoFinderPopupStyles";
import { useRideContext } from "../context/RideContext";
import useDistance from "../hooks/useDistance";

const SelectedItemsDetails = ({ route }) => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isContinueVisible, setIsContinueVisible] = useState(false);
  const [destination, setDestination] = useState("");
  const [totalOrder, setTotalOrder] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState("");
  const now = new Date();
  const formattedDate = selectedDate.split("T")[0];
  const [selectedType, setSelectedType] = useState("");
  const [type, setType] = useState("");
  const [isTypePickerVisible, setIsTypePickerVisible] = useState(false);
  const [isFindTruckVisible, setIsFindTruckVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [newModal, setNewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState();

  const { id, token} = useRideContext()

  
  const { selectedDate, value, economicCenter, total_Weight } = route.params;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/order/OnDateBuyerEC/${formattedDate}/${value}/1`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error(`Error in SelectedItemDetails: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched items in SelectedItemDetails:", data);
        setItems(data);
        pickup_location = data[0]?.pickup_location;
        total_Weight = data[0]?.total_order;
        plat = data[0]?.plat;
        plon = data[0]?.plon; 
      } catch (error) {
        console.error("Error fetching items in SelectedItemDetails:", error);
      }
    };
    fetchItems();
  }, [formattedDate, value]);

  const closePopup = () => {
    setIsPopupVisible(false);
    setIsContinueVisible(false); // Close both popups
  };

  const updateButtonHandle = async () => {
    try {
      const data = {
        totalOrder: parseInt(quantity),
        date: selectedItem.date,
        economic_center_id: value,
        name: selectedItem.name,
        seller_id: selectedItem.seller_id,
        id: selectedItem.id,
        item_id: selectedItem.item_id,
        freshItem_id: selectedItem.freshItem_id,
      };

      const response = await fetch(
        `${BASE_URL}/freshItem/OnDateNameSellerEC/${formattedDate}/${value}/${selectedItem.item_id}/${selectedItem.seller_id}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch fresh item: ${response.status}`);
      }
      const fetchingItem = await response.json();
      const available = fetchingItem[0]?.total_remain;
      const freshItem_id = fetchingItem[0]?.id;
      console.log("Available:", available);
      console.log("Fresh Item ID:", freshItem_id);

      const updatedData = {
        total_order: data.totalOrder,
        freshItem_id: freshItem_id,
      };

      if (isNaN(data.totalOrder) || data.totalOrder <= 0) {
        Alert.alert("Error", "Please enter a valid quantity");
        return;
      } else if (data.totalOrder > available + selectedItem.total_order) {
        Alert.alert(
          "Error",
          `Currently only ${available} Kg is available. Please enter a valid quantity.`
        );
        return;
      }

      const updateResponse = await fetch(
        `${BASE_URL}/order/UpdateOrder/${selectedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!updateResponse.ok) {
        throw new Error(`Failed to update order: ${updateResponse.status}`);
      }
      const updateData = await updateResponse.json();
      console.log("Update Response:", updateData);

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id ? { ...item, ...updatedData } : item
        )
      );

      closePopup(); // Close the popup after successful update
    } catch (error) {
      console.error("Error updating item:", error);
      Alert.alert("Error", "Failed to update item. Please try again later.");
    }
  };

  const deleteButtonHandle = async () => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${selectedItem.name} total on ${formattedDate}?`,
      [
        {
          text: "Cancel",
          onPress: closePopup,
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const response = await fetch(
              `${BASE_URL}/freshItem/OnDateNameSellerEC/${formattedDate}/${value}/${selectedItem.item_id}/${selectedItem.seller_id}`,
              {
                method: "GET",
              }
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch fresh item: ${response.status}`);
            }
            const fetchingItem = await response.json();
            const freshItem_id = fetchingItem[0]?.id;
            console.log("Fresh Item ID:", freshItem_id);

            try {
              const response = await fetch(
                `${BASE_URL}/order/deleteOrder/${selectedItem.id}/${freshItem_id}`,
                {
                  method: "DELETE",
                }
              );

              const data = await response.json();
              console.log("Delete Response:", data);

              setItems((prevItems) =>
                prevItems.filter((item) => item.id !== selectedItem.id)
              );
              closePopup(); // Close the popup after successful deletion
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const createRide = async () => {
    setLoading(true);
    const data = {
      contact_recipient: "1234567890",
      date: new Date(formattedDate).toISOString(),
      weight: total_Weight,
      location: pickup_location,
      plat: plat,
      plon: plon,
      package_type: "crop",
      truck_type: type,
      dlat: destination.details?.geometry?.location?.lat.toString(),
      dlon: destination.details?.geometry?.location?.lng.toString(),
      destination: destination.details?.name,
      user_id: id,
      cost : cost
    };

    try {
      const response = await fetch(`${BASE_URL}/cf/create_MSDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("response", response);
      if (!response.ok) {
        throw new Error("Failed to submit data");
      } else {
        const responseData = await response.json();
        console.log("Response from backend:", responseData);

        const orderId1 = responseData.order_id;
        setOrderId(orderId1);
        setNewModal(true); // This will open the SelectRideOption modal
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert("Error", "Failed to submit data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (item) => {
    const itemDate = new Date(item.date);
    const itemBringingDate = new Date(item.bringing_date);
    if (
      itemDate.getTime() + 86400000 < now.getTime() &&
      itemBringingDate.getTime() < now.getTime() + 86400000
    ) {
      setSelectedItem(item);
      setIsPopupVisible(true);
    }
  };

  const handleContinue = () => {
    setIsContinueVisible(true);
  };

  const handleFindTruck = () => {
    // Functionality for finding a truck can be implemented here
  };

  const handleSelectType = (type) => {
    setType(type);
    setSelectedType(type);
    setIsTypePickerVisible(false);
  };

  const handleCreateRide = () => {
    if (!destination) {
      Alert.alert("Missing Information", "Please Select your destination.");
    } else if (!type) {
      Alert.alert("Missing Information", "Please Select a truck type.");
    } else {
      createRide();
      closePopup();
      setIsFindTruckVisible(true);
    }
  };

  const navigateToSearchDriver = () => {
    const item = { id: orderId}
    closePopup();
    navigation.navigate('SearchDriver', {item: item})
  }

  const navigateToRides = () => {
    closePopup();
    navigation.navigate('Rides')
  }

  const selectedItems = useMemo(() => ({
    plat: plat,
    plon: plon,
    dlat: destination.details?.geometry?.location?.lat.toString(),
    dlon: destination.details?.geometry?.location?.lng.toString(),
  }), [ ]);

  const { distance, error } = useDistance(selectedItems);

  useEffect(() => {
      if (distance) {
          const totalCost = parseFloat(distance) * 18;
          const roundedTotalCost = totalCost.toFixed(2);
          setCost(roundedTotalCost);
      } else {
          setCost(0);
      }
  }, [distance, error]);

  return (
    <View style={styles.container}>
      <PageHead
        title={`${economicCenter}`}
        onPress={() => navigation.navigate("Cart")}
      />

      <View style={styles.body}>
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardPress(item)}>
              <FlatListCard
                source={item.image}
                totalWeight={item.total_order}
                title={item.seller}
                showText={true}
                showPercentageText={["Kg"]}
                sellerName={item.name}
                contactNumber={item.contact}
              />
            </TouchableOpacity>
          )}
        />
        <CustomButton
          title="Continue"
          onPress={handleContinue}
          style={{ marginBottom: "7%" }}
        />
      </View>

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
                      selectedItem.total_order !== undefined &&
                      selectedItem.total_order !== null
                        ? selectedItem.total_order.toString()
                        : ""
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

      <BottomPopup isVisible={isContinueVisible} onClose={closePopup}>
        <View style={{ marginHorizontal: "5%", paddingRight: "5%" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", paddingHorizontal: "7%" }}>
              <Text
                style={{ paddingLeft: "5%", paddingTop: "4%", fontSize: 15 }}
              >
                Destination
              </Text>
              <View style={CFPopupStyles.row}>
                <SearchLocation
                  placeholder={"Setup Destination"}
                  setDestination={setDestination}
                />
              </View>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: "2%",
                paddingBottom: "5%",
              }}
            >
              <Text
                style={{ paddingLeft: "12%", paddingTop: "2%", fontSize: 15 }}
              >
                Truck Type
              </Text>
              <TouchableOpacity
                style={[
                  styles.pickerBorder,
                  { borderBottomWidth: 2, borderBottomColor: "#004344" },
                ]}
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

              <Modal
                transparent={true}
                visible={isTypePickerVisible}
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <FlatList
                      data={[
                        { id: "Covered", name: "Covered" },
                        { id: "Non-Covered", name: "Non-Covered" },
                        { id: "Freeze", name: "Freeze" },
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
            </View>
          </View>

            <View style={{justifyContent: "flex-end",marginTop: 5, marginBottom: 10}}>
              <Text style={{ fontSize: 15, color: '#004344' }}>
                Total Cost is <Text style={{ fontSize: 19, fontWeight: 'bold' }}>  Rs.{cost}</Text>
              </Text>
            </View>

          <CustomButton
            title="Create Ride"
            onPress={handleCreateRide}
            style={{ marginBottom: "7%" }}
          />
        </View>
      </BottomPopup>

      <BottomPopup isVisible={isFindTruckVisible} onClose={closePopup}>
        <View style={styles.popupContent}>
          <CustomButton
            title="Search Driver"
            onPress={navigateToSearchDriver}
            style={{ marginBottom: "7%" }}
          />
          <CustomButton
            title="Waiting for Driver"
            onPress={navigateToRides}
            style={{ marginBottom: "7%" }}
          />
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
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: "7%",
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
    fontWeight: "bold",
    width: 100, // Adjusted for proper alignment
  },
  popupContent: {
    padding: 20,
  },
  pickerBorder: {
    borderWidth: 0,
    borderColor: "#132939",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginLeft: 10,
  },
  placeholderText: {
    fontSize: 15,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderType: "none",
    padding: 30,
  },
  pickerItem: {
    padding: 10,
  },
  closeButton: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#132939",
  },
});

export default SelectedItemsDetails;
