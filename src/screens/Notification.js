import React from 'react';
import { StyleSheet, SafeAreaView,Text, View, TouchableOpacity, TextInput} from 'react-native';
import { Feather } from '@expo/vector-icons';
import GlobalStyles from '../styles/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';

const Notification= () =>{
    const navigation = useNavigation();

    return (
        <SafeAreaView style={GlobalStyles.wrapper}>
            <Header title="Notifications" goBack={onPress=() => navigation.navigate('Home')}/> 
            <View style={styles.searchBarContainer}>
                    <TextInput 
                        style={styles.searchBtnStyle} 
                        placeholder = "Search"  
                        clearButtonMode='always'
                    />
                    <FontAwesome name="search" size={18} color="black" style={styles.searchicon}/>
                </View>
            <View style={GlobalStyles.whiteContainerWithSearchBar}>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBarContainer: {
    marginHorizontal: 15,
    marginTop: 5,
    },
    searchBtnStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#dedede",
    paddingLeft: 40,
    },
    searchicon: {
    position: 'absolute',
    marginTop: 12,
    marginLeft: 10,
    },
});

export default Notification;
