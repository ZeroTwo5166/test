import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Adjust this import

const SearchScreen: React.FC = () => {

  const { theme } = useTheme();

  return (

    
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
        Find  Overskritd
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
    backgroundColor: "#222", // Dark background color
  },
  lightContainer: {
    backgroundColor: "#fff", // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  darkTitle: {
    color: "#fff", // Dark title color
  },
  lightTitle: {
    color: "#000", // Light title color
  },
});

export default SearchScreen;
