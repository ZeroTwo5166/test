import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Adjust this import

const FavoritesScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
        Favorites Screen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  darkContainer: {
    backgroundColor: "#222",
  },
  lightContainer: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  darkTitle: {
    color: "#fff",
  },
  lightTitle: {
    color: "#000",
  },
});

export default FavoritesScreen;
