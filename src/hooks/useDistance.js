import { useState, useEffect } from 'react';

const useDistance = (selectedItem) => {
    const [distance, setDistance] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDistanceMatrix = async () => {
            try {
                const apiKey = "AIzaSyACh5R4n7riZPvRd7MHiXlByMvSjdP6zI4";
                const originLat = selectedItem.plat;
                const originLng = selectedItem.plon;
                const destinationLat = selectedItem.dlat;
                const destinationLng = selectedItem.dlon;
                const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destinationLat},${destinationLng}&key=${apiKey}`;

                const response = await fetch(url);
                const data = await response.json();

                // Extract distance from the response
                const { distance } = data.rows[0].elements[0];

                // Set the distance state
                setDistance(distance.text);
            } catch (error) {
                console.log('Error fetching distance matrix:(Please Enter Location and destination)', error);
                setError(error);
            }
        };
        fetchDistanceMatrix();
    }, [selectedItem]);

    return { distance, error };
};

export default useDistance;
