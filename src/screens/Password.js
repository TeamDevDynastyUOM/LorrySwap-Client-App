import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity,Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { CheckBox } from 'react-native-elements';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config';
import Header from '../components/Header';
import ButtonContained from '../components/ButtonContained';
import { ActivityIndicator } from 'react-native-paper';

const SignupSchema = Yup.object().shape({

username: Yup.string()
    .required('Please enter user name'),
password: Yup.string()
    .min(8) 
    .required('Please enter your password')
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,'Must contain minimum 8 characters, at leat one uppercase letter, one lowercase letter , one number and one special character'),
comfirmpassword: Yup.string()
    .min(8,'Comfirm password must be 8 characters long')
    .oneOf([Yup.ref('password')], 'Your passwords do not match')
    .required('Comfirm password is requaid'),
});

const Login = ({ props,route, navigation }) => {

    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const { formData } = route.params;
    console.log(formData);
    
    const goBack = () => {
      navigation.goBack() 
    }

    const handleCreateAccount = async (values) => {
      // Merge the formData from the previous screen with the current form values
      const completeData = {
        ...route.params.formData, // Data from the previous form
        ...values, // Current form values
      };
      console.log(completeData)

      const requestBody = {
        fname: completeData.fname,
        lname: completeData.lname,
        email: completeData.email,
        contact_no: completeData.mobile,
        age: parseInt(completeData.age, 10), // Convert age to an integer
        gender: completeData.gender === 'male' ? 'm' : 'f',
        nic: completeData.nic,
        username: completeData.username,
        password: completeData.password,
        roles: completeData.role
      };
      setLoading(true)
      try {
        const response = await fetch(`${BASE_URL}/user/createacc`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
          },
          body: JSON.stringify(requestBody),
        });
    
        if (!response.ok) {
          // If the server sends a response with a detailed error message, log or display it
          const errorResponse = await response.json();
          Alert.alert('Email Invalid!', "Provided Email is not valid. Please check again.",[
            {text: 'Ok', onPress: ()=> {}},
          ]);
          console.error('Request error', errorResponse);
          // Optionally, show a user-friendly error message in the UI
        } else {
          navigation.navigate('Otp', { requestBody: requestBody });
        }
      } catch (error) {
        console.error('Request error', error);
        // Handle request error, perhaps show a message to the user
      }finally {
        setLoading(false);
      }
    }

  return (
    <Formik initialValues={{
      username: '',
      password: '',
      comfirmpassword: '',
    }}
    validationSchema={SignupSchema}
    >
      {({values,errors,touched,handleChange,setFieldTouched,setFieldValue,isValid,handleSubmit,isChecked,onValueChanged}) => (

    <View style={styles.wrapper}>
      <StatusBar barStyle={'light-content'}/>
      <Header title="Create Password" goBack={goBack}/> 
      <View style={styles.whiteContainer}>

        <View style={styles.inputwrapper}>
          <Text style={styles.txt}>User Name</Text>
          <TextInput
            style={styles.inputStyle} 
            value={values.username}
            onChangeText={handleChange('username')} 
            onBlur={() => setFieldTouched('username')}
          />
        </View>
        {touched.username && errors.username && (
              <Text style={styles.errorTxt}>{errors.username}</Text>
        )}


        <View style={styles.inputwrapper}>
          <Text style={styles.txt}>Create</Text>
          <Text style={styles.txt}>Password</Text>   
          <TextInput 
            style={styles.inputStyle} 
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={() => setFieldTouched('password')}
            secureTextEntry={true}
          />
        </View>
        {touched.password && errors.password && (
              <Text style={styles.errorTxt}>{errors.password}</Text>
        )}


        <View style={styles.inputwrapper}>
          <Text style={styles.txt}>Comfirm</Text>
          <Text style={styles.txt}>Password</Text>   
          <TextInput 
            style={styles.inputStyle}
            value={values.comfirmpassword}
            onChangeText={handleChange('comfirmpassword')}
            onBlur={() => setFieldTouched('comfirmpassword')}
            secureTextEntry={true}
          />
        </View>
        {touched.comfirmpassword && errors.comfirmpassword && (
              <Text style={styles.errorTxt}>{errors.comfirmpassword}</Text>
        )}

        <View style={styles.checkbox}>
            <CheckBox
            checked={checked}
            onPress={() => setChecked(!checked)}
            color={isChecked ? '#132939' : undefined}
            />
            <Text style={styles.conditiontxt}>  I accept ther Terms of uses & privacy Policy</Text>
        </View>

        <TouchableOpacity 
          onPress={() => handleCreateAccount(values)}
          disabled={!isValid || !checked} // Disable the button if form is invalid or checkbox is not checked
          style={[styles.submitBtn, (!isValid || !checked) ? styles.disabledBtn : {}]}
        >
          {!loading ?(
            <Text style={styles.submitBtnTxt}>
              Create Account
              <Icon name="arrow-right" size={20} color="#ffffff"/>
            </Text>
          ):(
            <ActivityIndicator/>
          )}
        </TouchableOpacity>
      </View>
    </View>
    )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#132939',
    paddingHorizontal: 5,

  },
  header:{
    flexDirection: 'row',
    margin: 10,
    marginTop: '10%',
    // paddingLeft: 10,
    paddingRight: 10,
  },
  pageTitle: {
    color: '#fff',
    // fontfamily:'Source Sans Pro',
    fontSize: 20,
    fontWeight: '700',
    paddingLeft: 10,
    paddingRight: 10,
  },
  whiteContainer: {
    marginTop: 20,
    backgroundColor:'#ffffff',
    padding: 30,
    borderRadius:25,
    width: '100%',
    height: '100%',
  },
  txt: {
    color:'#004244',
    fontSize:15,
    fontWeight:"700",
  },
  
  inputStyle: {
    backgroundColor: '#f1f3f5',
    borderColor:'black',
    borderWidth: 0.5,
    borderRadius: 7,
    flex: 0,
    height: 36,
    width: 243,
    left:80,
    bottom:25,
    paddingLeft:15,
  },
  errorTxt: {
    fontSize: 12,
    color: 'brown',
    bottom:27,
    marginLeft: 85,
  },
  submitBtn: {
    backgroundColor:'#132939',
    padding:12,
    borderRadius:25,
    justifyContent:'center', 
    top:60,
    width:'65%',
    alignSelf:'center',
  },
  submitBtnTxt: {
    color: '#ffffff',
    textAlign:'center',
    fontSize: 18,
    fontWeight: '700',
  },
  conditiontxt: {
    color:'#004244',
    fontSize:12,
  }
,
checkbox:{
    flexDirection:"row", 
    alignItems:'center', 
    alignSelf:'center',
    top:10,
    columnGap:-20,
},
iconHeader:{
  top:4,
},
});
 export default Login;
