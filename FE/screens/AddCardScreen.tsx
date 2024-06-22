import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Omise from "omise-react-native";
import { Input, Icon } from "react-native-elements";
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/back.png")} // Replace with your image URL or local file
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Input
          placeholder='Card Number'
          leftIcon={<Icon name='credit-card' type='font-awesome' />}
          onChangeText={setCardNumber}
          value={cardNumber}
        />
        <Input
          placeholder='MM/YY'
          leftIcon={<Icon name='calendar' type='font-awesome' />}
          onChangeText={setExpiry}
          value={expiry}
        />
        <Input
          placeholder='CVV'
          leftIcon={<Icon name='lock' type='font-awesome' />}
          onChangeText={setCvc}
          value={cvc}
        />
        <Button title='Add Card' onPress={handleAddCard} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    padding: 16,
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
