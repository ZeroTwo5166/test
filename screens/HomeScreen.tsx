import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Animated,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const animatedScale = new Animated.Value(1); // For press effect

  useEffect(() => {
    fetchRandomMeals();
    loadFavorites();
  }, []);

  // Fetch 3 random meals
  const fetchRandomMeals = async () => {
    try {
      const responses = await Promise.all([
        fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
        fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
        fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
      ]);
      const data = await Promise.all(responses.map((res) => res.json()));
      setMeals(data.map((mealData) => mealData.meals[0]));
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!selectedMeal) return;

    const isFavorite = favorites.some((meal) => meal.idMeal === selectedMeal.idMeal);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((meal) => meal.idMeal !== selectedMeal.idMeal);
    } else {
      updatedFavorites = [...favorites, selectedMeal];
    }

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Reload favorites to ensure state is updated
    loadFavorites(); // Ensure the state reflects the latest favorites
  };

  const handleMealPress = (meal: any) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMeal(null);
  };

  const renderIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = selectedMeal[`strIngredient${i}`];
      const measure = selectedMeal[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
    return ingredients.map((item, index) => (
      <Text key={index} style={[styles.ingredientText, theme === "dark" ? styles.darkText : styles.lightText]}>
        {item}
      </Text>
    ));
  };

  // Button press animations
  const handlePressIn = () => {
    Animated.spring(animatedScale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const isFavorite = selectedMeal && favorites.some((meal) => meal.idMeal === selectedMeal.idMeal);

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>Welcome to Recipe Shaker!</Text>
      <Text style={[styles.subtitle, theme === "dark" ? styles.darkSubtitle : styles.lightSubtitle]}>
        Discover delicious recipes
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme === "dark" ? "#fff" : "#000"} />
      ) : (
        <View style={styles.mealsContainer}>
          {meals.map((meal) => (
            <TouchableOpacity
              key={meal.idMeal}
              style={[styles.mealCard, theme === "dark" ? styles.darkMealCard : styles.lightMealCard]}
              onPress={() => handleMealPress(meal)}
            >
              <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
              <Text style={[styles.mealName, theme === "dark" ? styles.darkText : styles.lightText]}>{meal.strMeal}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Meal Details Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalView, theme === "dark" ? styles.darkModalView : styles.lightModalView]}>
            {selectedMeal && (
              <>
                <Text style={[styles.modalTitle, theme === "dark" ? styles.darkText : styles.lightText]}>
                  {selectedMeal.strMeal}
                </Text>
                <Image source={{ uri: selectedMeal.strMealThumb }} style={styles.modalImage} />
                <ScrollView style={styles.scrollView}>
                  <Text style={[styles.modalInstructionsTitle, theme === "dark" ? styles.darkText : styles.lightText]}>
                    Ingredients:
                  </Text>
                  {renderIngredients()}
                  <Text style={[styles.modalInstructionsTitle, theme === "dark" ? styles.darkText : styles.lightText]}>
                    Instructions:
                  </Text>
                  <Text style={[styles.modalInstructions, theme === "dark" ? styles.darkText : styles.lightText]}>
                    {selectedMeal.strInstructions}
                  </Text>
                </ScrollView>

                {/* Animated Favorite Button */}
                <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
                  <TouchableOpacity
                    onPress={toggleFavorite}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={[styles.addToFavoritesButton, isFavorite ? styles.addedToFavoritesButton : styles.notAddedButton]}
                  >
                    <Text style={styles.addToFavoritesButtonText}>
                      {isFavorite ? "Added to Favorites" : "Add to Favorites"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  addToFavoritesButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  notAddedButton: {
    backgroundColor: "#ff5722",
  },
  addedToFavoritesButton: {
    backgroundColor: "#4CAF50",
  },
  addToFavoritesButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#222",
  },
  lightContainer: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  darkTitle: {
    color: "#fff",
  },
  lightTitle: {
    color: "#000",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  darkSubtitle: {
    color: "#aaa",
  },
  lightSubtitle: {
    color: "#666",
  },
  mealsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    flexWrap: "wrap",
    width: "100%",
  },
  mealCard: {
    width: "30%",
    margin: "1.5%",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    alignItems: "center",
  },
  darkMealCard: {
    backgroundColor: "#333", // Dark meal card background
  },
  lightMealCard: {
    backgroundColor: "#fff", // Light meal card background
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    padding: 5,
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
  },
  darkModal: {
    backgroundColor: "rgba(34, 34, 34, 0.9)", // Dark modal background
  },
  lightModal: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Light modal background
  },
  modalView: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  darkModalView: {
    backgroundColor: "#444", // Dark modal inner background
  },
  lightModalView: {
    backgroundColor: "#fff", // Light modal inner background
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalInstructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5, // Add margin to separate from ingredients
  },
  modalInstructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "left",
  },
  scrollView: {
    width: "100%",
    maxHeight: 300, // Limit the height of the scrollable area
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
  },
  closeButton: {
    backgroundColor: "#ff5722",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  }
});

export default HomeScreen;


/*import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

const FavoritesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("favorites");
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        console.log("DEBUG: Loaded Favorites Data ->", parsedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const removeFavorite = async (idMeal: string) => {
    try {
      const updatedFavorites = favorites.filter((meal) => meal.idMeal !== idMeal);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      Alert.alert("Removed", "Recipe removed from favorites.");
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
        Saved Recipes
      </Text>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {favorites.length === 0 ? (
          <Text style={[styles.emptyText, theme === "dark" ? styles.darkText : styles.lightText]}>
            No saved recipes yet.
          </Text>
        ) : (
          favorites.map((meal) => (
            <View key={meal.idMeal} style={styles.mealCard}>
              {meal.strMealThumb ? (
                <Image
                  source={{ uri: meal.strMealThumb + "?random=" + new Date().getTime() }} // Forces refresh
                  style={styles.image}
                  onError={(error) => console.log("Image Load Error:", error.nativeEvent.error)}
                />
              ) : (
                <Text style={styles.imageError}>Image Not Available</Text>
              )}
              <Text style={styles.mealName}>{meal.strMeal}</Text>
              <TouchableOpacity onPress={() => removeFavorite(meal.idMeal)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove ❌</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
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
    marginBottom: 10,
  },
  darkTitle: {
    color: "#fff",
  },
  lightTitle: {
    color: "#000",
  },
  scrollContainer: {
    width: "100%",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontStyle: "italic",
    marginTop: 20,
  },
  mealCard: {
    width: "90%",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageError: {
    fontSize: 16,
    fontStyle: "italic",
    color: "gray",
    marginBottom: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
    maxWidth: "90%",
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
});

export default FavoritesScreen;
 */