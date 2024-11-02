import React, {useEffect, useState} from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ButtonContained from "./ButtonContained";
import { BASE_URL } from "../../config";

const RidesList = ({rides, message, setLoadingButtonPress}) => {

    const navigation = useNavigation();
    console.log("rides are" ,rides)

    const onTrack = (item) => {
        if(item.finished == 2){
            navigation.navigate('TrackingScreen', {
                driverId: item.driver_id,
                plat: item.plat,
                plon:  item.plon
            });
        }else{
            navigation.navigate('TrackingScreen', {
                driverId: item.driver_id,
                plat: item.dlat,
                plon: item.dlon
            });
        }
    };

    const onMore = (item) => {
        navigation.navigate('MoreDetails', {item})
    };

    const handleConfirm = async (item) => {
        try {
            setLoadingButtonPress(true);
            const arrayItem = [item]
            const response = await fetch(`${BASE_URL}/cf/confirm`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arrayItem),
            });
            console.log(response)
            if (response.ok) {
                Alert.alert('Accepted!', 'Request successfully accepted.',[ 
                    { text: 'Ok'}
                ])
                setLoadingButtonPress(false)
                console.log('Successfully backend up to date');
            }else{
                Alert.alert('Error!', 'Something went wrong, Please try again.',[ 
                    { text: 'Ok'}
                ])
                setLoadingButtonPress(false)
                console.log('Failed to update backend');
            }
        }catch (error) {
            console.error('Error updating backend:', error);
        }finally{
            setLoadingButtonPress(false);
        }
    }

    const handleReject = async (item) => {
        try {
            setLoadingButtonPress(true);
            const arrayItem = [item]
            const response = await fetch(`${BASE_URL}/cf/reject`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arrayItem),
            });
            console.log(response)
            if (response.ok) {
                Alert.alert('Rejected!', 'Request successfully rejected.',[ 
                    { text: 'Ok'}
                ])
                setLoadingButtonPress(false)
                console.log('Successfully backend up to date');
            }else{
                Alert.alert('Error!', 'Something went wrong, Please try again.',[ 
                    { text: 'Ok'}
                ])
                setLoadingButtonPress(false)
                console.log('Failed to update backend');
            }
        }catch (error) {
            console.error('Error updating backend:', error);
        }
    }

    const handleTryAgain = async (item) => {
        try {
            setLoadingButtonPress(true);
            const arrayItem = [item]
            const response = await fetch(`${BASE_URL}/cf/retry`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arrayItem),
            });
            console.log(response)
            if (response.ok) {
                Alert.alert('Try Another Driver!', 'You can Search another driver or waiting for driver.',[ 
                    { text: 'Search Driver',onPress: () => navigation.navigate('SearchDriver', {item: item})},
                    { text: 'Wait for Driver', onPress: () => navigation.navigate("Rides") }
                ])
                setLoadingButtonPress(false)
                console.log('Successfully backend up to date');
            }else{
                Alert.alert('Error!', 'Something went wrong, Please try again.',[ 
                    { text: 'Ok'}
                ])
                setLoadingButtonPress(false)
                console.log('Failed to update backend');
            }
        }catch (error) {
            console.error('Error updating backend:', error);
        }
    }

    if (!rides.length){
        return(
            <View style={styles.noResults}>
                <Text style={styles.textNoResult}>Oops! No Result found.</Text>
                <Text style={styles.textNoResult01}>{message}</Text>
            </View>
        )
    }

    return( 
    <View style={styles.container}>
        <FlatList
            data={rides}
            keyExtractor={(rides)=> rides.id}
            showsVerticalScrollIndicator={false}
            renderItem={( {item} ) => {
                return (
                    <TouchableOpacity style={styles.listItem} onPress={() => onMore(item)}>
                        <View style={styles.info}>
                            <View style={styles.specialReqOrderId}>
                                <Text style={styles.text04}>LS0{item.id}</Text>
                                {item.special_request && <Text style={styles.specialReq}>Special Request</Text>}
                            </View>
                            <View style={styles.specialReqOrderId}>
                                <Text style={styles.text02}>{item.location} to {item.destination}</Text>
                            </View>
                            {item.finished === 2 && item.driver_confirmation === true && item.cf_confirmation === true ? (
                                <React.Fragment>
                                    <Text style={styles.text01}>{item.fname} {item.lname}</Text>
                                    <Text style={styles.text01}>{item.phone}</Text>
                                    <TouchableOpacity style={styles.track} onPress={() =>{onTrack(item)}}>
                                        <Text style={styles.trackRideText}>Track Ride</Text>
                                        <FontAwesome5 name='arrow-right' color='green'/>
                                    </TouchableOpacity>
                                </React.Fragment>
                            ) : item.finished === 0 && item.special_request === true && 
                                item.driver_confirmation === false && item.cf_confirmation === true &&
                                item.driver_rejection === false ? (
                                <React.Fragment>
                                    <Text style={styles.text01}>{item.fname} {item.lname}</Text>
                                    <Text style={styles.text01}>{item.phone}</Text>
                                    <Text style={styles.specialReqWait}>Waiting for driver's confirmation.</Text>
                                </React.Fragment>
                            ) : item.finished === 0 && item.driver_confirmation === true && item.cf_confirmation === true ? (
                                <React.Fragment>
                                    <Text style={styles.text01}>{item.fname} {item.lname}</Text>
                                    <Text style={styles.text01}>{item.phone}</Text>
                                    <Text style={styles.specialReqWait}>Driver will start delivary soon.</Text>
                                </React.Fragment>


                            ): item.finished === 0 && item.driver_rejection === true? (
                                <React.Fragment>
                                    <Text style={styles.text01}>{item.fname} {item.lname}
                                        <Text style={styles.rejected}>  Rejected!</Text>
                                    </Text>
                                    <Text style={styles.text01}>{item.phone}</Text>
                                    <View style={{alignSelf: 'flex-start', gap: 5, flexDirection:'row'}}>
                                        <ButtonContained buttonName="Try Another Driver" size = "small"
                                                onPress={() => handleTryAgain(item)}
                                        />
                                    </View>
                                </React.Fragment>


                            ): item.finished === 0 && item.driver_confirmation === true && 
                            item.special_request === false && item.cf_confirmation === false &&
                            item.cf_rejection === false? (
                                <React.Fragment >
                                    <Text style={styles.text01}>{item.fname} {item.lname} 
                                        <Text style={{fontWeight:'bold'}}>  Requested!</Text>
                                    </Text>
                                    <Text style={styles.text01}>{item.phone}</Text>
                                    <View style={{alignSelf: 'flex-start', gap: 5, flexDirection:'row'}}>
                                        <ButtonContained buttonName="Confirm" size = "small"
                                            onPress={() => handleConfirm(item)}
                                        />
                                        <ButtonContained buttonName="Reject" size = "small"
                                            onPress={() => handleReject(item)}
                                        />
                                    </View>
                                </React.Fragment>
                            ): item.finished === 1 ?(
                            <React.Fragment >
                                <Text style={styles.text01}>{item.fname} {item.lname}</Text>
                                <Text style={styles.text01}>{item.phone}</Text>
                            </React.Fragment>
                            ): (
                                <React.Fragment>
                                    <Text style={styles.specialReqWait}>Finding driver...</Text>
                                </React.Fragment>
                            )}
                        </View>
                        <View style={styles.date}>
                            <Text style={styles.text03}>{item.date}</Text>
                            {/* <TouchableOpacity onPress={() => onMore(item)}>
                                <Feather name='more-vertical' size={20} color= '#004344' style={{marginRight: -6, paddingLeft: 5, paddingBottom: 5}}/>  
                            </TouchableOpacity> */}
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    </View>
    );

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginTop: -75,
        marginBottom: 120,
    },
    listItem:{
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#dedede",
        flexDirection: "row",
    },
    info:{
        paddingLeft: 5,
        marginVertical: 3,
        maxWidth: 260,
    },   
    date:{
        flex: 1,
        alignItems: 'flex-end',
        alignSelf: 'flex-start',
    },
    specialReqOrderId:{
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: 260,
    },
    specialReq:{
        fontSize:12,
        color: 'green',
    },
    text01:{
        alignSelf: 'flex-start',
        fontSize:15,
        color: '#004344',
    },    
    text02:{
        alignItems: 'flex-start',
        marginBottom: 8,
        fontSize:16,
        fontWeight: 'bold',
        color: '#004344',

    },    
    text04:{
        fontSize:18,
        fontWeight: 'bold',
        color: '#004344',
        marginRight: 8,
    },
    text03:{
        fontSize:12,
        color: '#004344',
    },
    track:{
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        alignSelf: 'flex-start',
    },
    trackRideText:{
        fontSize:15,
        color: 'green',
        marginRight: 5,
        fontWeight: 'bold',
    },
    rejected:{
        marginTop: 10,
        fontSize:15,
        fontWeight: 'bold',
        color: 'red',
    },
    specialReqWait:{
        marginTop: 10,
        fontSize:15,
        fontWeight: 'bold',
        color: '#004344',
    },
    addButton: { 
        flex:1, 
        justifyContent:'center', 
        padding: 5,
    },
    noResults: {
        flex: 1, 
        alignItems:'center',
        justifyContent:'center',
    },
    textNoResult: {
        fontSize: 17,
        color: '#004344',
        fontWeight: 'bold',
    },
    textNoResult01: {
        fontSize: 14,
        color: '#004344'
    },    
    noResults: {
        flex: 1, 
        alignItems:'center',
        justifyContent:'center',
    },
    textNoResult: {
        fontSize: 17,
        color: '#004344',
        fontWeight: 'bold',
    },
    textNoResult01: {
        fontSize: 14,
        color: '#004344'
    },

});

export default RidesList;
