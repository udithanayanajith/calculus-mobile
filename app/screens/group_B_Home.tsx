import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function Group_B_HomeScreen() {
  const [imageIndex, setImageIndex] = useState(0);
  const images: string | any[] = [
    require("../../assets/images/1.png"),
    require("../../assets/images/2.png"),
    require("../../assets/images/3.png"),
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    const backAction = () => {
      // if (navigation.isFocused()) {
      //   BackHandler.exitApp();
      //   return true;
      // }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      clearInterval(intervalId);
      backHandler.remove();
    };
  }, []);

  const handleMathOperationButtonPress = () => {
    router.push("/screens/groupB/math_operations");
  };
  const handleBlindButtonPress = () => {
    // navigation.navigate("BlindHome");
  };

  const handleMuteButtonPress = () => {
    // navigation.navigate("MuteHome");
  };
  const handleTeachTimeButtonPress = () => {
    router.push("/screens/groupB/time_operations");
  };

  const handleHomeButtonPress = () => {
    router.push("/screens/home");
  };

  return (
    <View style={styles.container}>
      <Image style={styles.coverImg} source={images[imageIndex]} />
      <Text style={styles.title}>Welcome to Cr.Calculus!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleMathOperationButtonPress}
      >
        <Text style={styles.buttonText}>Math Operations 0-500</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleTeachTimeButtonPress}
      >
        <Text style={styles.buttonText}>Teach Time</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleMuteButtonPress}>
        <Text style={styles.buttonText}>Quiz</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleMuteButtonPress}>
        <Text style={styles.buttonText}>Listen And Answer </Text>
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
