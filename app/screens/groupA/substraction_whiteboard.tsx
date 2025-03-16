import { router } from "expo-router";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import Signature, { SignatureViewRef } from "react-native-signature-canvas";

const SubstractionQuizScreen: React.FC = () => {
  const additionMathQuizRef = useRef<SignatureViewRef>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswers] = useState<number[]>([]);
  const [incorrectAnswer, setIncorrectAnswers] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [signature, setSignature] = useState("");
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [grade, setGrade] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResultModalVisible, setIsResultModalVisible] =
    useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 21);
    const num2 = Math.floor(Math.random() * (num1 + 1));
    setQuestion(`${num1} - ${num2} = ?`);
    setAnswer(num1 - num2);
  };

  const handleSignatureSave = async (signatureDataUrl: string) => {
    setSignature(signatureDataUrl);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: signatureDataUrl,
        type: "image/jpg",
        name: "digit.jpg",
      });

      const response = await fetch("http://192.168.8.162:50000/digit/predict", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        const isAnswerCorrect = result.result == answer;
        setIsCorrect(isAnswerCorrect);

        if (isAnswerCorrect) {
          setCorrectAnswers((prev) => [...prev, result.result]);
        } else {
          setIncorrectAnswers((prev) => [...prev, result.result]);
        }

        setQuestionCount((prevCount) => prevCount + 1);

        if (questionCount + 1 >= 10) {
          calculateGrade();
          setIsQuizComplete(true);
          handleClear();
        } else {
          setIsResultModalVisible(true);
          handleClear();
          generateQuestion();
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    additionMathQuizRef.current?.clearSignature();
  };

  const handleBackButtonPress = () => {
    router.push("/screens/groupA/whiteboard_operation_check");
  };

  const calculateGrade = () => {
    const percentage = (correctAnswer.length / 10) * 100;
    if (percentage >= 90) {
      setGrade("Excellent");
    } else if (percentage >= 70) {
      setGrade("Good");
    } else if (percentage >= 50) {
      setGrade("Keep it up");
    } else {
      setGrade("Try Again");
    }
  };

  const handleCloseModal = () => {
    setIsQuizComplete(false);
    setQuestionCount(0);
    setCorrectAnswers([]);
    setIncorrectAnswers([]);
    setGrade("");
    generateQuestion();
  };

  const handleCloseResultModal = () => {
    setIsResultModalVisible(false);
  };

  React.useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write by your finger!</Text>
      <Text style={styles.question}>{question}</Text>
      <Signature
        ref={additionMathQuizRef}
        onOK={handleSignatureSave}
        descriptionText="Use your finger to draw"
        clearText="Clear"
        confirmText="Submit"
        penColor="black"
        dotSize={3}
        minWidth={3}
        maxWidth={5}
        style={styles.whiteboardSignature}
        backgroundColor="#FFFFFF"
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackButtonPress}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loaderText}>
            Wait, Dr. Calculus AI is processing your answer...
          </Text>
        </View>
      )}

      <Modal
        visible={isResultModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={[
                styles.modalTitle,
                { color: isCorrect ? "#4CAF50" : "#FF6347" },
              ]}
            >
              {isCorrect ? "Correct!" : "Incorrect!"}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseResultModal}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isQuizComplete} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quiz Results</Text>
            <Text style={styles.modalText}>
              Correct Answers: {correctAnswer.length}
            </Text>
            <Text style={styles.modalText}>
              Incorrect Answers: {incorrectAnswer.length}
            </Text>
            <Text style={styles.modalGrade}>{grade}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SubstractionQuizScreen;

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
    marginBottom: "-20%",
  },
  question: {
    fontSize: 60,
    fontWeight: "bold",
    marginTop: 100,
    textAlign: "center",
    color: "#4CAF50",
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
  whiteboardSignature: {
    width: "100%",
    height: "50%",
    borderWidth: 1,
    borderColor: "#C0C0C0",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  loaderContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -50 }],
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  loaderText: {
    fontSize: 16,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 10,
    color: "#555",
  },
  modalGrade: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6347",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
