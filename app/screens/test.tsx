import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const RandomNumberVoiceRecorder = () => {
  const params = useGlobalSearchParams();
  const incomeMin = params.min ? Number(params.min) : null;
  const incomeMax = params.max ? Number(params.max) : null;

  const [min, setMin] = useState<number | null>(null);
  const [max, setMax] = useState<number | null>(null);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  useEffect(() => {
    if (incomeMin !== null && incomeMax !== null) {
      setMin(incomeMin);
      setMax(incomeMax);
    }
  }, [incomeMin, incomeMax]);

  const generateRandomNumber = () => {
    if (min !== null && max !== null) {
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      setRandomNumber(randomNum);
    } else {
      console.log("min or max is null. Cannot generate random numbers.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Random Number Generator</Text>
      {min !== null && max !== null ? (
        <>
          <Text>Min: {min}</Text>
          <Text>Max: {max}</Text>
          <Button
            title="Generate Random Number"
            onPress={generateRandomNumber}
          />
          {randomNumber !== null && <Text>Random Number: {randomNumber}</Text>}
        </>
      ) : (
        <Text>Invalid range for random number generation.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default RandomNumberVoiceRecorder;
