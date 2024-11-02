import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, SafeAreaView, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import GlobalStyles from "../styles/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { BASE_URL } from "../../config";
import { useRideContext } from "../context/RideContext";
import ReviewAnalyzeCard from "../components/ReviewAnalyzeCard";
import ReviewCard from "../components/ReviewCard";
import Header from "../components/Header";
import ReviewList from "../components/ReviewList";

const DriverProfile = ({ route }) => {
  const navigation = useNavigation();
  const { token } = useRideContext();
  const [userReviews, setUserReviews] = useState(null);
  const [userRecentReview, setUserRecentReview] = useState([]);
  const [vehicle, setVehicle ] = useState({})
  const [loading, setLoading] = useState(false)

  const { item, packageId } = route.params;

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/review_analysis/${item.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch review data");
        }

        const data = await response.json();
        setUserReviews(data.response);

        const response1 = await fetch(`${BASE_URL}/vehicle/get_vehicle_details/${item.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response1.ok) {
          throw new Error("Failed to fetch review data");
        }

        const data1 = await response1.json();
        setVehicle(data1);
        
      } catch (error) {
        console.error('Error fetching review data from review_analysis:', error);
      }
    };
    fetchReviewData();
  }, [item.id, token]);

  useEffect(() => {
    const fetchRecentReviewData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get_recent_reviews/${item.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch review data');
        }

        const data = await response.json();
        setUserRecentReview(data);
      } catch (error) {
        console.error('Error fetching recent_reviews:', error);
      }
    };

    fetchRecentReviewData();
  }, [item.id]);

  const handleRequest = async () => {
    try {
      const data = {
        rideId: packageId,
        driver_id: item.id
      };
      const response = await fetch(`${BASE_URL}/cf/send_special_request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigation.navigate('Rides');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to update backend');
      }
    } catch (error) {
      console.error('Error updating backend:', error);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.wrapper}>
      <Header title="" goBack={() => navigation.goBack()} />
      <View style={styles.whiteContainer}>
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <View style={styles.ProfileImage}>
              <Image source={{uri: item.photo}} style={styles.image} />
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ marginLeft: 10, flex: 1,alignItems: 'flex-start' }}>
              <Text style={styles.NameText}>{item.fname} {item.lname}</Text>
              <View style={{ marginLeft: 10 }}>
                <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
                  <Text style={styles.requestButtonText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginRight: 10, flex: 1, alignItems: 'flex-end', gap: 5 }}>
              <Text style={{...styles.NameText, fontSize: 36,}}>
                {vehicle.Vehicleno}
              </Text>
              <View style={{ flexDirection: 'row',alignItems: 'center', gap: 4 }}>
                <MaterialIcons name="phone-android" size={25} color='#004344' />
                <Text style={{...styles.NameText, fontSize: 15,}}>Voice Call</Text>
              </View>

              <View style={{ flexDirection: 'row',alignItems: 'center', gap: 5  }} >
                <MaterialIcons name="message" size={25} color='#004344' />
                <Text style={{...styles.NameText, fontSize: 15, marginLeft: 3, }}>Message</Text>
              </View>
            </View>
          </View>

          <View>
            <ReviewAnalyzeCard reviews={userReviews} />
          </View>

          <View style={styles.reviewCardWrapper}>
            {/* <FlatList
              data={userRecentReview}
              keyExtractor={(item, index) => index.toString()} // Use index as key
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ReviewCard item={item} />
              )}
            /> */}
            <ReviewList reviews={userRecentReview} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: "-25%",
  },
  whiteContainer: {
    flex: 1,
    marginTop: 175,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  ProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 5,
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  NameText: {
    fontSize: 20,
    color: "#004344",
    fontWeight: "bold",
    paddingBottom: 5,
  },
  requestButton: {
    backgroundColor: '#004344',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  requestButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  reviewCardWrapper: {
    flex: 1,
  },
});

export default DriverProfile;
