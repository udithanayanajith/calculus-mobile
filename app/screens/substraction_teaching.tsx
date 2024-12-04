import { StatusBar } from "expo-status-bar";
import { ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Substartion_Teaching_Screen() {
  const videoRef = React.useRef<Video>(null);
  const [status, setStatus] = React.useState({ isLooping: false });
  const [isPlay, setIsPlay] = useState(false);

  const handleBackButtonPress = () => {
    router.push("/screens/math_operations");
  };

  const togglePlay = () => {
    if (isPlay) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlay(!isPlay);
  };

  const toggleLooping = () => {
    videoRef.current?.setIsLoopingAsync(!status.isLooping);
    setStatus((prevStatus) => ({
      ...prevStatus,
      isLooping: !prevStatus.isLooping,
    }));
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.coverImg}
        source={require("../../assets/images/sub.png")}
        resizeMode={ResizeMode.CONTAIN}
      />
      <Video
        ref={videoRef} // Reference for controlling the video
        style={styles.video}
        source={require("../../assets/videos/subtraction.mp4")} // Ensure this path is correct
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={status.isLooping}
        onPlaybackStatusUpdate={(playbackStatus) =>
          setStatus(playbackStatus as any)
        } // Update status
      />
      <View style={styles.buttons}>
        <Icon
          name={isPlay ? "pause-circle" : "play-circle"}
          size={60} // Increase icon size
          color="#007BFF" // Add a color for better visibility
          onPress={togglePlay}
        />
        <Icon
          name="repeat"
          size={60} // Increase icon size
          color={status.isLooping ? "#28a745" : "#6c757d"} // Change color based on looping status
          onPress={toggleLooping}
        />
      </View>
      <StatusBar style="auto" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackButtonPress}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: 300, // Adjust to your preferred size
    backgroundColor: "#000",
    marginTop: "-5%",
  },
  backButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: "90%",
    alignItems: "center",
  },
  buttons: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  coverImg: {
    alignSelf: "center",
    width: "80%", // Full width of the container
    height: "30%", // Allow height to adjust based on aspect ratio
    aspectRatio: 16 / 9, // Maintain aspect ratio (adjust this based on your image dimensions)
    marginBottom: 2,
    marginTop: "-20%", // Add some spacing from the video
  },
});
