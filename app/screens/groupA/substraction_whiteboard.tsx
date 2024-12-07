import { router } from "expo-router";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import Signature, { SignatureViewRef } from "react-native-signature-canvas";

const SubstractionQuizScreen: React.FC = () => {
  const additionMathQuizRef = useRef<SignatureViewRef>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswers] = useState<number[]>([]); // Array to store correct answers
  const [incorrectAnswer, setIncorrectAnswers] = useState<number[]>([]); // Array to store incorrect answers
  const [questionCount, setQuestionCount] = useState<number>(0); // To track number of answered questions
  const [signature, setSignature] = useState(""); // Store signature data
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false); // To control modal visibility
  const [grade, setGrade] = useState<string>(""); // To store the final grade

  // Function to generate a random addition question where the sum does not exceed 20
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 21); // Random number between 0 and 20
    const num2 = Math.floor(Math.random() * (num1 + 1)); // Random number between 0 and num1
    setQuestion(`${num1} - ${num2} = ?`);
    setAnswer(num1 - num2);
  };

  const handleSignatureSave = async (
    signatureDataUrl: React.SetStateAction<string>
  ) => {
    setSignature(signatureDataUrl);

    try {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append("image", {
        uri: signatureDataUrl, // The 'signatureDataUrl' is a base64 URL
        type: "image/jpg", // Set the appropriate MIME type
        name: "signature.jpg", // Name of the file
      });

      // Send the FormData object to the API
      const response = await fetch(
        "http://192.168.8.162:500/deaf/digit/predict",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct header for form data
          },
        }
      );

      // Handle the response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("Result", result.result);
        console.log("Percentage", result.percentage);

        // Update the correct or incorrect answer counts
        if (result.result == answer) {
          setCorrectAnswers((prev) => [...prev, result.result]);
        } else {
          setIncorrectAnswers((prev) => [...prev, result.result]);
        }

        // Increase the question count
        setQuestionCount((prevCount) => prevCount + 1);

        // Check if quiz is complete (10 questions answered)
        if (questionCount + 1 >= 10) {
          calculateGrade();
          setIsQuizComplete(true);
          handleClear();
        } else {
          handleClear();
          generateQuestion();
        }
      } else {
        handleClear();
        generateQuestion();
      }
    } catch (error) {
      console.error("Error sending signature to API:", error);
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
    setIsQuizComplete(false); // Close the modal
    setQuestionCount(0); // Reset question count
    setCorrectAnswers([]); // Reset correct answers
    setIncorrectAnswers([]); // Reset incorrect answers
    setGrade(""); // Reset grade
    generateQuestion(); // Start a new quiz
  };

  // Start by generating the first question
  React.useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write by your fingure!</Text>
      <Text style={styles.question}>{question}</Text>
      {/* style={styles.whiteboardSignature}backgroundColor="#FFFFFF" */}
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

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackButtonPress}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      {/* Modal for quiz result */}
      <Modal
        visible={isQuizComplete}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
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
    backgroundColor: "#e8f0fe", // Light background color for the quiz
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
    color: "#4CAF50", // Green color for positive energy
  },
  backButton: {
    backgroundColor: "#FF4500", // Orange color for visibility
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginTop: 30,
    marginBottom: 20,
  },
  whiteboardSignature: {
    width: "100%",
    height: "50%", // Reduce the height to shrink the whiteboard
    borderWidth: 1,
    borderColor: "#C0C0C0",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden", // Ensure no overflow
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
    color: "#4CAF50", // Green color for the title
  },
  modalText: {
    fontSize: 20,
    marginBottom: 10,
    color: "#555",
  },
  modalGrade: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6347", // Red color for grade display
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#FF4500", // Orange color for the button
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
