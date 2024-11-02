import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const SelectScreen = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigation();

  const handlePress = (option) => {
    setSelectedOption((prevOption) => (prevOption === option ? null : option));
  };

  const handleContinue = () => {
    if (selectedOption === 'Cargo Finder') {
      navigation.navigate('CargoHome');
    }
  };

  const renderCheckboxButton = (label) => (
    <TouchableOpacity
      style={styles.checkboxButton}
      onPress={() => handlePress(label)}
    >
      <View
        style={[styles.checkbox,
          selectedOption === label && styles.checked,
        ]}
      >
        {selectedOption === label && <Text style={styles.checkSymbol}>✓</Text>}
      </View>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={require('../assets/select.png')} style={styles.image} />
      <Text style={styles.fontSub}>Continue as</Text>

    <View style={styles.box}>
      {renderCheckboxButton('Market Seller')}
      {renderCheckboxButton('Economic Center Seller')}
      {renderCheckboxButton('Cargo Finder')}
    </View>

      <StatusBar style="auto" />
      <TouchableOpacity onPress={handleContinue}>
        <Text style={styles.go}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132939',
    position: 'relative',
  },
  image: {
    marginTop: '50%',
    padding: 0,
    alignSelf: 'center',
    width: '70%',
    height: '34%',
  },
  fontSub: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: '10%',
    marginTop: '1%',
  },
  checkboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    marginLeft: '17%',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#132939',
  },
  checkSymbol: {
    color: 'white',
  },
  buttonLabel: {
    fontSize: 16,
    color: 'white',
  },
  box: {
      paddingTop: '10%',
      paddingBottom: '25%'
  },
  go: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    bottom: '0%',
    right: '5%',
  },
});

export default SelectScreen;
