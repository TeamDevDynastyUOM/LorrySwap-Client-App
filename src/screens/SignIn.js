import React,{ useState,useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView , Alert, ToastAndroid, Platform } from 'react-native';
import { Formik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRideContext } from '../context/RideContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';
import { BASE_URL } from '../../config';
import ActivityIndicatorCustom from '../components/ActivityIndicatorCustom';
import { ActivityIndicator } from 'react-native-paper';

const Signin= () => {

    const navigation = useNavigation();
    const route = useRoute();

    const { id, setId, token, setToken } = useRideContext();
    const [loginLoading, setLoginLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkLoggedIn = async () => {
            console.log('Check Login');
            const tokenStored = await AsyncStorage.getItem('token');
            setToken(tokenStored);
      
            if (!tokenStored) {
              console.log('Token not found. Please login again');
              setLoginLoading(false);
            }else{         
              setLoginLoading(true);   
              console.log('Token found, Check token Data');
              await getTokenData(tokenStored)
              await checkTokenExpiration(tokenStored);
            }
        };
        checkLoggedIn();
    },[navigation, route])

    const gotoForm = () => {
        navigation.push('Signup')
    }

    const storeTokens = async (token) => {
        try {
          await AsyncStorage.setItem('token', token);
          console.log('Token Saved',token );
        } catch (error) {
          console.error('Error storing tokens:', error);
        }
    };

    const getTokenData = async (token) => {
        try {    // Split the token by dots and extract the payload
            const token1 = token
            const parts = token1.split('.');
            const payload = parts[1];

            if (token) {
                setToken(token)
                console.log('Get-token-data', token);
                // Decode the payload using Base64 decoding
                const decodedPayload = decode(payload);
                const parsedPayload = JSON.parse(decodedPayload);
                console.log('ParsePayload', parsedPayload);
                setId(parsedPayload.sub)
            }
        } catch (error) {
            console.error('Error retrieving token:', error);
        }
    }


    const checkTokenExpiration = async (token) => {
        try {
            // Split the token by dots and extract the payload
            const token1 = token
            const parts = token1.split('.');
            const payload = parts[1];

            console.log('token', token);

            if (token) {   
            // Decode the payload using Base64 decoding
            const decodedPayload = decode(payload);
            const parsedPayload = JSON.parse(decodedPayload);
            console.log('ParsePayload', parsedPayload);
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            if (parsedPayload.exp < currentTime) {
                // Access token expired, attempt to refresh it
                console.log('Attempt to refresh token, Please relogin');
                setLoginLoading(false);
            }else{
                checkRoles(parsedPayload, token)
            }}
        } catch (error) {
            console.error('Error checking token expiration:', error);
        }
    };

    const checkRoles = async (parsedPayload, token) => {
        const myToken = token
        console.log('Checking Roles', parsedPayload);
        if(parsedPayload.roles.length == 2 ){
            if(parsedPayload.roles[0].toLowerCase() === 'cargofinder' || 
                parsedPayload.roles[0].toLowerCase() === 'marketseller'
            ){
                setLoginLoading(false);
                navigation.navigate("SelectRole", {parsedPayload:parsedPayload})
            }else if(
                parsedPayload.roles[0].toLowerCase() === 'cargofinder' || 
                parsedPayload.roles[0].toLowerCase() === 'economiccenterseller'
            ){
                setLoginLoading(false);
                navigation.navigate("SelectRole", {parsedPayload:parsedPayload})
            }
        }else if (parsedPayload.roles[0].toLowerCase() === 'economiccenterseller'){
            setLoginLoading(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'EconomicCenterSeller' }],
                });
        }else if (parsedPayload.roles[0].toLowerCase() === 'marketseller'){
            setLoginLoading(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'MarketSeller' }],
            });
        }else if (parsedPayload.roles[0].toLowerCase() === 'cargofinder'){
            setLoginLoading(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'CargoFinder' }],
            });
        }
        setLoginLoading(false)
    }

    const fetchData = async (values, actions) => {
        // Prepare the data to be sent in the request body
        const data = {
            username: values.username,
            password: values.password,
        };
        console.log('login data',data);
        
        
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/user/login_user`,{
                method: 'POST', // Specify the method
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data), 
            });
    
            if (response.ok) {
                const responseData = await response.json();
                const newAccessToken = responseData.token;
                console.log('new accessToken', newAccessToken);
    
                await AsyncStorage.setItem('token', newAccessToken);
                await storeTokens(newAccessToken)
                await getTokenData(newAccessToken)

                console.log('Credentials are correct.');
                ToastAndroid.show('Login Successful', ToastAndroid.SHORT);
                
                await checkTokenExpiration(newAccessToken);
                setLoading(false);

    
            }else if (response.status === 404) {
                console.log('User does not exist.');
                Alert.alert('ERROR','User does not exist',[
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ]);
    
            } else if (response.status === 401) {
                console.log('Incorrect username or password.');
                Alert.alert('ERROR','Incorrect username or password',[
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ]);
    
            } else {
                console.log('An error occurred. Please try again later.');
                Alert.alert('ERROR','An error occurred. Please try again later',[
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ]);
            }
    
            actions.resetForm(); 
            console.log(values); 
    
        } catch (error) {
            // If there's an error in the fetch operation
            console.error('Error:', error);
            Alert.alert('ERROR','An error occurred. Please try again later',[
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
        }finally{
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loginLoading ? (                
                <View style={{...styles.container, backgroundColor: '#fff'}}>
                    <ActivityIndicatorCustom indicatorName="Verifying your session..." color="#004344"/>
                </View>
            ):(
                <View style={styles.container}>
                    <View style={styles.imgcontainer}>
                        <Image source={require('../assets/images/SigninTD.png')} style={styles.image}/>
                    </View>
                    <KeyboardAvoidingView 
                        style={styles.container} 
                        enabled={true} 
                        keyboardVerticalOffset={60}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}   
                    >
                        <Formik
                            initialValues={{ username: '', password: '' }}
                            onSubmit={(values, actions) => {
                                fetchData(values, actions)
                            }}
                        
                        >
                            {(formikProps) => (
                                <View style={{ flex: 1, marginTop: -40 }}>
                                    <View style={styles.backgroundBoxHead}>
                                        <Text style={styles.textHead}>Sign In</Text>
                                    </View>
                                    <View style={styles.backgroundBoxContainer}>
                                        <View style={styles.backgroundBox}>
                                            <Text style={styles.textMain}>USER NAME</Text>       
                                            <TextInput 
                                                style={styles.textInput}
                                                placeholder="Enter Username"
                                                onChangeText={formikProps.handleChange('username')}
                                                onBlur={formikProps.handleBlur('username')}
                                                value={formikProps.values.username}
                                            />
                                            <Text style={styles.textMain}>PASSWORD</Text>
                                            <TextInput 
                                                style={styles.textInput}
                                                placeholder="Enter Password"
                                                onChangeText={formikProps.handleChange('password')}
                                                onBlur={formikProps.handleBlur('password')}
                                                value={formikProps.values.password}
                                                secureTextEntry={true}
                                            />
                                        
                                            <View style={styles.bottom}>
                                                <TouchableOpacity onPress={() => navigation.navigate("ForgetPasswordEmail")} >
                                                    <Text style={styles.forget}>Forget Password?</Text>
                                                </TouchableOpacity>
                                                {!loading ?(
                                                    <TouchableOpacity onPress={formikProps.handleSubmit} 
                                                        style={styles.signInButton}>
                                                        <Text style={styles.buttonText}>Sign In</Text>
                                                    </TouchableOpacity>
                                                ):(
                                                    <View onPress={formikProps.handleSubmit} 
                                                        style={{...styles.signInButton, backgroundColor: "#ddd"}}>
                                                        <ActivityIndicator size="small" color='#004344' />
                                                    </View>
                                                )}
                                                <TouchableOpacity onPress={gotoForm}>
                                                    <Text style={styles.forget}>Create a new account</Text>
                                                </TouchableOpacity>
                                            </View>
                                            
                                        </View>
                                        
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </KeyboardAvoidingView>
                </View>
            )}
        </View>     
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#132939'
    },
    imgcontainer: {
        flex: 1,
        marginTop: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },    
    image:{
        width: '100%',
        height: '60%',
    },
    backgroundBoxHead: {
        marginBottom: 15,
        marginLeft: 20,
        alignSelf: 'flex-start',
    },
    textHead: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    backgroundBoxContainer:{
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
        // backgroundColor: 'red',
    },
    backgroundBox: {
        width: '100%',
        // backgroundColor: 'green',
    },
    textMain:{
        marginTop: 10,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
    },
    textInput:{
        backgroundColor: '#fff',
        borderWidth: 1,
        margin: 5,
        borderColor: '#132939',
        padding: 9,
        paddingLeft: 20,
        fontSize: 14,
        borderRadius: 10,
        fontWeight: 'bold',
    },
    bottom:{
        marginTop: 10,
        alignItems: 'center',
    },
    forget:{
        color: '#fff',
        fontSize: 13,
        paddingBottom: 10,
        fontWeight: 'bold',
    },
    signInButton: {
        margin: 5,
        marginTop: 25,
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 10,
        width: 180,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#132939',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Signin;