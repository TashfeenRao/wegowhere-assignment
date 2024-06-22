import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const RoundedInput = ({
  placeholder,
  value,
  onChangeText,
  maxLength,
  keyboardType,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default RoundedInput;
