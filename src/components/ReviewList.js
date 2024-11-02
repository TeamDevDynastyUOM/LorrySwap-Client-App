import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews }) => {
  const renderItem = ({ item }) => <ReviewCard item={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    flatList: {
        flex: 1,
      },

  container: {
    flex: 1,
    padding: 10,
  },
});

export default ReviewList;
