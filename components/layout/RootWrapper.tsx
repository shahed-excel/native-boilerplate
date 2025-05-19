import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const RootWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {children}
      </SafeAreaView>
    </View>
  );
};

export default RootWrapper;
