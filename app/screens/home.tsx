import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { clearAuthState } from "../customFiles/authUtils";

export default function HomeScreen() {
  const handleGroup_A_ButtonPress = () => {
    router.push("/screens/group_A_Home");
  };

  const handleGroup_B_ButtonPress = () => {
    router.push("/screens/group_B_Home");
  };

  const handleGroup_Gamne_ButtonPress = () => {
    router.push("/screens/game/snake");
  };

  const handleLogout = async () => {
    try {
      await clearAuthState();
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogoutButtonPress = () => {
    showLogoutAlert();
  };

  const showLogoutAlert = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: handleLogout,
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/welcome.png")}
        style={styles.coverBanner}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to Dr.Calculus!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGroup_A_ButtonPress}
      >
        <Text style={styles.buttonText}>Grade (1-3)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGroup_B_ButtonPress}
      >
        <Text style={styles.buttonText}>Grade (4-5)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGroup_Gamne_ButtonPress}
      >
        <Text style={styles.buttonText}>Snake Game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogoutButtonPress}
      >
        <Text style={styles.buttonText}>Logout</Text>
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
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  coverBanner: {
    width: "120%",
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
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
    marginTop: "auto",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: "90%",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
