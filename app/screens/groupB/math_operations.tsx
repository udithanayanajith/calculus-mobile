import { ResizeMode } from "expo-av";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";

export default function Basic_MathOperation_Screen() {
  const handleBackButtonPress = () => {
    router.push("/screens/group_B_Home");
  };

  const additionButtonPress = () => {
    router.push("/screens/groupB/addition_teching");
  };

  const substractButtonPress = () => {
    router.push("/screens/groupB/substraction_teaching");
  };

  const divisionButtonPress = () => {
    router.push("/screens/groupB/divition_teching");
  };
  const multiplicationtButtonPress = () => {
    router.push("/screens/groupB/multiplication_teaching");
  };
  return (
    <ImageBackground
      source={require("../../../assets/images/add_and_sub_back.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          style={styles.coverImg}
          source={require("../../../assets/images/groupB_math.png")}
          resizeMode={ResizeMode.CONTAIN}
        />
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
          style={styles.button}
          onPress={() => divisionButtonPress()}
        >
          <Text style={styles.buttonText}>Devision (/)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => multiplicationtButtonPress()}
        >
          <Text style={styles.buttonText}>Multiplication (*)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackButtonPress}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(224, 232, 249, 0.7)",
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
