import React, { useState, useEffect,useMemo } from "react";
import {StyleSheet,Text,View,Modal,TouchableOpacity,TextInput,Platform,Alert } from "react-native";
import { FontAwesome, Entypo, Feather } from "@expo/vector-icons";
import SearchLocation from "../components/SearchLocation";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectRideOption from "./SelectRideOption";
import ButtonText from "../components/ButtonText";
import ButtonContained from "../components/ButtonContained";
import useDistance from "../hooks/useDistance";
import CFPopupStyles from "../styles/CargoFinderPopupStyles";
import { BASE_URL } from "../../config";
import { useRideContext } from "../context/RideContext";

const AddLocationPop = ({handleAddLocationPopup, 
  setHandleAddLocationPopup, setAddItem, inputData}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState({});
  const [destination, setDestination] = useState({});
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contact, setContactNumber] = useState("");
  const [cost, setCost] = useState();

  const [contactError, setContactError] = useState("");

  const [newModal, setNewModal] = useState(false)
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  const { id, token } = useRideContext();

  const now = new Date();

  const onClose = () => {
    setHandleAddLocationPopup(false);
    setAddItem(true);
  }

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // Close the date picker on iOS
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const validateContactNumber = () => {
    // Regular expression pattern for a valid phone number (10 digits)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(contact)) {
      setContactError("Please enter a valid 10-digit phone number");
      return false;
    }
    setContactError(""); // Clear the error message if validation passes
    return true;
  };

  const resetFields = () => {
    setLocation({});
    setDestination({});
    setContactNumber("");
  };

  console.log(inputData);

  const data = {
    package_type: inputData.package_Type,
    weight: parseInt(inputData.packageWeight),
    height: parseInt(inputData.packageHeight),
    length: parseInt(inputData.packageLength),
    width: parseInt(inputData.packageWidth),
    truck_type: inputData.truck_Type,
    plat: location.details?.geometry?.location?.lat.toString(),
    plon: location.details?.geometry?.location?.lng.toString(),
    dlat: destination.details?.geometry?.location?.lat.toString(),
    dlon: destination.details?.geometry?.location?.lng.toString(),
    user_id: id,
    location: location.details?.name,
    destination: destination.details?.name,
    date: date,
    contact_recipient: contact,
    cost: cost
  };
  console.log(data);

  const selectedItem = useMemo(() => ({
    plat: data.plat,
    plon: data.plon,
    dlat: data.dlat,
    dlon: data.dlon
  }), [data.location, data.destination]);

  const { distance, error } = useDistance(selectedItem);

  useEffect(() => {
      if (distance) {
          const totalCost = parseFloat(distance) * 18;
          const roundedTotalCost = totalCost.toFixed(2);
          setCost(roundedTotalCost);
      } else {
          setCost(0);
      }
  }, [distance, error]);

  const handleButtonPress = async () => {
    // Check if location or destination is null
    if (!data.plat) {
      alert("Please enter both pickup location and destination");
      return; // Stop further execution if either location or destination is null
    }

    if (!data.dlat) {
      alert("Please enter both pickup location and destination");
      return; // Stop further execution if either location or destination is null
    }

    // Validate the contact number before proceeding
    if (!validateContactNumber()) {
      alert("Enter Valid Phone Number");
      return; // Stop further execution if validation fails
    }
    setLoading(true); // Start loading
    Alert.alert('Attention Required!',
      "The recipient's phone number helps to trace the exact location of the recipient. So it must be correct.", [
      { text: 'Close', onPress: () => setLoading(false) },
      { text: 'OK', onPress: () => createRide() },
    ]);
  };

  const createRide = async () =>{
    try {    
      const response = await fetch( `${BASE_URL}/cf/create_ride`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(data),
        }
      );
      console.log("response",response);
      if (!response.ok) {
        throw new Error("Failed to submit data");
      }
      else{
        const responseData = await response.json();
        console.log("Response from backend:", responseData);

        // Assuming your backend returns an order ID in responseData
        const orderId1 = responseData.order_id; // Adjust this based on your actual response structure

        // Navigate to SelectRideOption screen
        setOrderId(orderId1)
        console.log(orderId)
        console.log("new model:",newModal)
        setNewModal(true); // This will open the SelectRideOption modal
        
        console.log("new model:",newModal)
      }
    }catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert("Error", "Failed to submit data. Please try again later.");
    }finally{
      setLoading(false);
    }
  }

  return (
    <View style={CFPopupStyles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={handleAddLocationPopup}
        onRequestClose={() => {
          setModalVisible(!handleAddLocationPopup);
        }}
      >
        <View style={CFPopupStyles.modalContainer}>
        <View style={{...CFPopupStyles.modalContent, height: 350}}>
            <View style={CFPopupStyles.row}>
              <Entypo name="location-pin" size={30} color="#004344" 
                style={styles.locationIcon}/>
              <SearchLocation
                placeholder={"Pickup Location"}
                setLocation={setLocation}
                setDestination={setDestination}
              />
            </View>

            <View style={CFPopupStyles.row}>
              <Entypo name="location" size={30} color="#004344" 
                style={styles.locationIcon}/>
              <SearchLocation
                placeholder={"Destination"}
                setLocation={setLocation}
                setDestination={setDestination}
              />
            </View>

            <View style={CFPopupStyles.row}>
              <Feather name="phone-call" size={28} color="#004344" 
                style={styles.locationIcon}/>
              <TextInput
                placeholder="Recipient Contact Number"
                style={CFPopupStyles.inputField}
                onChangeText={(number) => setContactNumber(number)}
              />
            </View>
            {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}
            <View style={CFPopupStyles.row}>
              <FontAwesome name="calendar" size={28} color="#004344"
                style={styles.locationIcon}/>
              {Platform.OS === "android" ? (
                <TouchableOpacity
                  onPress={openDatePicker}
                  style={CFPopupStyles.inputField}
                >
                  <Text>{date.toDateString()}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text>{date.toDateString()}</Text>
                </TouchableOpacity>
              )}
              {showDatePicker && (
                <DateTimePicker
                  testID="datePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={now}
                />
              )}
            </View>
            <View style={{justifyContent: "flex-end",marginTop: 5, marginBottom: 10}}>
              <Text style={{ fontSize: 15, color: '#004344' }}>
                Total Cost is <Text style={{ fontSize: 19, fontWeight: 'bold' }}>  Rs.{cost}</Text>
              </Text>
            </View>

            <View style={CFPopupStyles.bottomButtonSet}> 
              <ButtonText buttonName="Back" onPress={onClose} alignIcon="left"/>
              <ButtonContained buttonName="Create " 
                onPress={handleButtonPress} iconName="clipboard-list" 
                alignIcon="left" loading={loading}
              />
            </View>

          </View>
        </View>
      </Modal>
      {newModal && (
        <SelectRideOption newModal={newModal} setNewModal={setNewModal} 
          setAddItem={setAddItem} orderId={orderId} 
          setHandleAddLocationPopup={setHandleAddLocationPopup}
        />
      )}
    </View>
  );
};

export default AddLocationPop;

const styles = StyleSheet.create({
  
  locationIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#121211",
    fontSize: 21,
    fontWeight:'500'
  },
  errorText: {
    color: "red",
    marginTop: -12,
    marginBottom: 10,
    marginLeft: 50,
    alignSelf:'center'
  },
});
