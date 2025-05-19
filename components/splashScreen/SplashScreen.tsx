import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { useWindowDimensions } from "react-native";
import { primaryColor } from "~/constants/colors";

const SplashScreen = () => {
  const { width, height } = useWindowDimensions();
  return (
    <View
      style={{ backgroundColor: primaryColor, flex: 1 }}
      className="justify-center items-center"
    >
      <LottieView
        source={require("~/assets/json/splash.json")}
        autoPlay
        loop
        style={{ height: height, width: width }}
      />
    </View>
  );
};

export default SplashScreen;
