import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const NumberCountScreen: React.FC = () => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [current, setCurrent] = useState<number | undefined>();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigation = useNavigation();
  let speechTime = 3;

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      Speech.stop();
      setIsSpeaking(false);
      setCurrent(undefined);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (
      current !== undefined &&
      current >= start &&
      current <= end &&
      !isSpeaking
    ) {
      repeatAndSpeakNumber(current, speechTime);
    }
  }, [current]);

  const repeatAndSpeakNumber = (number: number, repeatCount: number) => {
    setIsSpeaking(true);
    let count = 0;

    const speakLoop = () => {
      if (count < repeatCount) {
        Speech.speak(number.toString(), {
          language: "en-US",
          pitch: 1.0,
          rate: 0.4,
          onDone: () => {
            count++;
            speakLoop();
          },
        });
      } else {
        setIsSpeaking(false);
        if (number < end) {
          setTimeout(
            () => setCurrent((prev) => (prev !== undefined ? prev + 1 : start)),
            500
          );
        }
      }
    };

    speakLoop();
  };

  const handleNext = () => {
    Speech.stop();
    setIsSpeaking(false);
    if (current !== undefined && current < end && !isSpeaking) {
      setCurrent((prev) => (prev !== undefined ? prev + 1 : start));
    }
  };

  const handlePrevious = () => {
    Speech.stop();
    setIsSpeaking(false);
    if (current !== undefined && current > start && !isSpeaking) {
      setCurrent((prev) => (prev !== undefined ? prev - 1 : start));
    }
  };

  const handleRepeat = () => {
    if (current !== undefined && !isSpeaking) {
      repeatAndSpeakNumber(current, speechTime);
    }
  };

  const handleStart = () => {
    Speech.stop();
    setIsSpeaking(false);
    setCurrent(start);
  };

  const handleHomeButtonPress = () => {
    Speech.stop();
    router.push("/screens/group_A_Home");
  };

  return (
    <LinearGradient colors={["#F0F4FF", "#D0E4FF"]} style={styles.container}>
      <Text style={styles.title}>Learn to Count</Text>
      <View style={styles.rangeContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start:</Text>
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => setStart((prev) => Math.max(0, prev - 1))}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.number}>{start}</Text>
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => setStart((prev) => Math.min(prev + 1, end))}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>End:</Text>
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => setEnd((prev) => Math.max(start, prev - 1))}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.number}>{end}</Text>
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => setEnd((prev) => Math.min(prev + 1, 50))}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button title="Start" onPress={handleStart} />
      <View style={styles.displayContainer}>
        <Text style={styles.numberDisplay}>{current}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleRepeat}>
          <Icon name="repeat" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
          <Icon name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleHomeButtonPress}
      >
        <Text style={styles.buttonText}>Menu</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAE6",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 20,
    textShadowColor: "#FFD700",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  rangeContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  inputGroup: {
    marginHorizontal: 15,
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  numberButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  displayContainer: {
    marginVertical: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF6F61",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  numberDisplay: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#FF6F61",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 5,
  },
  controlButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "30%",
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: "50%",
    alignItems: "center",
  },
  controlText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    width: "50%",
  },
  startText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NumberCountScreen;
