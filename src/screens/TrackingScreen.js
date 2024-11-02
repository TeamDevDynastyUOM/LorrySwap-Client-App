import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import io from 'socket.io-client';
import axios from 'axios';

const TrackingScreen = ({ route }) => {
    const { driverId, plat, plon } = route.params;
    const [driverLocation, setDriverLocation] = useState({
        latitude: parseFloat(plat),
        longitude: parseFloat(plon)
    });
    const [path, setPath] = useState([]);
    const [estimatedTime, setEstimatedTime] = useState('');

    const GOOGLE_MAPS_API_KEY = 'AIzaSyACh5R4n7riZPvRd7MHiXlByMvSjdP6zI4';

    const fetchDirections = async (origin, destination, retries = 3) => {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
                params: {
                    origin: `${origin.latitude},${origin.longitude}`,
                    destination: `${destination.latitude},${destination.longitude}`,
                    mode: 'driving',
                    key: GOOGLE_MAPS_API_KEY
                }
            });
            console.log('Google Directions API response:', response.data);

            if (response.data.routes && response.data.routes.length > 0) {
                const points = decode(response.data.routes[0].overview_polyline.points);
                setPath(points);

                const duration = response.data.routes[0].legs[0].duration.text;
                setEstimatedTime(duration);
            } else if (retries > 0) {
                console.log('No routes found. Retrying with adjusted coordinates...');
                // Adjust coordinates slightly and retry
                const adjustedOrigin = {
                    latitude: origin.latitude + 0.001,
                    longitude: origin.longitude + 0.001
                };
                fetchDirections(adjustedOrigin, destination, retries - 1);
            } else {
                console.error('No routes found after retries');
                Alert.alert('No routes found', 'Could not find a path to the destination.');
            }
        } catch (error) {
            console.error('Error fetching directions:', error);
        }
    };

    // Decode polyline points
    const decode = (t, e) => {
        let points = [];
        for (let step, len = t.length, index = 0, lat = 0, lng = 0; index < len;) {
            let byte = null, shift = 0, result = 0;
            do {
                byte = t.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            lat += (result & 1 ? ~(result >> 1) : (result >> 1));
            shift = result = 0;
            do {
                byte = t.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            lng += (result & 1 ? ~(result >> 1) : (result >> 1));
            points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
        return points;
    };

    useEffect(() => {
        const socket = io('http://104.168.5.251:3000');

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('location_updates', (message) => {
            console.log('Received location update:', message);
            const locationData = JSON.parse(message);
            if (locationData.driver_id === driverId) {
                const newLocation = {
                    latitude: parseFloat(locationData.latitude),
                    longitude: parseFloat(locationData.longitude)
                };
                setDriverLocation(newLocation);
                fetchDirections(newLocation, { latitude: parseFloat(plat), longitude: parseFloat(plon) });
                console.log('Updated driver location:', newLocation);
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        return () => {
            socket.disconnect();
        };
    }, [driverId]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={MapView.PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker coordinate={driverLocation} title="Driver" 
                image={require('../assets/Truck.png')}/>
                <Marker coordinate={{ latitude: parseFloat(plat), longitude: parseFloat(plon) }} pinColor="blue" />
                {path.length > 0 && <Polyline coordinates={path} strokeColor="red" strokeWidth={4} />}
            </MapView>
            {estimatedTime ? (
                <View style={styles.estimatedTimeContainer}>
                    <Text style={styles.estimatedTimeText}>Estimated Time: {estimatedTime}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    estimatedTimeContainer: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 5,
    },
    estimatedTimeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TrackingScreen;
