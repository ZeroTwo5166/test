import React, { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, SafeAreaView } from "react-native";
import { Accelerometer } from "expo-sensors";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext"; // Adjust this import

const SurpriseMeScreen: React.FC = () => {
  const [recipe, setRecipe] = useState<any>(null); // Initialize as null
  const [isCooldown, setIsCooldown] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const lastShakeTime = useRef(0); // UseRef to persist last shake time without re-rendering

  const { theme } = useTheme();

  // Function to fetch a random recipe from the API
  const fetchRandomRecipe = async () => {
    const now = Date.now();

    if (isCooldown || now - lastShakeTime.current < 2000) return; // Prevent rapid triggering
    lastShakeTime.current = now; // Update last shake time
    setIsCooldown(true); // Activate cooldown
    setLoading(true); // Start loading

    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        const randomRecipe = data.meals[0]; // Get the first meal from the response
        setRecipe(randomRecipe);
      } else {
        console.error("No recipe found!");
      }
    } catch (error) {
      console.error("Error fetching random recipe:", error);
    } finally {
      setIsCooldown(false); // Reset cooldown
      setLoading(false); // Stop loading
    }
  };

  // Handle accelerometer when screen is focused
  useFocusEffect(
    useCallback(() => {
      const subscribe = Accelerometer.addListener(({ x, y, z }) => {
        const acceleration = Math.abs(x) + Math.abs(y) + Math.abs(z);
        if (acceleration > 5.0) { // Higher threshold for a harder shake
          fetchRandomRecipe();
        }
      });

      return () => {
        subscribe.remove(); // Stop accelerometer when leaving screen
      };
    }, []) // No dependencies, avoid unnecessary re-renders
  );

  return (
    <SafeAreaView style={[styles.safeArea, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <ScrollView contentContainerStyle={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
        <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
          Shake Hard for a Random Recipe! 🎲
        </Text>
        <Text style={[styles.instructions, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
          Simply shake your device to get a new recipe!
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme === "dark" ? "#fff" : "#000"} />
        ) : (
          <>
            {recipe ? (
              <>
                <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
                  {recipe.strMeal}
                </Text>
                <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
                <Text style={[styles.ingredientsTitle, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
                  Ingredients:
                </Text>
                {/* Displaying Ingredients */}
                {recipe.strIngredient1 && <Text style={[styles.ingredientText, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>{`${recipe.strIngredient1} - ${recipe.strMeasure1}`}</Text>}
                {recipe.strIngredient2 && <Text style={[styles.ingredientText, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>{`${recipe.strIngredient2} - ${recipe.strMeasure2}`}</Text>}
                {recipe.strIngredient3 && <Text style={[styles.ingredientText, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>{`${recipe.strIngredient3} - ${recipe.strMeasure3}`}</Text>}
                {recipe.strIngredient4 && <Text style={[styles.ingredientText, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>{`${recipe.strIngredient4} - ${recipe.strMeasure4}`}</Text>}
                {recipe.strIngredient5 && <Text style={[styles.ingredientText, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>{`${recipe.strIngredient5} - ${recipe.strMeasure5}`}</Text>}
                {/* Add more ingredients as needed */}

                <Text style={[styles.instructionsTitle, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
                  Instructions:
                </Text>
                <Text style={[styles.instructionsText, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
                  {recipe.strInstructions}
                </Text>
              </>
            ) : (
              <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
                No Recipe Available
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#222", // Default to dark for safe area
  },
  container: {
    flexGrow: 1, // Allows ScrollView to grow as needed
    alignItems: "center",
    justifyContent: "flex-start", // Align items to the top
    padding: 20,
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
    textAlign: "center",
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10, // Ensure there's space above
  },
  darkTitle: {
    color: "#fff",
  },
  lightTitle: {
    color: "#000",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  ingredientText: {
    fontSize: 16,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  instructionsText: {
    fontSize: 16,
    textAlign: "left", // Align instructions to the left for readability
    marginVertical: 10, // Space around the instructions
    paddingHorizontal: 10, // Padding for left and right
  },
});

export default SurpriseMeScreen;
