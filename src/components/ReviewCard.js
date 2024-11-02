import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StarRating from "./StarRating";
import { useRideContext } from "../context/RideContext";

const ReviewCard = ({ item }) => {
  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[date.getMonth()];
  };

  const timeAgo = (dateString) => {
    const reviewDate = new Date(dateString);
    const currentDate = new Date();
    const diffMs = currentDate - reviewDate;

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
  // const timeAgo = (dateString) => {
  //   const reviewDate = new Date(dateString);
  //   if (isNaN(reviewDate.getTime())) {
  //     return 'Invalid date';
  //   }
  
  //   const currentDate = new Date();
  //   const diffMs = currentDate - reviewDate;
  
  //   const seconds = Math.floor(diffMs / 1000);
  //   const minutes = Math.floor(seconds / 60);
  //   const hours = Math.floor(minutes / 60);
  //   const days = Math.floor(hours / 24);
  //   const weeks = Math.floor(days / 7);
  //   const months = Math.floor(days / 30);
  //   const years = Math.floor(days / 365);
  
  //   if (seconds < 60) {
  //     return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  //   } else if (minutes < 60) {
  //     return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  //   } else if (hours < 24) {
  //     return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  //   } else if (days < 7) {
  //     return `${days} day${days !== 1 ? 's' : ''} ago`;
  //   } else if (weeks < 4) {
  //     return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  //   } else if (months < 12) {
  //     return `${months} month${months !== 1 ? 's' : ''} ago`;
  //   } else {
  //     return `${years} year${years !== 1 ? 's' : ''} ago`;
  //   }
  // };
  

  const handleMessageLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setMessageHeight(height);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.reviewer}</Text>
          <Text style={styles.date}>{timeAgo(item.date)}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={{fontSize:21, fontWeight:'bold'}}>{item.title}</Text>
          <StarRating rating={item.rating} size={16} />
        </View>

        <View style={styles.reviewContainer}>
          <Text style={styles.message}>{item.comment}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: "90%",
    elevation: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#888888",
  },
  ratingContainer: {
    marginTop: -20,
    gap: 10,
    marginBottom: 10,
  },
  reviewContainer: {
    flexDirection: "row",
  },
  message: {
    fontSize: 14,
    color: "#555555",
  },
});

export default ReviewCard;
