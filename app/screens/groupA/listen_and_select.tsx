import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import * as Speech from "expo-speech";
import { router, useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

const NumberQuizScreen: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<
    Array<{ correct: number; options: number[] }>
  >([]);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      Speech.stop();
      resetQuiz();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    generateQuestions();
  }, []);

  useEffect(() => {
    if (quizStarted && questions.length > 0) {
      speakNumber(questions[currentQuestion].correct);
    }
  }, [currentQuestion, questions, quizStarted]);

  const generateQuestions = () => {
    const generatedQuestions = Array.from({ length: 20 }, () => {
      const correct = Math.floor(Math.random() * 51);
      const options = new Set<number>([correct]);
      while (options.size < 4) {
        options.add(Math.floor(Math.random() * 51));
      }
      return {
        correct,
        options: Array.from(options).sort(() => Math.random() - 0.5),
      };
    });
    setQuestions(generatedQuestions);
  };

  const speakNumber = (number: number) => {
    if (quizStarted) {
      Speech.speak(`Select the number ${number}`, {
        rate: 0.95, 
        language: "en-US", 
        pitch: 1.0, 
      });
    }
  };

  const handleAnswer = (selected: number) => {
    if (!quizStarted) return;

    const isCorrect = selected === questions[currentQuestion].correct;
    setSelectedAnswer(selected);

    setTimeout(() => {
      setScore((prev) => ({
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        wrong: isCorrect ? prev.wrong : prev.wrong + 1,
      }));
      setSelectedAnswer(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizStarted(false);
        setShowScoreModal(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setScore({ correct: 0, wrong: 0 });
    setCurrentQuestion(0);
    setQuizStarted(false);
    setShowScoreModal(false);
    generateQuestions();
  };

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return "A";
    if (percentage >= 75) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 35) return "D";
    return "F";
  };

  const currentOptions = questions[currentQuestion]?.options || [];
  const correctAnswer = questions[currentQuestion]?.correct ?? -1;
  const totalQuestions = questions.length;
  const correctPercentage = Math.round((score.correct / totalQuestions) * 100);
  const grade = calculateGrade(correctPercentage);

  const handleBackButtonPress = () => {
    Speech.stop();
    resetQuiz();
    router.push("/screens/group_A_Home"); 
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Question {quizStarted ? currentQuestion + 1 : 0} of {questions.length}
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setQuizStarted((prev) => !prev)}
        >
          <Text style={styles.controlButtonText}>
            {quizStarted ? "Pause Quiz" : "Start Quiz"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => speakNumber(correctAnswer)}
          disabled={!quizStarted}
        >
          <Text style={styles.controlButtonText}>Repeat Sound</Text>
        </TouchableOpacity>
      </View>

      {!quizStarted && (
        <View style={styles.quizBox}>
          <Text style={styles.quizText}>Start the quiz to see options</Text>
        </View>
      )}

      {quizStarted && (
        <View style={styles.quizContainer}>
          <FlatList
            data={currentOptions}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedAnswer === item &&
                    item === correctAnswer &&
                    styles.correctOption,
                  selectedAnswer === item &&
                    item !== correctAnswer &&
                    styles.wrongOption,
                ]}
                onPress={() => handleAnswer(item)}
                disabled={selectedAnswer !== null}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <Modal visible={showScoreModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quiz Completed!</Text>
            <Text style={styles.modalScore}>
              Correct: {correctPercentage}%{`\n`}
              Grade: {grade}
            </Text>
            <TouchableOpacity onPress={resetQuiz}>
                         <Icon name="repeat" size={30} color="#4A5568" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    backgroundColor: "#F3F4F6",
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4A5568",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: "#7F1D1D",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: "40%",
  },
  controlButtonText: {
    color: "#F7FAFC",
    fontSize: 18,
    fontWeight: "bold",

    marginTop: 10,
  },
  quizBox: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    height: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  quizText: {
    fontSize: 20,
    color: "#718096",
  },
  quizContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 8,
  },
  option: {
    padding: 20, 
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: "100%",
  },
  optionText: {
    fontSize: 24,
    color: "#2D3748",
  },
  correctOption: {
    backgroundColor: "#38A169",
    borderColor: "#2F855A",
  },
  wrongOption: {
    backgroundColor: "#E53E3E",
    borderColor: "#C53030",
  },
  flatListContainer: {
    width: "80%",
    marginLeft: "10%",
    marginTop: "-3%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 40,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4A5568",
  },
  modalScore: {
    fontSize: 20,
    color: "#2D3748",
    marginVertical: 10,
    textAlign: "center",
  },
  backButton: {
    padding: 15,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
    width: "70%",
  },
  buttonText: {
    color: "#F7FAFC",
    fontSize: 18,
  },
});

export default NumberQuizScreen;
