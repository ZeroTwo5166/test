import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext"; // Adjust this import

const SearchScreen: React.FC = () => {
  const { theme } = useTheme(); // Retrieve the theme from context
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
  const [meals, setMeals] = useState<any[]>([]); // State for the search results
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedMeal, setSelectedMeal] = useState<any>(null); // State for the selected meal
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  // Function to handle the search
  const handleSearch = async (term: string) => {
    if (!term) {
      setMeals([]); // Clear meals if the search term is empty
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
      );
      const data = await response.json();
      if (data.meals) {
        setMeals(data.meals); // Set the meals state to the fetched data
      } else {
        setMeals([]); // Clear meals if no results
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Use effect to handle searching as the user types
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]); // Runs every time searchTerm changes

  // Function to handle meal selection
  const handleMealSelect = (meal: any) => {
    setSelectedMeal(meal); // Set selected meal
    setModalVisible(true); // Show modal
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedMeal(null); // Clear selected meal
    setModalVisible(false); // Hide modal
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

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
        Search for Food
      </Text>
      <TextInput
        style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
        placeholder="Type a meal name..."
        placeholderTextColor={theme === "dark" ? "#aaa" : "#555"}
        value={searchTerm}
        onChangeText={setSearchTerm} // Update the search term on change
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme === "dark" ? "#fff" : "#000"} />
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {meals.map((meal) => (
            <TouchableOpacity key={meal.idMeal} onPress={() => handleMealSelect(meal)}>
              <View style={[styles.mealCard, { backgroundColor: theme === "dark" ? "#444" : "#f9f9f9" }]}>
                <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
                <Text style={[styles.mealName, theme === "dark" ? styles.darkText : styles.lightText]}>
                  {meal.strMeal}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {meals.length === 0 && (
            <Text style={[styles.noResults, theme === "dark" ? styles.darkText : styles.lightText]}>
              No meals found.
            </Text>
          )}
        </ScrollView>
      )}

      {/* Modal for Meal Details */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <View style={[styles.modalContainer, theme === "dark" ? styles.darkModal : styles.lightModal]}>
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

                <Pressable style={styles.closeButton} onPress={closeModal}>
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
    backgroundColor: "#222", // Dark background color
  },
  lightContainer: {
    backgroundColor: "#fff", // Light background color
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#ff5722", // Bright color for the title
  },
  darkTitle: {
    color: "#ffcc00", // Dark theme title color
  },
  lightTitle: {
    color: "#ff5722", // Light theme title color
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent background
    borderColor: "#ccc",
  },
  darkInput: {
    borderColor: "#555", // Dark input border color
    backgroundColor: "#333", // Dark input background
    color: "#fff", // Dark input text color
  },
  lightInput: {
    borderColor: "#ccc", // Light input border color
    backgroundColor: "#fff", // Light input background
    color: "#000", // Light input text color
  },
  resultsContainer: {
    width: "100%",
    marginTop: 10,
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
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
    elevation: 3, // Add elevation for Android
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
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  noResults: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
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
  },
});

export default SearchScreen;
