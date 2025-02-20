import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Load favorites from local storage when the component mounts or when favorites change
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } else {
          setFavorites([]); // Set to an empty array if no favorites found
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites(); // Initial load
    const interval = setInterval(loadFavorites, 1000); // Poll every second to check for changes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

// Remove a meal from favorites
const removeFromFavorites = async (mealId: string) => {
  try {
    // Create a new array without the meal to be removed
    const updatedFavorites = favorites.filter((meal) => meal.idMeal !== mealId);
    
    // Check if the item is successfully removed
    console.log("Meal ID to remove:", mealId);
    console.log("Updated favorites before saving:", updatedFavorites);
    
    // Update state with the new list
    setFavorites(updatedFavorites); 
    
    // Save updated list to AsyncStorage
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    
    // Log the final count of favorites
    console.log("Favorites after removal:", updatedFavorites.length);
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};


  // Render ingredients for the selected meal
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

  // Handle meal press to open modal
  const handleMealPress = (meal: any) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMeal(null);
  };

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
        Favorite Recipes
      </Text>
      <ScrollView style={styles.scrollView}>
        {favorites.length > 0 ? (
          favorites.map((meal) => (
            <View key={meal.idMeal} style={[styles.mealCard, { backgroundColor: theme === "dark" ? "#444" : "#f9f9f9" }]}>
              <TouchableOpacity onPress={() => handleMealPress(meal)} style={styles.mealInfo}>
                <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
                <Text style={[styles.mealName, theme === "dark" ? styles.darkText : styles.lightText]}>
                  {meal.strMeal}
                </Text>
              </TouchableOpacity>
              <Pressable style={styles.removeButton} onPress={() => removeFromFavorites(meal.idMeal)}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={[styles.noFavorites, theme === "dark" ? styles.darkText : styles.lightText]}>
            No favorite recipes found.
          </Text>
        )}
      </ScrollView>

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

                <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#222",
  },
  lightContainer: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  darkTitle: {
    color: "#fff",
  },
  lightTitle: {
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  scrollView: {
    width: "100%",
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  mealInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
  },
  removeButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noFavorites: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  darkModalView: {
    backgroundColor: "#444",
  },
  lightModalView: {
    backgroundColor: "#fff",
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
    marginBottom: 5,
  },
  modalInstructions: {
    fontSize: 16,
    textAlign: "left",
  },
  closeButton: {
    backgroundColor: "#ff5722",
    padding: 12,
    borderRadius: 8,
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
  },
});

export default FavoritesScreen;
