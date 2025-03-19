import { StatusBar } from "expo-status-bar";
import { ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Addition_Teaching_Screen() {
  const videoRef = React.useRef<Video>(null);
  const [status, setStatus] = React.useState({ isLooping: false });
  const [isPlay, setIsPlay] = useState(false);

  const handleBackButtonPress = () => {
    router.push("/screens/groupA/math_operations");
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
        source={require("../../../assets/images/ad.png")}
        resizeMode={ResizeMode.CONTAIN}
      />
      <Video
        ref={videoRef}
        style={styles.video}
        source={require("../../../assets/videos/addition.mp4")}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={status.isLooping}
        onPlaybackStatusUpdate={(playbackStatus) =>
          setStatus(playbackStatus as any)
        }
      />
      <View style={styles.buttons}>
        <Icon
          name={isPlay ? "pause-circle" : "play-circle"}
          size={60}
          color="#007BFF"
          onPress={togglePlay}
        />
        <Icon
          name="repeat"
          size={60}
          color={status.isLooping ? "#28a745" : "#6c757d"}
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
  coverImg: {
    alignSelf: "center",
    width: "80%",
    height: "30%",
    aspectRatio: 16 / 9,
    marginBottom: 2,
    marginTop: "-40%",
  },

  video: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
    marginTop: "-5%",
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
});
