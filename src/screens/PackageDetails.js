import React, { useState } from "react";
import {View,Text,Modal,StyleSheet,TextInput} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddLocationPop from "./AddLocationPop";
import ButtonText from "../components/ButtonText";
import CFPopupStyles from "../styles/CargoFinderPopupStyles";

const PackageDetails = ({ additem, setAddItem }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pType, setPType] = useState([]);
  const [TruckType, setTruckType] = useState([]);
  const [handleAddLocationPopup, setHandleAddLocationPopup] = useState(false);
  const [packageWeight, setPackageWeight] = useState("");
  const [packageHeight, setPackageHeight] = useState("");
  const [packageLength, setPackageLength] = useState("");
  const [packageWidth, setPackageWidth] = useState("");

  const packageType = [
    { key: "1", value: "Glass" },
    { key: "2", value: "Wood" },
    { key: "3", value: "Boxes" },
    { key: "4", value: "Plastic" },
    { key: "5", value: "Other" },
  ];
  const truckType = [
    { key: "1", value: "Covered" },
    { key: "2", value: "Uncovered" },
    { key: "3", value: "Freeze" },
  ];

  const onClose = () => {
    setAddItem(false);
  };

  const handleContinue = () => {

    // Validate Package Type
    if (!pType || !pType.value) {
      alert("Please select a package type.");
      return;
    }

    // Validate Package Weight
    if (!packageWeight || isNaN(packageWeight)) {
      alert("Please enter a valid package weight.");
      return;
    }

    // Validate Package Dimensions
    if (
      !packageHeight ||
      !packageLength ||
      !packageWidth ||
      isNaN(packageHeight) ||
      isNaN(packageLength) ||
      isNaN(packageWidth)
    ) {
      alert("Please enter valid package dimensions.");
      return;
    }

    // Validate Truck Type
    if (!TruckType || !TruckType.value) {
      alert("Please select a truck type.");
      return;
    }
    // setAddItem(false);
    setHandleAddLocationPopup(true);
  };

  const package_Type = pType.value;
  const truck_Type = TruckType.value;

  const inputData = {
    package_Type,
    truck_Type,
    packageWeight,
    packageHeight,
    packageLength,
    packageWidth,
  };

  return (
    <View style={CFPopupStyles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={additem}
        onRequestClose={() => {
          setModalVisible(!additem);
        }}
      >
        <View style={CFPopupStyles.modalContainer}>
          <View style={CFPopupStyles.modalContent}>
            <View style={CFPopupStyles.row}>
              <MaterialCommunityIcons
                name="glass-fragile"
                size={30}
                color="#004344"
              />

              <SelectDropdown
                data={packageType.map((item) => item.value)}
                defaultButtonText="Package Type"
                buttonTextStyle={CFPopupStyles.inputText} 
                buttonStyle={styles.buttonField}
                dropdownStyle={CFPopupStyles.dropDownStyle}
                onSelect={(selectedItem, index) => setPType(packageType[index])}
              />
            </View>

            {/* Create a Package weight */}
            <View style={CFPopupStyles.row}>
              <MaterialCommunityIcons
                name="weight-kilogram"
                size={30}
                color="#004344"
              />

              <TextInput
                placeholder="Package Weight"
                style={CFPopupStyles.inputField}
                keyboardType="numeric"
                onChangeText={(weight) => setPackageWeight(weight)}
              />

              <Text
                style={{
                  fontSize: 20,
                  marginTop: 4,
                  marginLeft: 7,
                  fontWeight: "bold",
                  color:"#004344"
                }}
              >
                Kg
              </Text>
            </View>

            <View style={CFPopupStyles.row}>
              <MaterialCommunityIcons
                name="package-down"
                size={30}
                color="#004344"
                marginRight={2}
              />
              <TextInput
                placeholder="Height"
                style={{...CFPopupStyles.inputFieldSmall, marginLeft: 20}}
                buttonStyle={CFPopupStyles.inputFieldContainer}
                textAlign="center"
                keyboardType="numeric"
                onChangeText={(height) => setPackageHeight(height)}
              />
              <Text style={{ fontSize: 20 }}>x</Text>
              <TextInput
                placeholder="Length"
                style={CFPopupStyles.inputFieldSmall}
                buttonStyle={CFPopupStyles.inputFieldContainer}
                textAlign="center"
                keyboardType="numeric"
                onChangeText={(length) => setPackageLength(length)}
              />
              <Text style={{ fontSize: 20 }}>x</Text>
              <TextInput
                placeholder="Width"
                style={CFPopupStyles.inputFieldSmall}
                buttonStyle={CFPopupStyles.inputFieldContainer}
                textAlign="center"
                keyboardType="numeric"
                onChangeText={(width) => setPackageWidth(width)}
              />
              <Text style={{ fontSize: 20, fontWeight: "bold", color:"#004344" }}>m </Text>
              <Text style={{fontSize: 14, marginBottom:10,marginLeft: -5, color:"#004344"  }}>3</Text>
              
            </View>
          

            {/* Creating truck type container */}
            <View style={CFPopupStyles.row}>
              <MaterialCommunityIcons name="truck" size={30} color="#004344" />

              <SelectDropdown
                data={truckType.map((item) => item.value)}
                defaultButtonText="Truck Type"
                buttonTextStyle={CFPopupStyles.inputText} 
                buttonStyle={styles.buttonField}
                dropdownStyle={CFPopupStyles.dropDownStyle}
                onSelect={(selectedItem, index) => setTruckType(truckType[index])}
              />
            </View>

            <View style={CFPopupStyles.bottomButtonSet}>
              <ButtonText buttonName="Back" onPress={onClose} alignIcon="left"/>
              <ButtonText buttonName="Continue" onPress={handleContinue} alignIcon="right"/>
            </View>
          </View>
        </View>
      </Modal>
      {handleAddLocationPopup && (
        <AddLocationPop
          handleAddLocationPopup={handleAddLocationPopup}
          setHandleAddLocationPopup={setHandleAddLocationPopup}
          inputData={inputData}
          setAddItem={setAddItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonField: {
    flex:1,
    height: 35,
    marginLeft: 20,
    borderBottomWidth: 1.5,
    backgroundColor: "white",
    borderColor: "#004344",
    fontSize: 16,
    justifyContent: "flex-start",
    paddingLeft: 3,
  },
  dropDownStyle: {
    borderRadius: 5,
  }
});

export default PackageDetails;
