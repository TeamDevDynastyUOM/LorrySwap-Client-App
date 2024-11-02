import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'; 
import { useNavigation } from '@react-navigation/native'; 

const HomeScreen = props => {
  const navigation = useNavigation(); 

  const handleButtonPress = () => { 
    console.log('Login Pressed!');
  };

  const handleLoginPress = () => {
    navigation.navigate('SignIn'); 
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/welcome.png')}
        style={{ ...styles.image }}
      />

      <Text style={styles.fontHead}>Let's{"\n"}Get Started</Text>

      <Text style={styles.fontSub}>
        Let's start your journey to find and transport{"\n"}goods efficiently..
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Join Now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLoginPress}>
        <Text style={styles.fontBottom}>
          Already on LorrySwap?{" "}
          <Text style={styles.loginButton} onPress={handleLoginPress}>Log in</Text>
        </Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132939',
  },
  image: {
    marginTop: '30%',
    padding: 0,
    alignSelf: 'center',
    width: '65%',
    height: '33%'
  },
  fontHead: {
    fontSize: 49,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: '15%',
    marginTop: '10%',
  },
  fontSub: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: '15%',
    marginTop: '5%',
  },
   button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: '25%',
    marginTop: '10%',
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#132939',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fontBottom: {
    fontSize: 12,
    color: 'white',
    marginLeft: '30%',
    marginTop: '3%',
  },
  loginButton: {
    fontWeight: 'bold',
    color: 'white',
  },
});
export default HomeScreen;
