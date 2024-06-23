import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Toast from "react-native-toast-message";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigationTypes";

type CardType = {
  card: {
    name: string;
    number: string;
    expiration_month: string;
    expiration_year: string;
    security_code: string;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "AddCard">;

const HomeScreen = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();

  const handleCardPress = async (item: CardType) => {
    try {
      const omisePublicKey = "pkey_test_5wvisbxphp1zapg8ie6";
      const omiseSecretKey = "skey_test_5wvisdjjoqmfof5npzw";

      const cardDetails = {
        card: {
          name: item.card.name,
          number: item.card.number,
          expiration_month: item.card.expiration_month,
          expiration_year: 20 + item.card.expiration_year,
          security_code: item.card.security_code,
        },
      };

      const tokenResponse = await axios.post(
        "https://vault.omise.co/tokens",
        cardDetails,
        {
          auth: {
            username: omisePublicKey,
            password: "",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const tokenId = tokenResponse.data.id;

      const chargeData = {
        amount: 2000,
        currency: "thb",
        card: tokenId,
      };

      const chargeResponse = await axios.post(
        "https://api.omise.co/charges",
        chargeData,
        {
          auth: {
            username: omiseSecretKey,
            password: "",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Toast.show({
        type: "success",
        position: "top",
        text1: "Payment Success",
        text2: "Your payment was successful",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    } catch (error: any) {
      console.log("Error creating charge:", error.response.data);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Payment Failed",
        text2: error.response.data.code,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }
  };
  useEffect(() => {
    const fetchCards = async () => {
      const storedCards = await AsyncStorage.getItem("cards");
      if (storedCards) {
        setCards(JSON.parse(storedCards));
      }
    };

    fetchCards();
  }, [isFocused]);

  const renderCard = ({ item }: { item: CardType }) => {
    const hiddenCardNumber = `\u2022\u2022\u2022\u2022   \u2022\u2022\u2022\u2022    \u2022\u2022\u2022\u2022    ${item.card.number.slice(
      -4
    )}`;
    return (
      <TouchableOpacity onPress={() => handleCardPress(item)}>
        <View style={styles.cardBox}>
          <Image
            source={require("../assets/Visa.png")} // Replace with your Visa logo image URL or local file
            style={styles.cardLogo}
          />
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumber}>{hiddenCardNumber}</Text>
          </View>
          <View style={styles.cardDetails}>
            <View>
              <Text style={styles.cardLabel}>Name on Card</Text>
              <Text style={styles.cardExpiry}>{item.card.name}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>Expires</Text>
              <Text style={styles.cardExpiry}>
                {item.card.expiration_month}/{item.card.expiration_year}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image source={require("../assets/back.png")} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cards</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddCard")}>
          <Image
            source={require("../assets/Icon.png")}
            style={styles.IconStyle}
          />
        </TouchableOpacity>
      </View>

      {cards.length === 0 ? (
        <View style={styles.content}>
          <Image
            source={require("../assets/💳.png")}
            style={styles.cardImage}
          />
          <Text style={styles.noCardsText}>No Cards Found</Text>
          <Text style={styles.recommendText}>
            We recommend adding a card for easy payment
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddCard")}>
            <Text style={styles.addCardText}>Add New Card</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  IconStyle: {
    width: 23,
    height: 23,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 23.8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 40,
    height: 40,
    marginBottom: 16,
  },
  noCardsText: {
    fontSize: 18,
    lineHeight: 25.2,
    marginBottom: 8,
  },
  recommendText: {
    fontSize: 18,
    lineHeight: 25.2,
    marginBottom: 16,
    textAlign: "center",
    width: "60%",
  },
  cardNumberContainer: {
    flex: 1,
    flexDirection: "column",
  },
  addCardText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4AD8DA",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  cardText: {
    fontSize: 18,
    color: "#333",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#1e90ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  cardBox: {
    backgroundColor: "#ffffff",
    padding: 30,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
    marginHorizontal: 16,
  },
  cardLogo: {
    width: 50,
    height: 20,
    resizeMode: "contain",
    marginBottom: 16,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: "500",
    color: "#808080",
    letterSpacing: 2,
    marginBottom: 16,
    flex: 1,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  cardName: {
    fontSize: 16,
    color: "#999",
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 14,
    color: "#8F8F8F",
    marginBottom: 12,
  },
  cardExpiry: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    color: "#000",
  },
});

export default HomeScreen;
