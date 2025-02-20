import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext'; // Adjust the import based on your structure
import BottomTabNavigator from './components/BottomTabNavigator';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
