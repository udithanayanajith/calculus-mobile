import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Basic_MathOperation_Screen() {
  const handleBackButtonPress = () => {
    router.push("/screens/group_A_Home");
  };

  const additionButtonPress = () => {
    router.push("/screens/groupA/addition_teching");
  };

  const substractButtonPress = () => {
    router.push("/screens/groupA/substraction_teaching");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Operation!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => additionButtonPress()}
      >
        <Text style={styles.buttonText}>Additions (+)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => substractButtonPress()}
      >
        <Text style={styles.buttonText}>Substractions (-)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackButtonPress}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E8F9",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  coverImg: {
    alignSelf: "center",
    width: "115%",
    height: "30%",
    borderWidth: 1,
    bottom: "8%",
    marginBottom: 0,
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    marginTop: -25,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: "90%",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: "auto", // Automatically push it to the bottom of the screen
    marginBottom: 20, // Add some space from the bottom
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: "90%",
    alignItems: "center",
    position: "absolute", // Fix at the bottom
    bottom: 10, // Distance from the bottom of the screen
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
