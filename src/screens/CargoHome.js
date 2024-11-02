import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome";
import ButtonSet from "../components/ButtonSet";
import PackageDetails from "./PackageDetails";

const CargoHome = () => {
  const [location, setLocation] = useState(null);
  const [additem, setAddItem] = useState(false);

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
      } else {
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
      }
    };
    getLocationPermission();
  }, []);

  // Function for Add Item
  const PackageDetailsPopup = () => {
    setAddItem(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.001,
            }}
            toolbarEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title='You are Here!'
            />
          </MapView>
        )}

        <View style={styles.textButtonContainer}>
          <Text style={styles.text}>Add your items here</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => PackageDetailsPopup()}
          >
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {additem && (
          <PackageDetails additem={additem} setAddItem={setAddItem} />
        )}

        <ButtonSet />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  textButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    right: 15,
    bottom: 15, // Adjust the bottom distance as needed
    width: '100%',
    alignItems: 'center',
  },  
  text: {
    marginRight: 8,
    fontSize: 20,
    fontWeight: "bold",
    color: "#004344",
  },  
  addButton: {
    justifyContent: 'center',
    backgroundColor: "#004344",
    paddingHorizontal: 15,
    padding: 13,
    borderRadius: 50,
  },
  bottomBar:{
    justifyContent: 'center',
  },
});

export default CargoHome;