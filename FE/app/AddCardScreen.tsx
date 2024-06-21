import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AddCardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Card</Text>
      {/* Add your card form components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default AddCardScreen;
