import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Record_your_counting() {
  const navigateToRecordNumbers = (min: number, max: number) => {
    router.push({
      pathname: "/screens/record_numbers",
      params: { min, max },
    });
  };

  const handleHomeButtonPress = () => {
    router.push("/screens/group_A_Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Range Before Count!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToRecordNumbers(0, 2)}
      >
        <Text style={styles.buttonText}>Count 0-10</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToRecordNumbers(10, 20)}
      >
        <Text style={styles.buttonText}>Count 10-20</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToRecordNumbers(20, 30)}
      >
        <Text style={styles.buttonText}>Count 20-30</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToRecordNumbers(30, 40)}
      >
        <Text style={styles.buttonText}>Count 30-40</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToRecordNumbers(40, 50)}
      >
        <Text style={styles.buttonText}>Count 40-50</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleHomeButtonPress}
      >
        <Text style={styles.buttonText}>Home</Text>
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
  logoutButton: {
    backgroundColor: "red",
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
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
