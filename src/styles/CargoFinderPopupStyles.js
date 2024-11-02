import { StyleSheet } from "react-native";

const CFPopupStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        height: 310,
        backgroundColor: "white",
        padding: 20,
        paddingTop: 25,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 5,
    },
    row: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "center",
        width: '100%',
    }, 
    inputText: {
        flex: 1,
        justifyContent: "center",
        textAlign: 'left',
        fontSize: 16,
    }, 
    inputFieldContainer:{
        flex: 1,
        marginLeft: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputField: {
        flex:1,
        height: 35,
        marginLeft: 20,
        borderBottomWidth: 1.5,
        borderColor: "#004344",
        fontSize: 16,
        justifyContent: "flex-start",
        paddingLeft: 10,
    },
    inputFieldSmall: {
        flex:1,
        height: 35,
        borderBottomWidth: 1.5,
        borderColor: "#004344",
        fontSize: 16,
        justifyContent: "center",
    },
    bottomButtonSet:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    }
})

export default CFPopupStyles;