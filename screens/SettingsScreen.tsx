import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Adjust this import based on your file structure

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
      <Text style={styles.title}>Indstillinger ⚙️</Text>
      <Text>Tilpas din app-oplevelse her.</Text>
      <View style={styles.themeToggle}>
        <Text style={styles.toggleLabel}>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  darkContainer: {
    backgroundColor: "#333", // Dark background
  },
  lightContainer: {
    backgroundColor: "white", // Light background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  toggleLabel: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default SettingsScreen;
