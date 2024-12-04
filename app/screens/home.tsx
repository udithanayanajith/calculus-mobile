import { router } from "expo-router";
import { routeToScreen } from "expo-router/build/useScreens";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
  Alert,
} from "react-native";
// import { getAuth, signOut } from "firebase/auth";
// import { auth } from "./firebase";

const HomeScreen = () => {
  const handleGroup_A_ButtonPress = () => {
    // navigation.navigate("BlindHome");
    router.push("/screens/group_A_Home");
  };

  const handleGroup_B_ButtonPress = () => {
    // navigation.navigate("MuteHome");
    router.push("/screens/group_B_Home");
  };

  const handleGroup_Gamne_ButtonPress = () => {
    router.push("/screens/game/snake");
  };
  const handleLogout = async () => {
    try {
      router.push("/");
      //   signOut(auth)
      //     .then(() => {
      //       navigation.navigate("Login");
      //     })
      //     .catch((error) => {
      //       console.error("Error logging out:", error);
      //     });
    } catch (error) {
      console.error("Error logging out:", error);
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
      <Text style={styles.title}>Welcome to Cr.Calculus!</Text>
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
};

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
    height: "25%",
    borderWidth: 1,
    bottom: "8%",
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

export default HomeScreen;
