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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [cards, setCards] = useState<string[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchCards = async () => {
      const storedCards = await AsyncStorage.getItem("cards");
      if (storedCards) {
        setCards(JSON.parse(storedCards));
      }
    };

    fetchCards();
  }, [isFocused]);

  const renderCard = ({ item }: { item: string }) => {
    const hiddenCardNumber = `**** **** **** ${item.slice(-4)}`;
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>{hiddenCardNumber}</Text>
      </View>
    );
  };

  return true ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/back.png")} // Replace with your image URL or local file
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cards</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddCard")}>
          <Image
            source={require("../assets/Icon.png")} // Replace with your image URL or local file
            style={styles.IconStyle}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Image
          source={require("../assets/💳.png")} // Replace with your image URL or local file
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
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddCard")}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
});

export default HomeScreen;
