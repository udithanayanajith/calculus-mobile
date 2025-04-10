import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import {
  router,
  useFocusEffect,
  useGlobalSearchParams,
  useNavigation,
} from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { baseUrl } from "@/app/customFiles/BASEURL";

const RandomNumberVoiceRecorder: React.FC = () => {
  const params = useGlobalSearchParams();
  const incomeMin = params.min ? Number(params.min) : null;
  const incomeMax = params.max ? Number(params.max) : null;
  const [min, setMin] = useState<number | null>(null);
  const [max, setMax] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [remainingNumbers, setRemainingNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRandomNumberRunning, setIsRandomNumberRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isfinished, setIsFinished] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState<{
    correct_count: number;
    total_numbers: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      stopRandomNumbersAndRecording();
      stopPlaying();
    }, [])
  );

  useEffect(() => {
    if (incomeMin !== null && incomeMax !== null) {
      setMin(incomeMin);
      setMax(incomeMax);
    }
  }, [incomeMin, incomeMax]);

  const generateRandomNumbers = () => {
    if (min === null || max === null) {
      return;
    }

    // Create an array of numbers from min to max (inclusive)
    const numbersArray = Array.from(
      { length: max - min + 1 },
      (_, i) => i + min
    );

    // Shuffle the array using a function that randomizes the order
    const shuffledNumbers = shuffleArray(numbersArray);
    setNumbers(shuffledNumbers);
    setRemainingNumbers(shuffledNumbers);
    setCount(0);
  };

  // Fisher-Yates shuffle algorithm to randomize the array order
  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  useEffect(() => {
    if (isRandomNumberRunning && remainingNumbers.length > 0 && !isPaused) {
      setCurrentNumber(remainingNumbers[0]);
      const interval = setInterval(() => {
        const nextNumber = remainingNumbers[0];
        setCurrentNumber(nextNumber);
        setRemainingNumbers((prev) => prev.slice(1));
        setCount((prev) => prev + 1);
        if (remainingNumbers.length === 1) {
          setTimeout(() => {
            stopRecording();
            setIsFinished(true);
            setIsRandomNumberRunning(false);
          }, 1500);
        }
      }, 2000);
      setIntervalId(interval);

      return () => clearInterval(interval);
    }
  }, [isRandomNumberRunning, remainingNumbers, isPaused]);

  const recordingOptions = {
    android: {
      extension: ".m4a",
      outputFormat: 2,
      audioEncoder: 3,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".m4a",
      outputFormat: "mpeg4aac",
      audioQuality: 127,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {},
  };

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert("Permission to access microphone is required!");
        return;
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();

      recordingRef.current = newRecording;
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        setRecordingUri(uri);
        setIsRecording(false);
        recordingRef.current = null;
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };
  const playRecording = async () => {
    if (recordingUri) {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recordingUri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
      } else {
        await sound.playAsync();
      }
      setIsPlaying(true);
    }
  };

  const stopPlaying = async () => {
    if (isPlaying && sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && status.didJustFinish) {
      setIsPlaying(false);
    }
  };

  const handleStartClick = async () => {
    generateRandomNumbers();
    setIsRandomNumberRunning(true);
    setIsPaused(false);
    await startRecording();
  };

  const handlePauseClick = async () => {
    if (!isPaused) {
      setIsPaused(true);
      if (recordingRef.current) {
        await recordingRef.current.pauseAsync();
      }
    } else {
      setIsPaused(false);
      if (recordingRef.current) {
        await recordingRef.current.startAsync();
      }
    }
  };

  const handleRestartClick = async () => {
    stopRandomNumbersAndRecording();
    generateRandomNumbers();
    setCurrentNumber(null);
    setIsRandomNumberRunning(false);
    setRecordingUri(null);
  };

  const stopRandomNumbersAndRecording = () => {
    setIsRandomNumberRunning(false);
    if (intervalId) clearInterval(intervalId);
    if (recordingRef.current) {
      stopRecording();
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      setIsPlaying(false);
      stopRandomNumbersAndRecording();
      stopPlaying();
    });

    return unsubscribe;
  }, [navigation, stopRandomNumbersAndRecording, stopPlaying]);

  const togglePlayStop = () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      playRecording();
    }
  };

  const handleHomeButtonPress = () => {
    if (recordingRef.current) {
      stopRecording().then(() => {
        setIsPlaying(false);
        stopRandomNumbersAndRecording();
        stopPlaying();
        router.push("/screens/groupA/record_your_counting");
      });
    } else {
      setIsPlaying(false);
      stopRandomNumbersAndRecording();
      stopPlaying();
      router.push("/screens/groupA/record_your_counting");
    }
  };
  const sendToCheck = async () => {
    if (!recordingUri) {
      Alert.alert("No recording available");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: recordingUri,
        name: "recording.m4a",
        type: "audio/m4a",
      });
      formData.append("numbers", numbers.join(","));
      const response = await fetch(`${baseUrl}/transcribe`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      setResult({
        correct_count: data.correct_count,
        total_numbers: data.total_numbers,
      });
      setModalVisible(true);
    } catch (error) {
      console.error("Error sending data:", error);
      Alert.alert("Error", "Failed to send data to the server");
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePercentage = () => {
    if (!result) return 0;
    return (result.correct_count / result.total_numbers) * 100;
  };

  const getGrade = () => {
    const percentage = calculatePercentage();
    if (percentage >= 80) return "Good";
    if (percentage >= 50) return "Average";
    return "Need to Improve";
  };

  const getModalColor = () => {
    const grade = getGrade();
    switch (grade) {
      case "Good":
        return "#4CAF50"; // Green
      case "Average":
        return "#FFC107"; // Yellow
      case "Need to Improve":
        return "#F44336"; // Red
      default:
        return "#FFFFFF"; // White
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Random Number Recorder</Text>
      <Text style={styles.footer}>
        Random numbers will be displayed every 3 seconds
      </Text>
      <Text style={styles.numberDisplay}>{currentNumber}</Text>
      <Text style={styles.countDisplay}>Numbers shown: {count}</Text>

      <View style={styles.buttonContainer}>
        {!isRandomNumberRunning && !isRecording && (
          <TouchableOpacity
            style={[styles.button, isfinished ? styles.selectedButton : null]}
            onPress={handleStartClick}
          >
            <Icon
              name={isfinished ? "refresh" : "play"}
              size={50}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        {isRandomNumberRunning && (
          <TouchableOpacity
            style={[styles.button, isPaused ? styles.selectedButton : null]}
            onPress={handlePauseClick}
          >
            <Icon
              name={isPaused ? "play-circle" : "pause-circle"}
              size={50}
              color="#fff"
            />
          </TouchableOpacity>
        )}
        {recordingUri && !isRandomNumberRunning && (
          <TouchableOpacity
            style={[styles.button, isPlaying ? styles.selectedButton : null]}
            onPress={togglePlayStop}
          >
            <Icon
              name={isPlaying ? "stop-circle" : "play-circle"}
              size={50}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        {recordingUri && !isRandomNumberRunning && (
          <TouchableOpacity style={styles.button} onPress={sendToCheck}>
            <Icon name="check" size={50} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Loader */}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loaderText}>
            Your answers are being checked by Calculus AI. Please wait...
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleHomeButtonPress}
      >
        <Text style={styles.buttonText}>Menu</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, { backgroundColor: getModalColor() }]}
          >
            <Text style={styles.modalText}>
              Correctly Spoken Numbers: {result?.correct_count}
            </Text>
            <Text style={styles.modalText}>
              Total Numbers: {result?.total_numbers}
            </Text>
            <Text style={styles.modalText}>
              Grade: {getGrade()} ({calculatePercentage().toFixed(2)}%)
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 80,
    color: "#ff6347",
    textTransform: "uppercase",
    textAlign: "center",
  },
  numberDisplay: {
    fontSize: 100,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
    color: "#4caf50",
    borderWidth: 2,
    borderColor: "#4caf50",
    borderRadius: 10,
    padding: 10,
  },
  countDisplay: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: -5,
    color: "#333",
    fontStyle: "italic",
  },
  footer: {
    marginTop: -50,
    fontSize: 16,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 80,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  logoutButton: {
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
    color: "#fff",
    fontWeight: "bold",
  },
  selectedButton: {
    backgroundColor: "#005cbf",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#000000",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  textStyle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RandomNumberVoiceRecorder;
