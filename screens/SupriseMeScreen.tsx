import React, { useState, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext"; // Adjust this import

const recipes = [
  { id: "1", name: "Pasta Carbonara", image: "https://via.placeholder.com/150" },
  { id: "2", name: "Avocado Toast", image: "https://via.placeholder.com/150" },
  { id: "3", name: "Chicken Curry", image: "https://via.placeholder.com/150" }
];

const SurpriseMeScreen: React.FC = () => {
  const [recipe, setRecipe] = useState(recipes[0]);
  const [isCooldown, setIsCooldown] = useState(false);
  const lastShakeTime = useRef(0); // UseRef to persist last shake time without re-rendering

  const { theme } = useTheme();

  // Function to get a random recipe
  const shuffleRecipe = () => {
    const now = Date.now();
    
    if (isCooldown || now - lastShakeTime.current < 2000) return; // Prevent rapid triggering
    lastShakeTime.current = now; // Update last shake time
    setIsCooldown(true); // Activate cooldown

    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    setRecipe(randomRecipe);
    Alert.alert("New Recipe!", `Try: ${randomRecipe.name}`);

    setTimeout(() => setIsCooldown(false), 2000); // 2-second cooldown
  };

  // Handle accelerometer when screen is focused
  useFocusEffect(
    useCallback(() => {
      const subscribe = Accelerometer.addListener(({ x, y, z }) => {
        const acceleration = Math.abs(x) + Math.abs(y) + Math.abs(z);
        if (acceleration > 5.0) { // Higher threshold for a harder shake
          shuffleRecipe();
        }
      });

      return () => {
        subscribe.remove(); // Stop accelerometer when leaving screen
      };
    }, []) // No dependencies, avoid unnecessary re-renders
  );

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
            <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
Shake Hard for a Random Recipe! 🎲</Text>
      <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>{recipe.name}</Text>
      <TouchableOpacity  onPress={shuffleRecipe} disabled={isCooldown}>
      <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>{isCooldown ? "Wait..." : "Surprise Me!"}</Text>
      </TouchableOpacity>
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


export default SurpriseMeScreen;
