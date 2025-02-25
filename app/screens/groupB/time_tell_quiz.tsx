import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker"; // Modern dropdown component
import AnalogClock from "../../customFiles/AnalogClock";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const TimeQuizScreen = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [selectedHour, setSelectedHour] = useState("1");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [openHourDropdown, setOpenHourDropdown] = useState(false);
  const [openMinuteDropdown, setOpenMinuteDropdown] = useState(false);
  const [feedbackAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 12) * 5;
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  };

  useEffect(() => {
    const time = generateRandomTime();
    setCorrectAnswer(time);
  }, [questionIndex]);

  const handleSubmitAnswer = () => {
    const answer = `${selectedHour}:${selectedMinute}`;

    if (answer === correctAnswer) {
      setScore(score + 1);
      setFeedbackMessage("Correct!");
      startFeedbackAnimation();
    } else {
      setFeedbackMessage(`Wrong! Correct answer is: ${correctAnswer}`);
      startFeedbackAnimation();
    }

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setQuestionIndex(questionIndex + 1);
      if (questionIndex + 1 === 10) {
        setShowScorePopup(true);
      } else {
        setCorrectAnswer(generateRandomTime());
      }
    }, 1500);
  };

  const startFeedbackAnimation = () => {
    feedbackAnim.setValue(0);
    Animated.timing(feedbackAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const feedbackOpacity = feedbackAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleBackButtonPress = () => {
    router.push("/screens/groupB/time_operations");
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionIndex(0);
    setSelectedHour("1");
    setSelectedMinute("00");
    setShowScorePopup(false);
    setCorrectAnswer(generateRandomTime());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Time!</Text>
      <View style={styles.clock}>
        <AnalogClock time={correctAnswer} />
      </View>

      <View style={styles.pickerContainer}>
        <DropDownPicker
          open={openHourDropdown}
          setOpen={setOpenHourDropdown}
          value={selectedHour}
          setValue={setSelectedHour}
          items={[...Array(12)].map((_, index) => ({
            label: `${index + 1}`,
            value: `${index + 1}`,
          }))}
          containerStyle={styles.dropdown}
          placeholder="Hour"
          zIndex={1000}
        />
        <Text style={styles.separator}>:</Text>
        <DropDownPicker
          open={openMinuteDropdown}
          setOpen={setOpenMinuteDropdown}
          value={selectedMinute}
          setValue={setSelectedMinute}
          items={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
            (minute) => ({
              label: `${minute < 10 ? `0${minute}` : minute}`,
              value: `${minute < 10 ? `0${minute}` : minute}`,
            })
          )}
          containerStyle={styles.dropdown}
          placeholder="Minute"
          zIndex={500}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmitAnswer}
        style={styles.submitButton}
      >
        <Text style={styles.submitButtonText}>Submit Answer</Text>
      </TouchableOpacity>

      {showFeedback && (
        <Modal
          transparent={true}
          visible={showFeedback}
          animationType="fade"
          onRequestClose={() => setShowFeedback(false)}
        >
          <TouchableOpacity
            style={styles.feedbackContainer}
            activeOpacity={1}
            onPress={() => setShowFeedback(false)}
          >
            <Animated.View
              style={[styles.feedbackBox, { opacity: feedbackOpacity }]}
            >
              <Text
                style={{
                  color: feedbackMessage.startsWith("Correct")
                    ? "green"
                    : "red",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                <Icon
                  name={
                    feedbackMessage.startsWith("Correct")
                      ? "check-circle"
                      : "times-circle"
                  }
                  size={30}
                  color={
                    feedbackMessage.startsWith("Correct") ? "green" : "red"
                  }
                />
                {"\n"}
                {feedbackMessage}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}

      {showScorePopup && (
        <Modal
          transparent={true}
          visible={showScorePopup}
          animationType="slide"
          onRequestClose={() => setShowScorePopup(false)}
        >
          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackBox}>
              <Text style={{ fontSize: 20 }}>Your Score: {score}/10</Text>
              <TouchableOpacity onPress={resetQuiz}>
                <Text style={styles.closeButton}>Close and Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackButtonPress}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f0fe",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    marginTop: "-50%",
  },
  clock: { marginTop: 10 },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  dropdown: {
    width: 120,
    marginHorizontal: 10,
  },
  separator: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3498db",
    marginHorizontal: 10,
  },
  submitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackBox: {
    width: 250,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    color: "#3498db",
    marginTop: 15,
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default TimeQuizScreen;
