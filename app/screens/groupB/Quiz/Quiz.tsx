import { FontAwesome } from "@expo/vector-icons";
import { router, useGlobalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
} from "react-native";

interface Question {
  question: string;
  options: number[];
  answer: number;
}

const generateQuestion = (operator: string | null): Question => {
  if (!operator) {
    throw new Error("Operator is required for generating questions");
  }

  let num1: number;
  let num2: number;
  let answer: number;

  switch (operator) {
    case "+":
      num1 = Math.floor(Math.random() * 501);
      num2 = Math.floor(Math.random() * 501);
      answer = num1 + num2;
      break;
    case "-":
      num2 = Math.floor(Math.random() * 501);
      answer = Math.floor(Math.random() * (num2 + 1));
      num1 = answer + num2;
      break;
    case "*":
      num1 = Math.floor(Math.random() * 32);
      num2 = Math.floor(Math.random() * 32);
      answer = num1 * num2;
      break;
    case "/":
      num2 = Math.floor(Math.random() * 501);
      if (num2 === 0) return generateQuestion(operator);
      answer = Math.floor(Math.random() * 501);
      num1 = answer * num2;
      break;
    default:
      throw new Error("Unknown operator");
  }

  const wrongAnswers: number[] = [];
  while (wrongAnswers.length < 3) {
    const wrongAnswer = answer + Math.floor(Math.random() * 20) + 1;
    if (wrongAnswer !== answer && !wrongAnswers.includes(wrongAnswer)) {
      wrongAnswers.push(wrongAnswer);
    }
  }

  const options = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
  return { question: `${num1} ${operator} ${num2} = ?`, options, answer };
};

const getQuizTitle = (operator: string | null): string => {
  switch (operator) {
    case "+":
      return "Addition Quiz";
    case "-":
      return "Subtraction Quiz";
    case "*":
      return "Multiplication Quiz";
    case "/":
      return "Division Quiz";
    default:
      return "Math Quiz";
  }
};

const Quiz: React.FC = () => {
  const params = useGlobalSearchParams();
  const incomingOperator = params.operator ? String(params.operator) : null;
  const [operator, setOperator] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (incomingOperator !== null) {
      setOperator(incomingOperator);
      const generatedQuestions = Array.from({ length: 10 }, () =>
        generateQuestion(incomingOperator)
      );
      setQuestions(generatedQuestions);
    }
  }, [incomingOperator]);

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex]?.answer) {
      setCorrectCount(correctCount + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setModalOpen(true);
      }
    }, 1000);
  };
  const accuracy = (correctCount / questions.length) * 100;
  let grade = "";
  let textColor = "#fff";
  if (accuracy >= 80) {
    grade = "Good";
    textColor = "green";
  } else if (accuracy >= 50) {
    grade = "Average";
    textColor = "orange";
  } else {
    grade = "Needs Improvement";
    textColor = "red";
  }

  const closeModal = () => {
    setModalOpen(false);
  };
  const restartQuiz = () => {
    if (!operator) return;
    const regeneratedQuestions = Array.from({ length: 10 }, () =>
      generateQuestion(operator)
    );
    setQuestions(regeneratedQuestions);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setModalOpen(false);
  };

  const handleHomeButtonPress = () => {
    router.push("/screens/groupB/math_quiz_groupB");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getQuizTitle(operator)}</Text>
      <Text style={styles.question}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>
      <Text style={styles.mathOperation}>
        {questions[currentQuestionIndex]?.question}
      </Text>
      <View style={styles.answerButton}>
        {questions[currentQuestionIndex]?.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedAnswer === option
                    ? option === questions[currentQuestionIndex]?.answer
                      ? "green"
                      : "red"
                    : "#007BFF",
              },
            ]}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal transparent={true} animationType="slide" visible={isModalOpen}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.resultText}>Results</Text>
            <Text style={styles.resultText}>
              You answered {correctCount} out of {questions.length} questions
              correctly!
            </Text>
            <Text style={[styles.gradeText, { color: textColor }]}>
              Grade: {grade}
            </Text>

            <View style={styles.iconContainer}>
              <FontAwesome.Button
                name="arrow-left"
                backgroundColor="#ddd"
                color="#333"
                onPress={handleHomeButtonPress}
              >
                Back
              </FontAwesome.Button>

              <FontAwesome.Button
                name="refresh"
                backgroundColor="#ddd"
                color="#333"
                onPress={restartQuiz}
              >
                Restart
              </FontAwesome.Button>
            </View>
          </View>
        </View>
      </Modal>

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
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: "-5%",
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
  },
  mathOperation: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  answerButton: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  homeButton: {
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
  homeButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  gradeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
});

export default Quiz;
