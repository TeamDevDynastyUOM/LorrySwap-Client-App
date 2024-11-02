import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import GlobalStyles from '../styles/GlobalStyles';
import { FontAwesome5 } from '@expo/vector-icons';

const ButtonCustomContained = ({ buttonName, onPress, iconName, alignIcon, loading, size, color, textColor }) => {
    return (
        size === "small" ? (
            <TouchableOpacity style={{...GlobalStyles.smallConfirmContainer, backgroundColor: color,borderColor: color,}} 
                onPress={onPress} disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        {alignIcon === 'left' && <FontAwesome5 name={iconName} style={GlobalStyles.confirmButton} />}
                        <Text style={{...GlobalStyles.smallConfirmButton, color:textColor}}>{buttonName}</Text>
                        {alignIcon === 'right' && <FontAwesome5 name={iconName} style={GlobalStyles.confirmButton} />}
                    </>
                )}
            </TouchableOpacity>
        ) : (
            <TouchableOpacity style={{...GlobalStyles.confirmContainer, backgroundColor: color,borderColor: color,}}
                onPress={onPress} disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        {alignIcon === 'left' && <FontAwesome5 name={iconName} style={GlobalStyles.confirmButton} />}
                        <Text style={{...GlobalStyles.confirmButton, color:textColor}}>{buttonName}</Text>
                        {alignIcon === 'right' && <FontAwesome5 name={iconName} style={GlobalStyles.confirmButton} />}
                    </>
                )}
            </TouchableOpacity>
        )
    );
};

export default ButtonCustomContained;
