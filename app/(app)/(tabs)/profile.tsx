import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const Profile = () => {
  return (
    <SafeAreaView>
      <View className="flex-1 items-center justify-center dark:bg-white">
        <Text className="dark:text-white">Profile</Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
