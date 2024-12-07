import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function Group_A_HomeScreen() {
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

  const handleCountButtonPress = () => {
    router.push("/screens/groupA/number_count");
  };

  const handleMathOperationButtonPress = () => {
    router.push("/screens/groupA/math_operations");
  };
  const handleWhiteboardButtonPress = () => {
    router.push("/screens/groupA/whiteboard_operation_check");
  };
  const handleSelectAnswerButtonPress = () => {
    router.push("/screens/groupA/listen_and_select");
  };

  const handleLogout = async () => {
    // try {
    //   signOut(auth)
    //     .then(() => {
    //       navigation.navigate("Login");
    //     })
    //     .catch((error) => {
    //       console.error("Error logging out:", error);
    //     });
    // } catch (error) {
    //   console.error("Error logging out:", error);
    // }
  };

  const handleHomeButtonPress = () => {
    router.push("/screens/home");
  };
  const handleRecordCountingButtonPress = () => {
    router.push("/screens/groupA/record_your_counting");
  };

  return (
    <View style={styles.container}>
      <Image style={styles.coverImg} source={images[imageIndex]} />
      <Text style={styles.title}>Welcome to Cr.Calculus!</Text>
      <TouchableOpacity style={styles.button} onPress={handleCountButtonPress}>
        <Text style={styles.buttonText}>Count 0-50</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRecordCountingButtonPress}
      >
        <Text style={styles.buttonText}>Record Your Counting</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleMathOperationButtonPress}
      >
        <Text style={styles.buttonText}>Learn Basic Math Operations</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleWhiteboardButtonPress}
      >
        <Text style={styles.buttonText}>Smart Whiteboard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSelectAnswerButtonPress}
      >
        <Text style={styles.buttonText}>Smart Answers</Text>
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
