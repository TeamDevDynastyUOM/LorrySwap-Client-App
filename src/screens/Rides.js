import React,{useEffect, useState, useCallback} from 'react';
import { StyleSheet,Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import ActivityIndicatorCustom from '../components/ActivityIndicatorCustom';
import { Feather } from '@expo/vector-icons';
import { BASE_URL } from '../../config';
import RidesList from '../components/RidesList';
import GlobalStyles from '../styles/GlobalStyles';
import { useRideContext } from '../context/RideContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Rides= () =>{
    const navigation = useNavigation();
    const { id, token } = useRideContext();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingButtonPress, setLoadingButtonPress] = useState(false);


    useFocusEffect(
        useCallback(() => {
            console.log('Fetching data on screen focus');
            setLoadingButtonPress(false);
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/cf/current_rides/${id}`, {
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


    return (
        <View style={GlobalStyles.container}>                        
            {loading ? (
                <ActivityIndicatorCustom indicatorName="Loading" color="#004344"/>
            ) : (  
                <View style={GlobalStyles.wrapper}>
                    <View style={{...GlobalStyles.header, justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => navigation.goBack() }> 
                                <Feather style={GlobalStyles.iconHeader} name="arrow-left" size={20} color="white"/>
                            </TouchableOpacity>
                            <Text style={GlobalStyles.pageTitle}>Rides</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate('FinishedRides') }> 
                                <Feather style={GlobalStyles.iconHeader} name="check-square" size={20} color="white"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={GlobalStyles.whiteContainer}>
                        <RidesList rides={rides} setLoadingButtonPress={setLoadingButtonPress} message="There no items added."/>
                    </View>
                    {loadingButtonPress && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#004344" />
                             {/* <Text style={GlobalStyles.loadingText}>Loading...</Text> */}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },  
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
});

export default Rides;
