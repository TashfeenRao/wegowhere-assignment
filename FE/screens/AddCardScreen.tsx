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
import RoundedInput from "../components/RoundedInput";
Omise.config("your_omise_public_key"); // Replace with your Omise public key

const AddCardScreen = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const navigation = useNavigation();

  const formatCardNumber = (input) => {
    // Remove all non-digits
    const digitsOnly = input.replace(/\D/g, "");
    // Insert space every 4 characters
    return digitsOnly.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (input) => {
    // Remove all non-digits
    const digitsOnly = input.replace(/\D/g, "");
    // Add '/' after 2 digits (month)
    if (digitsOnly.length > 2) {
      return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    }
    return digitsOnly;
  };
  const handleAddCard = async () => {
    if (cardNumber.length === 16 && cvc.length === 3) {
      try {
        const token = await Omise.createToken({
          card: {
            name: "John Doe", // Replace with the cardholder's name
            number: cardNumber,
            expiration_month: expiry.split("/")[0],
            expiration_year: expiry.split("/")[1],
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
        <Text style={styles.label}>ATM/Debit/Credit card number</Text>
        <RoundedInput
          placeholder='0000 0000 0000 0000'
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          value={cardNumber}
          keyboardType='numeric'
          maxLength={19}
        />
        <Text style={styles.label}>Name on Card</Text>
        <RoundedInput
          placeholder='Ty Lee'
          onChangeText={setCardName}
          value={cardName}
          maxLength={19}
        />

        <View style={styles.innerInput}>
          <View>
            <Text style={styles.label}>Expiry Date</Text>
            <RoundedInput
              placeholder='MM/YY'
              onChangeText={(text) => setExpiry(formatExpiry(text))}
              value={expiry}
              keyboardType='numeric'
              maxLength={5}
            />
          </View>
          <View>
            <Text style={styles.label}>CVV</Text>
            <RoundedInput
              placeholder='CVV'
              onChangeText={setCvc}
              value={cvc}
              keyboardType='numeric'
              maxLength={3}
            />
          </View>
        </View>
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
  innerInput: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
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
  inputContainer: {
    borderBottomWidth: 1,
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

export default AddCardScreen;
