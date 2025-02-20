import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext'; // Adjust the import based on your structure
import BottomTabNavigator from './components/BottomTabNavigator';
import { MealProvider } from './context/MealContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MealProvider>
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      </MealProvider>
    </ThemeProvider>
  );
};

export default App;
