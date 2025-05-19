import { useColorScheme as useNativewindColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();

  useEffect(() => {
    AsyncStorage.getItem("theme").then((savedTheme) => {
      if (savedTheme === "light" || savedTheme === "dark") {
        setColorScheme(savedTheme);
      }
    });
  }, []);

  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
