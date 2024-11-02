import { StyleSheet, Text, View } from "react-native";
import React from "react";
import StarRating from "./StarRating";
import { useState, useEffect } from "react";


const ReviewCard = ({ item }) => {
    const userId = 101;

    const [messageHeight, setMessageHeight] = useState(0); 
    const [reviewData, setReviewData] = useState(null); //variable for Review Date
    const [averageRating, setAverageRating] = useState('')

    const handleMessageLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setMessageHeight(height);
    };

    const cardHeight = 100 + messageHeight;

    if (!reviewData) {
      return null; // or Loading indicator or Placeholder
    }

    // Function to get month name from ISO date string
    const getMonthName = (dateString) => {
      const date = new Date(dateString);
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return monthNames[date.getMonth()];
    };



    // Function to calculate and format time difference in a human-readable format
  const timeAgo = (dateString) => {
    const reviewDate = new Date(dateString);
    const currentDate = new Date();
    const diffMs = currentDate - reviewDate;

    // Convert milliseconds to different units
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (weeks < 4) {
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  };




  console.log(item)
  return (
    <View style={{ flex: 1, justifyContent: "center" }}> 
      <View style={[styles.container, { height: cardHeight }]}> 
        <View style={styles.content1}>
          <Text style={{fontSize:14}}>{getMonthName(item.date)} </Text>
        </View>

        <View style={styles.content2} pointerEvents="none">
            <Text style={{fontSize:16, fontWeight:'bold'}}>{item.title}</Text>
            <StarRating size={18} rating={item.rating}/>
        </View>

        <View style={styles.content3} onLayout={handleMessageLayout}>
            <Text style={{fontSize: 15}}>{item.comment}</Text>
        </View>

        <View style={styles.content4}>
            <Text> {timeAgo(item.date)} </Text>
        </View>

      </View>

    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  container: {
    width: 374,
    height: 100,
    shadowColor: "#000",
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is for Android
    backgroundColor: "#fff",
    // paddingLeft: 10,
    paddingHorizontal: 15, // Adjust spacing as needed
    paddingVertical: 10,// Adjust spacing as needed
  },

  content1:{
    alignSelf:'flex-end',
    marginRight:10,
  },
  content2:{
    // marginLeft: 10,
  },
  content3:{
    // marginLeft: 10,
  },
  content4:{
    // marginLeft: 10,
    marginTop: 12
  }
});
