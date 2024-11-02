import React, { useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import GlobalStyles from '../styles/GlobalStyles';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SearchList from '../components/SearchList';
import { BASE_URL } from '../../config';
import Header from '../components/Header';
import { useRideContext } from '../context/RideContext';

const SearchDriver = ({route}) => {
  const navigation = useNavigation();

  const [items, setItems] = useState();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { id, setId, token, setToken } = useRideContext();

  const { item } = route.params;
  console.log("package id is", item.id)

  useFocusEffect(
      useCallback(() => {
          console.log('Fetching data on screen focus');
          fetchData();
      }, [])
  );

  const fetchData = async () => {
    try{
      const response = await fetch(`${BASE_URL}/driver/search_driver`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);

      setItems(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }

  const searchTerm = (text) => {
    if (text) {
      setSearchText(text);
      let filterList = items.filter((item) => {
        const fullName = `${item.fname || ''} ${item.lname || ''}`.toLowerCase();
        return fullName.includes(text.toLowerCase());
      });
      setData(filterList);
      console.log(searchText);
    } else {
      setSearchText('');
      setData(); 
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={GlobalStyles.wrapper}>
        <Header title="Search Driver" goBack={onPress=() => navigation.goBack()}/> 
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBtnStyle}
            placeholder="Search"
            onChangeText={(text) => searchTerm(text)}
            onFocus={() => {}}
          />
          <FontAwesome name="search" size={18} color="black" style={styles.searchicon} />
        </View>
        {searchText !== '' && data.length === 0 ? (
          <View style={GlobalStyles.whiteContainerWithSearchBar}>
            <View style={styles.noResults}>
                <Text style={styles.textNoResult}>Oops! No matching driver found.</Text>
                <Text style={styles.textNoResult01}>Please check the driver name again.</Text>
            </View>
          </View>
        ): searchText == '' ? (
          <View style={GlobalStyles.whiteContainerWithSearchBar}>
            <View style={styles.noResults}>
                <Text style={styles.textNoResult}>Search your driver by name</Text>
                <Text style={styles.textNoResult01}>Please enter the driver's name correctly.</Text>
            </View>
          </View>
        ):(
          <View style={GlobalStyles.whiteContainerWithSearchBar}>
            <SearchList data={data} packageId={item.id}/>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

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

export default SearchDriver;
