import { View } from 'react-native';
import React from 'react';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import RootWrapper from '~/components/layout/RootWrapper';
import { useAppSelector } from '~/store/hooks';
import { useRouter } from 'expo-router';
const MainPage = () => {
  const router = useRouter();
  const isLight = useAppSelector((state) => state.appConfig.isLight);

  const user = useAppSelector((state) => state.auth);

  console.log('user', user);

  return (
    <RootWrapper>
      <View className="flex-1 ">
        <Text className="">MainPage</Text>

        <Button size="lg" onPress={() => router.push('/sign-in')}>
          <Text className="">Test</Text>
        </Button>

        <ThemeToggle />
      </View>
    </RootWrapper>
  );
};

export default MainPage;
