import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo, Feather, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


const ButtonSet = () => {    
    const navigation = useNavigation();
    return (
            <View style={styles.buttonSet}>
                <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate("Menu")}>
                    <Feather name='menu' style={{ fontSize: 30}} />
                </TouchableOpacity>
                <View>
                    <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate("Chat")}>
                        <Entypo name='chat' style={{ fontSize: 30}} />
                    </TouchableOpacity>
                </View>
            </View>
    );
};
const styles = StyleSheet.create({

    buttonSet:{
        position: 'absolute',
        paddingTop: 30,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    circleButton: {
        width:  55,
        height: 55,
        borderRadius: 50,
        marginBottom: 10,
        backgroundColor: 'rgba(197, 197, 197, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ButtonSet;