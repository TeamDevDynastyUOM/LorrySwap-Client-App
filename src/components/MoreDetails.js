import React, {useEffect, useState} from "react";
import { View, Text,  StyleSheet,TouchableOpacity, Alert } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from "../../config";
import ButtonCustomContained from "./ButtonCustomContained";
import Header from '../components/Header';
import ButtonOutlined from "./ButtonOutlined";
import ButtonContained from "./ButtonContained";
import PlaceReview from "../screens/PlaceReview";

const MoreDetails = ({route}) => {      

    const navigation = useNavigation();

    const {item} = route.params;

    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [isReviewed, setIsReviewed] = useState(false);
    const [reviewDataPopUp,setReviewDataPopUp] = useState(false);

    useEffect(()=> {
        setLoading2(true)
        checkReview();
    },[navigation])
    const handleTryAgain = async (item) => {
        try {
            setLoading(true);
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
                setLoading(false)
                console.log('Successfully backend up to date');
            }else{
                Alert.alert('Error!', 'Something went wrong, Please try again.',[ 
                    { text: 'Ok'}
                ])
                setLoading(false)
                console.log('Failed to update backend');
            }
        }catch (error) {
            setLoading(false)
            console.error('Error updating backend:', error);
        }
    }

    const handleRemove = (item) => {
        setLoading1(true);
        Alert.alert('Are you sure?', 'Do you want to remove this ride.',[ 
            { text: 'No'},
            { text: 'Yes', onPress: () => remove(item) }
        ])
    }

    const remove = async (item) => {
        try {
            const response = await fetch(`${BASE_URL}/cf/delete_ride/${item.id}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                },
            });
            console.log(response)
            if (response.ok) {
                setLoading1(false)
                navigation.goBack()
                console.log('Successfully backend up to date');
            }else{
                setLoading1(false)
                console.log('Failed to update backend');
            }
        }catch (error) {
            setLoading1(false)
            console.error('Error updating backend:', error);
        }
    }

    const checkReview = async () => {
        setLoading2(true)
        try {
            const response = await fetch(`${BASE_URL}/cf/isReviewed/${item.id}`, {
                method: 'get',
                headers: { 
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if(data.isReviewed) {
                    setIsReviewed(true)
                }else{
                    setIsReviewed(false)
                }
                setLoading2(false)
                console.log('is reviewed', data.isReviewed);
            }else{
                setLoading2(false)
                console.log('Failed to update backend');
            }
        }catch (error) {
            setLoading2(false)
            console.error('Error updating backend:', error);
        }finally{
            setLoading2(false)
        }
    }

    const handleReviewPopup = () => {
        setReviewDataPopUp(true)
    }

    return(
        <View style={GlobalStyles.wrapper}>
            <Header title="Details" goBack={onPress=() => navigation.goBack()}/> 
            <View style={GlobalStyles.whiteContainerWithSearchBar}>
                <View style={styles.subText}>
                    <View style={{flexDirection:"row",}}>
                        <Text  style={styles.titles}>Package Type</Text>
                        <Text  style={styles.data}>:-   {item.package_type}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text  style={styles.titles}>Package Weight  </Text>
                        <Text  style={styles.data}>:-   {item.weight} Kg</Text>
                    </View>
                            <View>
                                <View style={{flexDirection:"row"}}>
                                    <Text  style={styles.titles}>Package Dimension </Text>
                                    <View style={{flexDirection:"row", marginLeft:"50%", position:"absolute"}}>
                                        <Text  style={styles.titles}>:-   Height - </Text>
                                        <Text  style={styles.titles}>{item.height} m</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:"row", marginLeft:"50%"}}>
                                    <Text  style={styles.titles}>:-   Length - </Text>
                                    <Text  style={styles.titles}>{item.length} m</Text>
                                </View>
                                <View style={{flexDirection:"row", marginLeft:"50%"}}>
                                    <Text  style={styles.titles}>:-   Width - </Text>
                                    <Text  style={styles.titles}>{item.width} m</Text>
                                </View>
                            </View>
                    <View style={{flexDirection:"row"}}>
                        <Text  style={styles.titles}>Pickup Location  </Text>
                        <Text  style={styles.data}>:-   {item.location}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text  style={styles.titles}>Drop Location  </Text>
                        <Text  style={styles.data}>:-   {item.destination}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text  style={styles.titles}>Total Cost </Text>
                        <Text  style={styles.data}>:-   Rs. {item.cost}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        {item.finished === 0 && item.driver_rejection === true?(
                            <View style={{flex:1}}>
                                <Text style={styles.rejectedText}>Your request was Rejected by Driver.</Text>
                                <View style={{ alignSelf: 'flex-start', marginTop: 10}}>
                                    <ButtonContained buttonName="Try Another Driver" 
                                        onPress={() => handleTryAgain(item)} loading={loading}
                                    />
                                </View>

                            </View>

                        ) : item.finished === 2 && item.driver_confirmation === true && item.cf_confirmation === true ?(
                            <View style={{flex:1}}>
                                <Text style={styles.startedText}>Delivary Started.</Text>
                                <Text style={styles.informText}>You can track your item.</Text>
                            </View>
                        ) : item.finished === 0 && item.special_request === true && 
                            item.driver_confirmation === false && item.cf_confirmation === true &&
                            item.driver_rejection === false ?  (
                            <View style={{flex:1}}>
                                <Text style={styles.informText}>Waiting for driver's confirmation.</Text>
                                <Text style={styles.informText}>After confirmed, Driver will start soon</Text>
                            </View>
                        ): item.finished === 0 && item.driver_confirmation === true && item.cf_confirmation === true ? (
                            <View style={{flex:1}}>
                                <Text style={styles.informText}>Driver will start delivary soon.</Text>
                                <Text style={styles.informText}>Once the driver starts delivering, you can track the driver.</Text>
                            </View>
                        ): item.finished === 0 && item.driver_confirmation === false && item.driver_rejection === false? (
                            <View style={{flex:1}}>
                                <Text style={styles.informText}>Finding Driver...</Text>
                                <Text style={styles.informText}>You can also search driver.</Text>
                                <View style={{flexDirection: 'row', marginTop: 15}}>
                                    <ButtonOutlined buttonName="Search Driver" arrow='right'
                                        onPress= {() =>navigation.navigate('SearchDriver', {item: item})}
                                    />
                                </View>
                            </View>
                        ) : (
                            <Text></Text>
                        )}
                    </View>   
                </View>
                {item.finished === 0 ?(
                    <View style={{ alignSelf: 'flex-start', marginTop: 10, marginLeft: 10}}>                        
                        <ButtonCustomContained buttonName="Remove Ride" 
                            color="red" textColor="white" iconName="times-circle" alignIcon="left"
                            onPress={() => handleRemove(item)} loading={loading1} 
                        />
                    </View> 
                ):(null)}
                {item.finished === 1 && !isReviewed ?(
                    <View style={{ alignSelf: 'flex-start', marginTop: -5, marginLeft: 10}}>                        
                        <ButtonCustomContained buttonName="Add review" 
                            color="#004344" textColor="white"
                            onPress={() => handleReviewPopup()}
                        />
                    </View> 
                ):(null)}
                {reviewDataPopUp && (
                    <PlaceReview setReviewDataPopUp={setReviewDataPopUp}
                        reviewDataPopUp={reviewDataPopUp} data={item}/>
                )}
            </View>
        </View>           
    )
};

const styles = StyleSheet.create({
    subText:{
        rowGap:10,
    },
    titles:{
        marginLeft: 10,
        color:"#004344",
        fontSize:15,
    },
    data:{
        color:"#004344",
        fontSize:15,
        marginLeft:"50%",
        position:"absolute",
        maxWidth:180,
    },
    buttonContainer: {
        marginTop: 20,
        marginLeft: 10,
        flexDirection: "row",
    },
    buttonText:{
        color:"#004344",
        fontSize:13
    },
    informText:{
        marginTop: 5,
        color:"#004344",
        fontSize:16,
        fontWeight: 'bold'
    },
    startedText:{
        color:"green",
        fontSize:16,
        fontWeight: 'bold'
    },
    rejectedText: {
        color:"red",
        fontSize:17,
        fontWeight: 'bold'
    }
});

export default MoreDetails;