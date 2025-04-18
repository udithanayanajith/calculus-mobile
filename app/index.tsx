import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { FIREBASE_AUTH } from "./customFiles/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setAuthState } from "./customFiles/authUtils";
import { ResizeMode } from "expo-av";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        await setAuthState(true);
        router.push("/screens/home");
      }
    } catch (error: any) {
      Alert.alert("Error", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/smart_answers.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          style={styles.coverImg}
          source={require("../assets/images/logo.png")}
          resizeMode={ResizeMode.CONTAIN}
        />
        <Text style={styles.heading}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.footer}>
          Don't have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/screens/signUp")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(224, 232, 249, 0.7)",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  coverImg: {
    alignSelf: "center",
    width: "80%",
    height: "30%",
    aspectRatio: 16 / 9,
    marginBottom: 2,
  },

  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#A0AEC0",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    color: "#2C3E50",
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    color: "#718096",
    fontSize: 14,
    margin: 30,
    padding: 5,
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  link: {
    color: "#4A90E2",
    textDecorationLine: "underline",
  },
});
