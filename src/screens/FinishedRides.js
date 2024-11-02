import React,{useEffect, useState, useCallback} from 'react';
import { StyleSheet, View, TextInput} from 'react-native';
import ActivityIndicatorCustom from '../components/ActivityIndicatorCustom';
import { BASE_URL } from '../../config';
import Header from '../components/Header';
import RidesList from '../components/RidesList';
import GlobalStyles from '../styles/GlobalStyles';
import { useRideContext } from '../context/RideContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const FinishedRides= () =>{
    const navigation = useNavigation();
    const { id, token } = useRideContext();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);


    useFocusEffect(
        useCallback(() => {
            console.log('Fetching data on screen focus');
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/cf/finished_rides/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data /cf/current_rides/${id}`);
            }
            const data = await response.json();
            console.log(data);

            setRides(data);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    return (<View style={GlobalStyles.container}>
        <View style={GlobalStyles.container}>                        
            {loading ? (
                <ActivityIndicatorCustom indicatorName="Loading" color="#004344"/>
            ) : (  
                <View style={GlobalStyles.wrapper}>
                    <Header title="Finished Rides" goBack={onPress=() => navigation.goBack()}/> 
                    <View style={GlobalStyles.whiteContainer}>
                        <RidesList rides={rides} message="No finished rides found."/>
                    </View>
                </View>
            )}
        </View></View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default FinishedRides;
