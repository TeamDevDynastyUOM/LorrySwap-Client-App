import React from 'react';
import { StyleSheet, SafeAreaView,Text, View, TouchableOpacity, TextInput} from 'react-native';
import { Feather } from '@expo/vector-icons';
import GlobalStyles from '../styles/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const Chat= () =>{

    const navigation = useNavigation();


    return (
        <SafeAreaView style={GlobalStyles.wrapper}>
            <Header title="Chat" goBack={onPress=() => navigation.goBack()}/> 
            <View style={GlobalStyles.whiteContainerWithSearchBar}>

            </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    SearchBtnStyle:{
        
        fontSize:16,
        fontWeight:'bold',
        padding: 8,
        borderRadius: 10,
        backgroundColor: "#dedede",
        paddingLeft: 50,       
    },
    Searchicon:{
        position: 'absolute',
        marginStart:50,
        marginTop:50,

    }
});

export default Chat;
