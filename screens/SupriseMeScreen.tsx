import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

const SurpriseMeScreen: React.FC = () => {
  const [recipe, setRecipe] = useState<any>(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const lastShakeTime = useRef(0);
  const shakeThreshold = 5.0; // Increased threshold for a harder shake

  const { theme } = useTheme();

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
        const randomRecipe = data.meals[0];
        setRecipe(randomRecipe);
        checkIfFavorite(randomRecipe.idMeal);
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

  const checkIfFavorite = async (idMeal: string) => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        setIsFavorite(parsedFavorites.some((meal: any) => meal.idMeal === idMeal));
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const addToFavorites = async () => {
    if (!recipe) return;

    try {
      const favorites = await AsyncStorage.getItem("favorites");
      const parsedFavorites = favorites ? JSON.parse(favorites) : [];
      if (!parsedFavorites.some((meal: any) => meal.idMeal === recipe.idMeal)) {
        parsedFavorites.push(recipe);
        await AsyncStorage.setItem("favorites", JSON.stringify(parsedFavorites));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const subscribe = Accelerometer.addListener(({ x, y, z }) => {
        const acceleration = Math.abs(x) + Math.abs(y) + Math.abs(z);
        if (acceleration > shakeThreshold) {
          fetchRandomRecipe();
        }
      });

      return () => {
        subscribe.remove();
      };
    }, [])
  );

  return (
    <SafeAreaView style={[styles.safeArea, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <ScrollView contentContainerStyle={[styles.container]}>
        <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
          Shake for a Random Recipe! 🎲
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
                {Array.from({ length: 20 }, (_, i) => i + 1)
                  .map((index) => ({
                    ingredient: recipe[`strIngredient${index}`],
                    measure: recipe[`strMeasure${index}`],
                  }))
                  .filter(({ ingredient }) => ingredient)
                  .map(({ ingredient, measure }, i) => (
                    <Text key={i} style={[styles.ingredientText, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
                      {`${ingredient} - ${measure}`}
                    </Text>
                  ))}

                <Text style={[styles.instructionsTitle, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
                  Instructions:
                </Text>
                <Text style={[styles.instructionsText, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
                  {recipe.strInstructions}
                </Text>

                <TouchableOpacity
                  style={[styles.favoriteButton, isFavorite ? styles.favorited : styles.notFavorited]}
                  onPress={addToFavorites}
                  disabled={isFavorite}
                >
                  <Text style={styles.buttonText}>{isFavorite ? "Already in Favorites ❤️" : "Save to Favorites"}</Text>
                </TouchableOpacity>
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
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
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
    marginTop: 10,
  },
  darkTitle: {
    color: "#fff",
  },
  lightTitle: {
    color: "#000",
  },
  image: {
    width: 200,
    height: 200,
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
    textAlign: "left",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  favoriteButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  notFavorited: {
    backgroundColor: "#28a745",
  },
  favorited: {
    backgroundColor: "#d9534f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SurpriseMeScreen;
