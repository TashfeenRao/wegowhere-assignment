import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
