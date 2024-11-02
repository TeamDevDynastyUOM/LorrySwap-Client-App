import React, {useState} from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image} from "react-native";
import { useNavigation } from "@react-navigation/native";

const SearchList = ({data, packageId}) => {

    const navigation = useNavigation();

    console.log("Drivers ", data);
    console.log("package -",packageId)  

    return( 
    <View style={styles.container}>
        <FlatList
            data={data}
            keyExtractor={(data)=> data.id}
            showsVerticalScrollIndicator={false}
            renderItem={( {item} ) => {
                return (
                    <View>
                        <TouchableOpacity style={styles.listItem} 
                            onPress={() => navigation.navigate("DriverProfile", {item : item, packageId: packageId})}
                        >
                            <Image style={styles.dp} source={{uri: item.photo}} />
                            <View style={styles.info}>
                                <View style={styles.specialReqOrderId}>
                                    <Text style={styles.text04}>{item.fname} {item.lname}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.hrLine}>
                        </View>
                    </View>
                );
            }}
        />
    </View>
    );

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // marginTop: -20,
        marginBottom: 120,
    },
    listItem:{
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
    },
    dp:{
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    info:{
        paddingLeft: 5,
        marginVertical: 3,
    },   
    date:{
        flex: 1,
        alignItems: 'flex-end',
        alignSelf: 'flex-start',

    },
    hrLine:{
        height: 1,
        backgroundColor: '#004344'
    },
    text04:{
        fontSize:18,
        fontWeight: 'bold',
        color: '#004344',
        marginRight: 8,
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

export default SearchList;
