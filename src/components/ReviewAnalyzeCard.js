import { StyleSheet, Text, View, ActivityIndicator  } from 'react-native'
import React from 'react'
import { useState, useEffect } from "react";
import { Fontisto } from '@expo/vector-icons'; 
import ReviewAnalyzeBarChart from './ReviewAnalyzeBarChart';

const ReviewAnalyzeCard = ({ title, content, reviews }) => {

    const reviewCount = reviews ? reviews.total_reviews : 0;


  return (
    
    <View style={styles.cardContainer}>
      <View style={styles.reviewContContainer1}>
        <Text style={{fontSize:20, color:'#0a0a0a', fontWeight:'700'}}>Customer Reviews ({reviewCount})</Text>
      </View>
      <View style={styles.reviewContContainer2}>
        <View style={styles.subContContainer1}>

            <Text style={{fontSize:72, fontWeight:"bold", color:"#132939",paddingRight:16}}>4.5</Text>
            <Fontisto name="star" size={48} color="#132939" />
        </View>
        <View style={styles.subContContainer2}>
            <ReviewAnalyzeBarChart reviews={reviews} />
        </View>
        
      </View>

      <View style={{ marginLeft:29, marginTop: -10}}>
        <Text style={styles.title}>{reviewCount} Reviews</Text>
      </View>  
      
    </View>
  )
}

export default ReviewAnalyzeCard

const styles = StyleSheet.create({
    cardContainer: {   
    position:'relative',    
    height: 150,
    width: '100%',
    backgroundColor: '#fff', // You can customize the background color
    borderRadius: 5, // Optional: for rounded corners
    paddingLeft:'1.2%',
    padding: 5, // Optional: for inner padding
    marginVertical: 5, // Optional: for vertical spacing between cards
    shadowColor: '#000', // Optional: for shadow effect
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    elevation: 3, // For Android shadow effect
    // marginTop: '50%',
    // backgroundColor:'yellow'
  },

  reviewContContainer1 :{
    // backgroundColor:'red',
  },

  reviewContContainer2:{
    flexDirection:'row',
    marginTop:8,
    marginLeft:15
    // alignItems:'center',
    // alignContent:'center',
    // justifyContent:'center',
    // backgroundColor:'yellow'
   
  },

  subContContainer1 :{
    position:'relative',
    flexDirection:'row',
    alignItems:'center',
    
  },
  subContContainer2:{
    //  backgroundColor:'red',
     flex:1,
     paddingLeft:10

  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: '20px'
  },

  content: {
    fontSize: 14,
  },
})