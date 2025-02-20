import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SurpriseMeScreen from "../screens/SupriseMeScreen";
import { useTheme } from "../context/ThemeContext"; // Adjust the import based on your structure

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme === "dark" ? "#222" : "#fff", // Set the background color based on the theme
        },
        tabBarActiveTintColor: theme === "dark" ? "#fff" : "#000", // Set the active icon color based on the theme
        tabBarInactiveTintColor: theme === "dark" ? "#888" : "#555", // Set the inactive icon color based on the theme
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Surprise Me"
        component={SurpriseMeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="shuffle" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
