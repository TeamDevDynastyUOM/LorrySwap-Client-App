import {StyleSheet,Text,View,Modal,TouchableOpacity,Button,} from "react-native";
import React, { useState } from "react";
import { Feather } from '@expo/vector-icons';
import { TextInput } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome5 } from "@expo/vector-icons";

const PackageDeliverPopUp = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [attemt, setAttempt] =useState('0')
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
  };

  const handleRelease = () => {
    setIsPressed(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={styles.subContent1}>
              <Text style={{ fontSize: 35, color: "#1f4027" }}>
                Deliver the Package
              </Text>
              <Text
                style={{ fontSize: 30, fontWeight: "700", color: "#1f4027" }}
              >
                Anuradhpura
              </Text>
              <Text style={{ fontSize: 15 }}>Arrived at 8: 45 AM</Text>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Feather name="phone-call" size={24} color="#bf343b" />
                <Text style={{fontSize:25,fontWeight: "700"}}> Nimal Rathnayake</Text>
              </View>

              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Feather name="phone-call" size={24} color="#bf343b" />
                <Text style={{fontSize:25,fontWeight: "700"}}>Recipient</Text>
              </View>
            </View>

            <View style={styles.subContent2}>
              <TextInput 
                placeholder="Enter order ID"
                style={styles.textInput1}
                textAlign="center"
              />
            </View>
            <Text style={styles.modalText}>You have 5 {attemt} Attempt</Text>

            <View style={styles.subContent3}>
              <TouchableOpacity
              style={[
                  styles.continueContainer,
                  isPressed && styles.buttonPressed,
                ]}
                onPress={handlePress}
                onPressOut={handleRelease}
                >
                <FontAwesome5
                  name="arrow-right"
                  style={styles.continueButton}
                />
                <Text style={styles.continueButton}>Continue</Text>
                
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <Button onPress={() => setModalVisible(true)} title="Open Modal" />
    </GestureHandlerRootView>

  );
};

export default PackageDeliverPopUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    width: 430,
    height: 370,
    paddingHorizontal: 40,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color:'red'
  },

  subContent1: {
    alignItems: "center",
    paddingTop: 30,
    // backgroundColor:'#28d456',
    marginTop: 20,
  },

  subContent2:{
    shadowColor: "#000",
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is for Android
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: 15
  },
  textInput1:{
    width: "auto",
    height: 40,
    borderRadius: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
    
  },
  subContent3:{
    flexDirection:'row',
    alignSelf:'flex-end'
  },
  continueContainer: {
    paddingVertical: 5,
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 10,
    borderRadius: 10,
  },
  continueButton: {
    marginHorizontal: 2,
    fontSize: 17,
    color: "#004344",
  },

  buttonPressed: {
    backgroundColor: "#edebeb",
  },

});
