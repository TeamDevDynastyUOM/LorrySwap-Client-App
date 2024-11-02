import React from 'react';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Geolocation from 'react-native-geolocation-service';
navigator.geolocation = Geolocation;

const SearchLocation = ({placeholder, setLocation, setDestination }) => {
    const handlePress = (data, details = null) => {
        // Check if the details object is present
        if (!details) {
            console.error("No details object returned from Google Places API");
            return;
        }

        if (placeholder === 'Pickup Location') {
            setLocation({ data, details });
        } else {
            setDestination({ data, details });
        }
    }

    return (
        <GooglePlacesAutocomplete
            placeholder={placeholder}
            fetchDetails={true}
            onPress={handlePress}
            query={{
                key: "AIzaSyACh5R4n7riZPvRd7MHiXlByMvSjdP6zI4",
                language: "en",
            }}
            styles={{
                container: {
                    marginLeft: 15,
                },
                textInputContainer: {
                    height: 38,
                    borderBottomWidth: 1.5,
                    borderColor: "#004344",
                    borderRadius: 5,
                },
                textInput: {
                    height: "100%",
                    color: "#004344",
                    fontSize: 16,
                },
                predefinedPlacesDescription: {
                    color: "#004344",
                },
                listView: {
                    position: "absolute",
                    top: 38, // Adjust this value to position the dropdown below the search bar
                    maxHeight: 200, // Set a fixed height for the dropdown
                    backgroundColor: "white", // Background color of the dropdown
                    borderWidth: 1.5,
                    borderColor: "#004344",
                    borderRadius: 5,
                    overflow: "scroll", // Enable scrolling for the dropdown
                    zIndex: 1000
                },
            }}
            onFail={(error) => console.error(error)}
            onFocus={() => {
                // Handle the keyboard focus event here
                console.log("Search bar focused");
            }}
        />
    );
};

export default SearchLocation;
