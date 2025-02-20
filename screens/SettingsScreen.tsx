import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Adjust this import based on your file structure

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkTitle : styles.lightTitle]}>
        Settings ⚙️
      </Text>
      <Text style={[styles.subtitle, theme === 'dark' ? styles.darkSubtitle : styles.lightSubtitle]}>
      Customize your app experience here.
      </Text>
      <View style={[
        styles.themeToggle,
        { backgroundColor: theme === 'dark' ? '#333' : '#fff' } // Apply background color conditionally
      ]}>
        <Text style={[styles.toggleLabel, theme === 'dark' ? styles.darkLabel : styles.lightLabel]}>
          {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
        </Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={theme === 'dark' ? '#fff' : '#f4f3f4'}
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
    padding: 20,
    paddingVertical: 40, // Additional vertical padding for better spacing
  },
  darkContainer: {
    backgroundColor: "#222", // Dark background
  },
  lightContainer: {
    backgroundColor: "#f5f5f5", // Light background for a softer look
  },
  title: {
    fontSize: 28, // Slightly larger font size
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center", // Center align the subtitle for better readability
    paddingHorizontal: 20, // Add padding for readability
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    elevation: 3, // Adds shadow on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 1 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 1, // Shadow blur radius
  },
  toggleLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  darkTitle: {
    color: "#fff",
  },
  lightTitle: {
    color: "#000",
  },
  darkSubtitle: {
    color: "#ccc", // Softer color for dark theme
  },
  lightSubtitle: {
    color: "#555", // Softer color for light theme
  },
  darkLabel: {
    color: "#fff",
  },
  lightLabel: {
    color: "#000",
  },
});

export default SettingsScreen;
