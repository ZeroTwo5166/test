import React from "react";
import { View, Text, StyleSheet, Switch, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext"; // Adjust this import based on your file structure

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const resetFavorites = async () => {
    try {
      await AsyncStorage.removeItem("favorites");
      Alert.alert("Success", "All favorite recipes have been removed.");
    } catch (error) {
      Alert.alert("Error", "Failed to reset favorite recipes.");
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkTitle : styles.lightTitle]}>
        Settings ⚙️
      </Text>
      <Text style={[styles.subtitle, theme === 'dark' ? styles.darkSubtitle : styles.lightSubtitle]}>
        Customize your app experience here.
      </Text>
      <View style={styles.themeToggle}>
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
      <Button title="Reset Favorites" onPress={resetFavorites} color="#ff4d4d" />
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
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
    color: "#ccc",
  },
  lightSubtitle: {
    color: "#555",
  },
  darkLabel: {
    color: "#fff",
  },
  lightLabel: {
    color: "#000",
  },
});

export default SettingsScreen;
