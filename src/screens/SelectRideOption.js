import React, { useEffect, useState } from "react";
import {StyleSheet, Text, View, Modal} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import ButtonText from "../components/ButtonText";
import ButtonContained from "../components/ButtonContained";
import { useNavigation } from '@react-navigation/native';
import CFPopupStyles from "../styles/CargoFinderPopupStyles";

const SelectRideOption = ({ newModal, setNewModal, orderId, setHandleAddLocationPopup, setAddItem }) => {
  
  const navigation = useNavigation();
  const [item, setItem] = useState({})

  useEffect(() => {
    const data ={id: orderId}
    setItem(data)
  },[])
  

  const navigateToSearchDriver = () => {
    console.log("item is ",item)
    navigation.navigate('SearchDriver', {item: item})
    onclose()
  }

  const navigateToRides = () => {
    navigation.navigate('Rides')
    onclose()
  }

  const onclose = () => {
    setAddItem(false);
    setHandleAddLocationPopup(false);
    setNewModal(false);
  };

  return (
    <View style={CFPopupStyles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={newModal}
      >
        <View style={CFPopupStyles.modalContainer}>
          <View style={{...CFPopupStyles.modalContent, height: 400}}>
            <View style={{ alignItems:'center'}}>
                <Text style={{fontSize:23, fontWeight:'700', color:'#004344'}}>Your Ride Id : {orderId}</Text>
                {/* <Text style={{fontSize:15,fontWeight:'500', color:'#454343'}}>For Sithum Sathsara 0763509028</Text> */}
                <Text style={{fontWeight:'500',color:'#d11f1f', marginTop: 10}}>You must enter the ride id to confirm the cargo recieved.</Text>
            </View>

            <View style={styles.horizontalLine} />

            <View style={styles.messageContainer}>
                <FontAwesome name="circle" size={13} color="#004344" />
                <Text style={styles.messageText}>If you know a driver, you can search by the name of the driver and send this ride.</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <ButtonContained buttonName=" Search Driver" 
                onPress={navigateToSearchDriver} 
                iconName="search" 
                alignIcon="left"
              />
            </View>

            <View style={styles.horizontalLine} />

            <View style={styles.messageContainer}>
                <FontAwesome name="circle" size={13} color="#004344" />
                <Text style={styles.messageText}>If you don't know any drivers, you should wait for a driver request.</Text>
            </View>

            <View style={styles.buttonContainer}>
              <ButtonContained buttonName=" Waiting for Driver" 
                onPress={navigateToRides}
              />
            </View>
            <View style={styles.buttonContainer}>
              <ButtonText buttonName="Close" onPress={onclose}/>
            </View>
            
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectRideOption;

const styles = StyleSheet.create({

  horizontalLine: {
    marginTop:15,    
    width: '90%',
    height: 1.5,
    backgroundColor: '#004344',
    marginHorizontal: 20
  },
  messageContainer :{
    marginTop:10,
    marginBottom: 5,
    paddingLeft:13,
    alignItems:'center',
    flexDirection:'row',
    paddingRight: 15
  },
  messageText :{
    fontSize:16,
    marginLeft:10, 
    color:'#004344'
  },
  buttonContainer :{
    marginTop:10,
    flexDirection:'row',
    justifyContent: "center",
  }

});
