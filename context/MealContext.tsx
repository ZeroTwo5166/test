// MealContext.tsx
import React, { createContext, useContext } from "react";
import MealService, { IMealService } from "../services/MealService";

const MealContext = createContext<IMealService | null>(null);

export const MealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mealService = new MealService();
  return <MealContext.Provider value={mealService}>{children}</MealContext.Provider>;
};

export const useMealService = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMealService must be used within a MealProvider");
  }
  return context;
};
