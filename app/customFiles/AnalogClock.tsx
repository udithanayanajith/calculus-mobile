import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";

interface AnalogClockProps {
  time: string; // Expected format "HH:MM"
}

const AnalogClock: React.FC<AnalogClockProps> = ({ time }) => {
  const [hours, minutes] = time.split(":").map(Number);

  const adjustedHours = hours % 12;
  const hourAngle = (adjustedHours + minutes / 60) * 30; // 30 degrees per hour
  const minuteAngle = minutes * 6; // 6 degrees per minute

  const hourHandLength = 55;
  const minuteHandLength = 100;

  const hourX =
    125 + hourHandLength * Math.cos((hourAngle - 90) * (Math.PI / 180));
  const hourY =
    125 + hourHandLength * Math.sin((hourAngle - 90) * (Math.PI / 180));
  const minuteX =
    125 + minuteHandLength * Math.cos((minuteAngle - 90) * (Math.PI / 180));
  const minuteY =
    125 + minuteHandLength * Math.sin((minuteAngle - 90) * (Math.PI / 180));

  const renderNumbers = () => {
    const numbers = [];
    const radius = 90; // Distance from the center to the number positions
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180); // Convert degrees to radians
      const x = 125 + radius * Math.cos(angle); // Adjusted for boundary
      const y = 125 + radius * Math.sin(angle); // Adjusted for boundary

      numbers.push(
        <SvgText
          key={i}
          x={x}
          y={y}
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="#000"
        >
          {i}
        </SvgText>
      );
    }
    return numbers;
  };
  return (
    <View style={styles.clockContainer}>
      <Svg height="250" width="250">
        <Circle
          cx="125"
          cy="125"
          r="120"
          stroke="#3498db"
          strokeWidth="4"
          fill="#fff"
        />
        <Line
          x1="125"
          y1="125"
          x2={hourX}
          y2={hourY}
          stroke="#2980b9"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <Line
          x1="125"
          y1="125"
          x2={minuteX}
          y2={minuteY}
          stroke="#e74c3c"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {renderNumbers()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  clockContainer: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 100,
    borderColor: "#ccc",
    borderWidth: 2,
  },
});

export default AnalogClock;
