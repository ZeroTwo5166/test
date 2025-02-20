// MealService.ts
export interface IMealService {
    fetchRandomMeals(): Promise<any[]>;
  }
  
  class MealService implements IMealService {
    async fetchRandomMeals(): Promise<any[]> {
      try {
        const responses = await Promise.all([
          fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
          fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
          fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
        ]);
        const data = await Promise.all(responses.map((res) => res.json()));
        return data.map((mealData) => mealData.meals[0]);
      } catch (error) {
        console.error("Error fetching meals:", error);
        throw error; // Re-throw error for handling in component
      }
    }
  }
  
  export default MealService;
  