import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import { Feather } from '@expo/vector-icons';
import GlobalStyles from '../styles/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { Fontisto } from '@expo/vector-icons'; 

const Profile= () =>{
    const navigation = useNavigation();
    return (
        <SafeAreaView style={GlobalStyles.wrapper}>
         <ScrollView stickyHeaderIndices={[0]}>
            <View style={GlobalStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack() }> 
                    <Feather style={GlobalStyles.iconHeader} name="arrow-left" size={20} color="white"/>
                </TouchableOpacity>
            </View>
            <View style={GlobalStyles.whiteContainerProfile}>
                <View style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={{alignItems:"center"}}>
                            <View style={styles.ProfileImage}>
                            <Image source={require('../assets/images/ProfilePic.jpg')} style={styles.image}></Image>
                            </View>
                            <Text style={styles.NameText}>Nirmal Waduge</Text>
                        </View>
                        <View style={styles.line}></View>
                        <Text style={styles.subtext1}>Customer Review (127)</Text>
                        <View style={{flexDirection:"row", alignItems:"baseline", columnGap:10,justifyContent:"center"}}>
                            <Text style={{fontSize:72, fontWeight:"bold", color:"#132939"}}>4.5</Text>
                            <Fontisto name="star" size={48} color="#132939" />
                        </View>
                        <Text style={{fontSize:16, color:"#132939", marginLeft:"30%", marginTop:"-5%"}}>1.5M reviews</Text>
                        <Text style={{fontSize:17, color:"#132939", fontWeight:"bold", marginTop:"3%"}}>Recent Reviews</Text>


                        <View elevation={10} style={styles.CardStyle}>
                        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                            <Text style={{fontSize:18, color:"#132939", fontWeight:"bold" }}>Great Service !</Text>
                            <Text>Oct 22 </Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <Fontisto name="star" size={12} color="#DAC612"  />
                            <Fontisto name="star" size={12} color="#DAC612" />
                            <Fontisto name="star" size={12} color="#DAC612" />
                            <Fontisto name="star" size={12} color="#DAC612" />
                            <Fontisto name="star" size={12} color="#DAC612" />
                        </View>
                        <Text style={{fontSize:14,color:"#132939", marginTop:"3%"}}>Very helpful and kind rider.Highly Recommend for others.</Text>
                        <Text style={{fontSize:12, color:"#132939"}}>3 month ago</Text>
                        </View>


                        <View elevation={10} style={[styles.CardStyle, {marginBottom:"30%"}]}>
                        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                            <Text style={{fontSize:18, color:"#132939", fontWeight:"bold" }}>Good Service</Text>
                            <Text>Nov 14 </Text>
                        </View>
                        <View style={{flexDirection:"row",}}>
                            <Fontisto name="star" size={12} color="#DAC612"  />
                            <Fontisto name="star" size={12} color="#DAC612" />
                            <Fontisto name="star" size={12} color="#DAC612" />
                        </View>
                        <Text style={{fontSize:14,color:"#132939", marginTop:"3%"}}>Very helpful and kind rider.Highly Recommend for others.</Text>
                        <Text style={{fontSize:12, color:"#132939"}}>5 month ago</Text>
                        </View>

                    </View>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
            
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginVertical:"-30%",
              
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    NameText:{
        fontSize:26,
        fontWeight: 'bold',
        color: '#132939',
    },
    ProfileImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        overflow: "hidden",
        marginBottom:5,
    },
    line: {
        borderBottomColor: '#969696',
        borderBottomWidth: 3,
        marginVertical: "3%", 
        marginHorizontal:"12%"
    },
    subtext1:{
        fontSize:17,
        fontWeight: 'bold',
        color: '#132939',
        marginTop:"2%"
    },
    CardStyle:{
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 25,
        width: '100%',
        marginVertical: "5%",
        shadowColor: 'black',
        paddingBottom:"7%",
    },
});

export default Profile;
