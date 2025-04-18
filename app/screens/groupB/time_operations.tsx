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

export default function Basic_Time_Operation_Screen() {
  const handleBackButtonPress = () => {
    router.push("/screens/group_B_Home");
  };

  const timeTeachButtonPress = () => {
    router.push("/screens/groupB/time_teaching");
  };

  const tellTimeButtonPress = () => {
    router.push("/screens/groupB/time_tell_quiz");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/time_back.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          style={styles.coverImg}
          source={require("../../../assets/images/clock.png")}
          resizeMode={ResizeMode.CONTAIN}
        />
        <Text style={styles.title}>Select Operation!</Text>

        <TouchableOpacity style={styles.button} onPress={timeTeachButtonPress}>
          <Text style={styles.buttonText}>Learn How To Tell Time </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => tellTimeButtonPress()}
        >
          <Text style={styles.buttonText}>Tell Time</Text>
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
    justifyContent: "center",
  },
  coverImg: {
    alignSelf: "center",
    width: "115%",
    height: "50%",
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
