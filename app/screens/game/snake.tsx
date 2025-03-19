import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { AntDesign as AntIcon } from "@expo/vector-icons";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

const BLOCK_SIZE = 20;
const FOOD_BLOCK_SIZE = 30;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const INITIAL_FOOD_COUNT = 3;

const snakeInitial = () => [{ x: 5, y: 5 }];

const snakeHeadImage = require("../../../assets/images/snakeHead.png");

const newSnake = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
];
const newFood = [
  { x: 2, y: 3 },
  { x: 4, y: 5 },
];
const getRandomFoodPosition = (
  snake: { x: number; y: number }[],
  food: { x: number; y: number }[]
) => {
  const MIN_DISTANCE = 5;
  if (!Array.isArray(snake) || !Array.isArray(food)) {
    throw new Error("The snake and food parameters must be arrays.");
  }

  let position;
  let overlap;

  do {
    overlap = false;
    // Generate a new random position for food
    position = {
      x: Math.floor(Math.random() * ((GAME_WIDTH - 100) / BLOCK_SIZE)),
      y: Math.floor(Math.random() * ((GAME_HEIGHT - 100) / BLOCK_SIZE)),
    };

    // Check if the new position overlaps with any segment of the snake
    for (const segment of snake) {
      const distanceX = Math.abs(segment.x - position.x);
      const distanceY = Math.abs(segment.y - position.y);
      if (distanceX < MIN_DISTANCE && distanceY < MIN_DISTANCE) {
        overlap = true;
        break;
      }
    }

    // Check if the new position overlaps with any existing food
    if (!overlap) {
      for (const existingFood of food) {
        const distanceX = Math.abs(existingFood.x - position.x);
        const distanceY = Math.abs(existingFood.y - position.y);
        if (distanceX < MIN_DISTANCE && distanceY < MIN_DISTANCE) {
          overlap = true;
          break;
        }
      }
    }
  } while (overlap);

  return position;
};
const getColor = (index: number) => {
  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];
  return colors[index % colors.length];
};

const Snake = () => {
  const [snake, setSnake] = useState(() => snakeInitial());

  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState(() =>
    Array.from({ length: INITIAL_FOOD_COUNT }, () =>
      getRandomFoodPosition(snake, newFood)
    )
  );
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ score: 0, highest: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [problem, setProblem] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState();
  const [allAnswers, setAllAnswers] = useState<number[]>([]);

  const timerRef = useRef<NodeJS.Timer | number | undefined>(undefined);

  const timerId = useRef<NodeJS.Timer>();

  useEffect(() => {
    timerRef.current = setInterval(() => {}, 2000);

    return () => {
      if (timerRef.current !== undefined) {
        if (typeof timerRef.current === "number") {
          clearInterval(timerRef.current);
        }
      }
    };
  }, []);

  useEffect(() => {
    generateRandomMathProblem();
  }, []);

  const moveInterval = () => {
    if (isPaused) return;

    const head = { ...snake[0] };

    switch (direction) {
      case "RIGHT":
        head.x += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "UP":
        head.y -= 1;
        break;
    }

    const xBy = GAME_WIDTH / BLOCK_SIZE;
    const yBy = GAME_HEIGHT / BLOCK_SIZE;

    if (
      head.x < 0 ||
      head.x >= xBy ||
      head.y < 0 ||
      head.y >= yBy ||
      (snake &&
        snake.some((segment) => segment.x === head.x && segment.y === head.y))
    ) {
      handleGameOver();
      return;
    } else {
      const newSnake = [...snake];
      newSnake.unshift(head);

      const eatenFoodIndex = food.findIndex((f) => {
        return (
          head.x * BLOCK_SIZE < f.x * BLOCK_SIZE + 50 &&
          head.x * BLOCK_SIZE + BLOCK_SIZE > f.x * BLOCK_SIZE &&
          head.y * BLOCK_SIZE < f.y * BLOCK_SIZE + 50 &&
          head.y * BLOCK_SIZE + BLOCK_SIZE > f.y * BLOCK_SIZE
        );
      });

      if (eatenFoodIndex >= 0) {
        const eatenValue = allAnswers[eatenFoodIndex];
        if (eatenValue == correctAnswer) {
          setScore((prev) => ({ ...prev, score: prev.score + 1 }));
          const newFood = [...food];
          newFood.splice(eatenFoodIndex, 1);
          newFood.push(getRandomFoodPosition(newSnake, newFood));
          setFood(newFood);
          generateRandomMathProblem();
        } else {
          handleGameOver();
        }
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    }
  };

  const handlePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleGameOver = () => {
    setGameOver(true);
    setIsPaused((prev) => !prev);
    if (score.score > score.highest) {
      setScore((prev) => ({ ...prev, highest: score.score }));
    }
  };

  const handleRestart = () => {
    generateRandomMathProblem();
    setSnake(snakeInitial());

    const initialFood = Array.from({ length: INITIAL_FOOD_COUNT }, () =>
      getRandomFoodPosition(newSnake, newFood)
    );

    setFood(initialFood);
    setDirection("RIGHT");
    setGameOver(false);
    setScore({ score: 0, highest: score.highest });
  };

  const changeDirection = (newDirection: React.SetStateAction<string>) => {
    if (
      (direction === "UP" && newDirection === "UP") ||
      (direction === "DOWN" && newDirection === "DOWN") ||
      (direction === "LEFT" && newDirection === "LEFT") ||
      (direction === "RIGHT" && newDirection === "RIGHT")
    ) {
      return;
    }
    setDirection(newDirection);
  };

  useEffect(() => {
    timerId.current = setInterval(moveInterval, 350);
    return () => clearInterval(timerId.current);
  }, [snake, direction, food, isPaused]);
  const handleGesture = (event: {
    nativeEvent: { translationX: any; translationY: any };
  }) => {
    const { translationX, translationY } = event.nativeEvent;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      changeDirection(translationX > 0 ? "RIGHT" : "LEFT");
    } else {
      changeDirection(translationY > 0 ? "DOWN" : "UP");
    }
  };

  const generateRandomMathProblem = () => {
    const MAX_RESULT = 500;
    const NUM_WRONG_ANSWERS = 2;

    const operations = [
      {
        symbol: "+",
        operation: (num1: any, num2: any) => num1 + num2,
        minNum: 0,
        maxNum: MAX_RESULT,
      },
      {
        symbol: "-",
        operation: (num1: number, num2: number) => num1 - num2,
        minNum: 0,
        maxNum: MAX_RESULT,
      },
      {
        symbol: "*",
        operation: (num1: number, num2: number) => num1 * num2,
        minNum: 0,
        maxNum: Math.floor(MAX_RESULT / 10),
      },
      {
        symbol: "/",
        operation: (num1: number, num2: number) => Math.floor(num1 / num2),
        minNum: 1,
        maxNum: MAX_RESULT,
      },
    ];

    let num1, num2, operation, correctAnswer;

    do {
      operation = operations[Math.floor(Math.random() * operations.length)];

      // Generate random integers
      num1 =
        Math.floor(Math.random() * (operation.maxNum - operation.minNum + 1)) +
        operation.minNum;

      if (operation.symbol === "/") {
        num2 =
          Math.floor(Math.random() * (num1 - operation.minNum + 1)) +
          operation.minNum;
      } else {
        num2 =
          Math.floor(
            Math.random() * (operation.maxNum - operation.minNum + 1)
          ) + operation.minNum;
      }

      correctAnswer = operation.operation(num1, num2);
    } while (
      correctAnswer < 0 ||
      correctAnswer > MAX_RESULT ||
      (operation.symbol === "/" && num2 === 0)
    );

    const wrongAnswers = new Set();
    while (wrongAnswers.size < NUM_WRONG_ANSWERS) {
      let wrongAnswer;
      do {
        wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
      } while (
        wrongAnswer === correctAnswer ||
        wrongAnswer < 0 ||
        wrongAnswer > MAX_RESULT
      );
      wrongAnswers.add(wrongAnswer);
    }

    const wrongAnswersArray = Array.from(wrongAnswers);
    wrongAnswersArray.push(correctAnswer);

    // Update state
    setProblem(`${num1} ${operation.symbol} ${num2} = ?`);
    setCorrectAnswer(correctAnswer);

    setAllAnswers(wrongAnswersArray as number[]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.scoreBar}>
          <View style={styles.scoreBox}>
            <Icon name="circle" size={10} color={"#00cc00"} />
            <Text style={styles.scoreText}>{score.score}</Text>
          </View>
          <View style={styles.scoreBox}>
            <AntIcon name="staro" color={"#ebd100"} size={15} />
            <Text style={styles.scoreText}>{score.highest}</Text>
          </View>
          <View>
            <Text style={styles.questionText}>{problem}</Text>
          </View>
        </View>
        <AntIcon
          onPress={handlePause}
          color={"#fff"}
          name={isPaused ? "caretright" : "pause"}
          size={25}
        />
      </View>
      <View style={styles.fullView}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={handleGesture}>
            <View style={styles.gameArea}>
              {snake.map((segment, i) =>
                i === 0 ? ( // Render snake head
                  <Image
                    key={i}
                    source={snakeHeadImage}
                    style={{
                      position: "absolute",
                      left: segment.x * BLOCK_SIZE,
                      top: segment.y * BLOCK_SIZE,
                      width: BLOCK_SIZE + 20,
                      height: BLOCK_SIZE + 20,
                      marginLeft: -11.5,
                      zIndex: 1,
                    }}
                  />
                ) : (
                  // Render snake body segments
                  <Icon
                    key={i}
                    name="square"
                    size={BLOCK_SIZE}
                    color={getColor(i)}
                    style={{
                      position: "absolute",
                      left: segment.x * BLOCK_SIZE,
                      top: segment.y * BLOCK_SIZE,
                    }}
                  />
                )
              )}
              {food.map((f, i) => (
                <View
                  key={i}
                  style={[
                    styles.food,
                    {
                      position: "absolute",
                      left: f.x * BLOCK_SIZE,
                      top: f.y * BLOCK_SIZE,
                    },
                  ]}
                >
                  <Text
                    style={{
                      position: "absolute",
                      top: FOOD_BLOCK_SIZE / 2 - 21,
                      left: FOOD_BLOCK_SIZE / 2 - 17,
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 30,
                    }}
                  >
                    {allAnswers[i]} {/* Use the value from allAnswers array */}
                  </Text>
                </View>
              ))}
            </View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </View>
      {gameOver && (
        <View style={styles.overlayGameOver}>
          <View style={styles.overlayCenterGameOver}>
            <View>
              <Text style={styles.overlayText}>Game Over</Text>
            </View>
            <View style={styles.scoreCenter}>
              <View style={styles.finishScoreBox}>
                <Text style={styles.overlyScoreText}>Your score</Text>
                <View style={styles.overlyPointsGameover}>
                  <Icon name="circle" size={13} color={"#00cc00"} />
                  <Text style={styles.overlyScoreText}>{score.score}</Text>
                </View>
              </View>
              <View style={styles.finishScoreBox}>
                <Text style={styles.overlyScoreText}>Top Score</Text>
                <View style={styles.overlyPoints}>
                  <AntIcon name="staro" color={"#ebd100"} size={15} />
                  <Text style={styles.overlyScoreText}>{score.highest}</Text>
                </View>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.button} onPress={handleRestart}>
                <Text style={styles.buttonText}>Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlyScoreText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22,
  },
  overlyPoints: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  overlyPointsGameover: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  finishScoreBox: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },
  overlayCenterGameOver: {
    backgroundColor: "#21003b",
    paddingHorizontal: 80,
    paddingVertical: 80,
    borderRadius: 12,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayGameOver: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
  scoreBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  scoreText: {
    color: "#fff",
    marginLeft: 5,
  },
  questionText: { color: "#fff", marginLeft: 50, fontSize: 30 },
  fullView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  gameArea: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    position: "relative",
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#fff",
  },
  directionButton: {
    backgroundColor: "#444",
    padding: 15,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayCenter: {
    alignItems: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 30,
    marginBottom: 20,
  },
  scoreCenter: {
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#ebd100",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  food: {
    width: 65,
    height: 40,
    position: "absolute",
    backgroundColor: "red",
    borderWidth: 2,
    borderColor: "yellow", // Border color
    borderRadius: 4,
  },
});

export default Snake;
