declare module "react-native-analog-clock" {
  import { Component } from "react";

  interface AnalogClockProps {
    width?: number;
    height?: number;
    colorClock?: string;
    colorNumber?: string;
    colorCenter?: string;
    hour?: number;
    minutes?: number;
  }

  const AnalogClock: React.ComponentType<AnalogClockProps>;

  export default AnalogClock;
}
