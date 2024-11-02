import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import io from 'socket.io-client';
import axios from 'axios';
import { BASE_URL } from "../../config";

const DirectionMap = ({ route }) => {
    const { orderId, startLat, startLon, endLat, endLon } = route.params;

    const startLatitude = parseFloat(startLat);
    const startLongitude = parseFloat(startLon);
    
    const endLatitude = parseFloat(endLat);
    const endLongitude = parseFloat(endLon);

    const [region, setRegion] = useState({
        latitude: startLatitude,
        longitude: startLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [driverLocation, setDriverLocation] = useState({
        latitude: startLatitude,
        longitude: startLongitude,
    });

    const origin = {
        latitude: startLatitude,
        longitude: startLongitude,
    };
    
    const destination = {
        latitude: endLatitude,
        longitude: endLongitude,
    };

    useEffect(() => {
        setRegion({
            latitude: (startLatitude + endLatitude) / 2,
            longitude: (startLongitude + endLongitude) / 2,
            latitudeDelta: Math.abs(startLatitude - endLatitude) * 1.5,
            longitudeDelta: Math.abs(startLongitude - endLongitude) * 1.5,
        });

        axios.get(`${BASE_URL}/cf/getDriverIdByOrderId/${orderId}`)
            .then(response => {
                const driverId = response.data.driverId;
                const socket = io('http://your-backend-url');

                socket.on('driver-location-update', (data) => {
                    if (data.driverId === driverId) {
                        const { latitude, longitude } = data;
                        setDriverLocation({ latitude, longitude });
                    }
                });

                return () => {
                    socket.disconnect();
                };
            })
            .catch(error => {
                console.error('Error fetching driver id:', error);
            });

    }, []);

    return (
        <MapView
            style={{ flex: 1 }}
            region={region}
            showsUserLocation
            loadingEnabled
        >
            <Marker
                coordinate={{
                    latitude: startLatitude,
                    longitude: startLongitude,
                }}
                title="Start"
            />
            <Marker
                coordinate={destination}
                title="Destination"
            />
            <Marker
                coordinate={driverLocation}
                title="Driver"
                // pinColor="red"
                image={require('../assets/Truck.png')}
            />
            <MapViewDirections
                origin={origin}
                destination={destination}
                apikey="AIzaSyACh5R4n7riZPvRd7MHiXlByMvSjdP6zI4"
                strokeWidth={6}
                strokeColor="blue"
            />
        </MapView>
    );
};

export default DirectionMap;
