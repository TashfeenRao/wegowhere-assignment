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
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder='0000 0000 0000 0000'
            keyboardType='numeric'
            value={cardNumber}
            placeholderTextColor={"#CDCDCD"}
            onChangeText={setCardNumber}
          />
          <View style={styles.cardIcons}>
            <Image
              source={require("../assets/visa_color_2.png")}
              style={styles.cardIcon}
            />
            <Image
              source={require("../assets/mastercard_color_2.png")}
              style={styles.cardIcon}
            />
            <Image
              source={require("../assets/jcb_color_2.png")}
              style={styles.cardIcon}
            />
          </View>
        </View>
        <Text style={styles.label}>Name on Card</Text>
        <TextInput
          style={styles.input}
          placeholder='Ty Lee'
          value={cardName}
          onChangeText={setCardName}
          placeholderTextColor={"#CDCDCD"}
        />
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Expiry date</Text>
            <TextInput
              style={styles.input}
              placeholder='MM/YY'
              value={expiry}
              onChangeText={setExpiry}
              placeholderTextColor={"#CDCDCD"}
            />
          </View>
          <View style={styles.column2}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              keyboardType='numeric'
              secureTextEntry
              value={cvc}
              onChangeText={setCvc}
              placeholderTextColor={"#CDCDCD"}
            />
          </View>
        </View>
        <View style={styles.securityIcons}>
          <Image
            source={require("../assets/verified-by-visa.png")}
            style={styles.securityIcon1}
          />
          <Image
            source={require("../assets/mastercard-securecode-grey.png")}
            style={styles.securityIcon2}
          />
          <Image
            source={require("../assets/omise-grey.png")}
            style={styles.securityIcon2}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Card</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "space-between",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 21,
    marginBottom: 8,
    color: "#000000",
  },
  content: {
    flex: 1,
    paddingTop: 20,
    marginLeft: 25,
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
    paddingRight: 60, // add padding to the right to make space for icons
    fontSize: 16,
    maxWidth: 350,
    marginBottom: 30,
    maxHeight: 50,
  },
  inputWrapper: {
    position: "relative",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: 350,
  },
  column: {
    flex: 1,
  },
  column2: {
    flex: 1,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#4AD8DA",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
    width: 331,
    alignContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: "700",
  },
  cardIcons: {
    position: "absolute",
    right: 50,
    top: 18,
    flexDirection: "row",
  },
  cardIcon: {
    width: 25,
    height: 15,
    marginRight: 10,
  },
  securityIcons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  securityIcon1: {
    width: 40,
    height: 20,
    marginHorizontal: 10,
  },
  securityIcon2: {
    width: 55,
    height: 20,
    marginHorizontal: 10,
  },
});

export default AddCardScreen;
