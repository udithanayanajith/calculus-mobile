import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import questionsData from "../../customFiles/narrativeQuestions.json"; 
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";

const NarrativeQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>(""); 
  const [questions, setQuestions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const shuffledQuestions = shuffleArray(questionsData);
    setQuestions(shuffledQuestions);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    }
  }, [questions, currentQuestionIndex]);

  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selectedAnswer: string) => {
    let isCorrect = false;

    if (currentQuestion.type === "normal") {
      isCorrect =
        typeof currentQuestion.answer === "number"
          ? parseInt(userAnswer) === currentQuestion.answer
          : userAnswer === currentQuestion.answer;

      if (isCorrect) {
        setModalMessage("Correct! Your answer is correct.");
      } else {
        setModalMessage(
          `Incorrect. The correct answer is: ${currentQuestion.answer}`
        );
      }
    } else if (currentQuestion.type === "time") {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      if (isCorrect) {
        setModalMessage("Correct! Your answer is correct.");
      } else {
        setModalMessage(
          `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`
        );
      }
    }

    setAnswerCorrect(isCorrect);
    setShowModal(true);
    setUserAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setModalMessage("Quiz Completed! You have completed the quiz.");
      setShowModal(true);
      setCurrentQuestionIndex(0); 
    }
  };

  const restartQuiz = () => {
    const shuffledQuestions = shuffleArray(questionsData);
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setShowModal(false);
    setAnswerCorrect(null);
  };

  const speakQuestion = () => {
    if (currentQuestion && currentQuestion.story) {
      Speech.speak(currentQuestion.story);
    }
  };

  const handleHomeButtonPress = () => {
    router.push("/screens/group_B_Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listen And Answer</Text>
      {currentQuestion ? (
        <>
          <Text style={styles.story}>{currentQuestion.story}</Text>
          {currentQuestion.type === "normal" ? (
            <>
              <TextInput
                style={styles.input}
                value={userAnswer}
                placeholder="Enter your answer"
                onChangeText={setUserAnswer}
                keyboardType="numeric"
                maxLength={5}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  answerCorrect === null
                    ? {}
                    : answerCorrect
                    ? styles.correctButton
                    : styles.incorrectButton,
                ]}
                onPress={() => handleAnswer(userAnswer)}
              >
                <Text style={styles.buttonText}>Submit Answer</Text>
              </TouchableOpacity>
            </>
          ) : (
            currentQuestion.options.map((option: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answerCorrect === null
                    ? {}
                    : answerCorrect
                    ? styles.correctButton
                    : styles.incorrectButton,
                ]}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionButtonText}>{option}</Text>
              </TouchableOpacity>
            ))
          )}
          <FontAwesome.Button
            name="volume-up"
            backgroundColor="orange"
            onPress={speakQuestion}
            style={styles.speakerButton}
          >
            Speak Question
          </FontAwesome.Button>
        </>
      ) : (
        <Text>Loading questions...</Text>
      )}

      {/* Modal for showing alerts */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              answerCorrect === null
                ? {}
                : answerCorrect
                ? styles.modalCorrect
                : styles.modalIncorrect,
            ]}
          >
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fixed Home Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={handleHomeButtonPress}
      >
        <Text style={styles.homeButtonText}>Home</Text>
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
    justifyContent: "flex-start", 
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
  story: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 5,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: "80%",
  },
  correctButton: {
    backgroundColor: "#28A745", 
  },
  incorrectButton: {
    backgroundColor: "#DC3545",
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
  },
  optionButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "80%",
  },
  optionButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
  },
  speakerButton: {
    width: "80%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#F2F2F2", 
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalCorrect: {
    backgroundColor: "#D4EDDA",
  },
  modalIncorrect: {
    backgroundColor: "#F8D7DA",
  },
  modalMessage: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
  },
  homeButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: "0%",
    marginTop: "10%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: "90%",
    alignItems: "center",
  },
  homeButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NarrativeQuiz;
