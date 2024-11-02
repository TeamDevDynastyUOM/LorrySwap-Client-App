// components/TimePicker.js
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePicker = ({ date, onDateChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={styles.datePickerContainer}>
      <Text style={styles.label}>Brings on</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateInput}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowDatePicker(false);
            onDateChange(currentDate);
          }}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
    paddingTop: "2%",
  },
  label: {
    color: "#132939",
    fontSize: 15,
    paddingTop: "3%",
  },
  dateInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#132939",
    alignSelf: "flex-start",
    lineHeight: 35,
    paddingLeft: "12%",
    paddingRight: "2%",
  },
});

export default DatePicker;
