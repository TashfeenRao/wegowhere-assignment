import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Omise from "omise-react-native";

Omise.config("your_omise_public_key"); // Replace with your Omise public key

const AddCardScreen = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvc, setCvc] = useState("");
  const navigation = useNavigation();

  const handleAddCard = async () => {
    if (
      cardNumber.length === 16 &&
      expiryMonth.length === 2 &&
      expiryYear.length === 4 &&
      cvc.length === 3
    ) {
      try {
        const token = await Omise.createToken({
          card: {
            name: "John Doe", // Replace with the cardholder's name
            number: cardNumber,
            expiration_month: expiryMonth,
            expiration_year: expiryYear,
            security_code: cvc,
          },
        });

        if (token.id) {
          const storedCards = await AsyncStorage.getItem("cards");
          const cards = storedCards ? JSON.parse(storedCards) : [];
          cards.push(cardNumber);
          await AsyncStorage.setItem("cards", JSON.stringify(cards));
          navigation.goBack();
        } else {
          alert("Failed to create token");
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    } else {
      alert("Please fill in all fields correctly");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Card Number:</Text>
      <TextInput
        style={styles.input}
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType='numeric'
        maxLength={16}
      />
      <Text style={styles.label}>Expiry Month:</Text>
      <TextInput
        style={styles.input}
        value={expiryMonth}
        onChangeText={setExpiryMonth}
        keyboardType='numeric'
        maxLength={2}
      />
      <Text style={styles.label}>Expiry Year:</Text>
      <TextInput
        style={styles.input}
        value={expiryYear}
        onChangeText={setExpiryYear}
        keyboardType='numeric'
        maxLength={4}
      />
      <Text style={styles.label}>CVC:</Text>
      <TextInput
        style={styles.input}
        value={cvc}
        onChangeText={setCvc}
        keyboardType='numeric'
        maxLength={3}
      />
      <Button title='Add Card' onPress={handleAddCard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 18,
    marginBottom: 16,
  },
});

export default AddCardScreen;
