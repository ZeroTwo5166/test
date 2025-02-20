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
} from "react-native";
import { useTheme } from "../context/ThemeContext"; // Adjust this import

const HomeScreen: React.FC = () => {
  const { theme } = useTheme(); // Retrieve the theme from context
  const [meals, setMeals] = useState<any[]>([]); // State to hold the fetched meals
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [selectedMeal, setSelectedMeal] = useState<any>(null); // State for the selected meal
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Modal visibility state

  // Function to fetch three random meals
  const fetchRandomMeals = async () => {
    try {
      const responses = await Promise.all([
        fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
        fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
        fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
      ]);
      const data = await Promise.all(responses.map((res) => res.json()));
      setMeals(data.map((mealData) => mealData.meals[0])); // Get meals from the responses
    } catch (error) {
      console.error("Error fetching the meals:", error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  useEffect(() => {
    fetchRandomMeals(); // Fetch meal data on component mount
  }, []);

  const handleMealPress = (meal: any) => {
    setSelectedMeal(meal); // Set the selected meal
    setModalVisible(true); // Open the modal
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close the modal
    setSelectedMeal(null); // Clear the selected meal
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
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === "dark" ? styles.darkTitle : styles.lightTitle]}>
        Welcome to Recipe Shaker!
      </Text>
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
              style={[styles.mealCard, theme === "dark" ? styles.darkMealCard : styles.lightMealCard]} // Use theme for meal card
              onPress={() => handleMealPress(meal)}
            >
              <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
              <Text style={[styles.mealName, theme === "dark" ? styles.darkText : styles.lightText]}>
                {meal.strMeal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal for Meal Details */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
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
  },
});

export default HomeScreen;
