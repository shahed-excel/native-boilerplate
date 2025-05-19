import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useAppDispatch } from '~/store/hooks';
import { setIsLight } from '~/store/features/appConfig/appConfig.slice';

import { useAuthCheck } from '~/hooks/useAuthCheck';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '~/components/splashScreen/SplashScreen';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Theme } from '@react-navigation/native';
import { NAV_THEME } from '~/lib/constants';
import { StatusBar } from 'expo-status-bar';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  const theme = isDarkColorScheme ? DARK_THEME : LIGHT_THEME;
  const dispatch = useAppDispatch();

  const { isAuthenticated, isLoading: isAuthLoading, isError } = useAuthCheck();

  // Persist theme to AsyncStorage + Redux store
  React.useEffect(() => {
    AsyncStorage.setItem('theme', colorScheme).then(() => {
      dispatch(setIsLight(colorScheme === 'light'));
    });
  }, [colorScheme, dispatch]);

  if (isAuthLoading) {
    return <SplashScreen />;
  }

  // Render auth stack if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider value={theme}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <Stack>
          {/* Your auth screens */}
          <Stack.Screen name="signIn" options={{ headerShown: false }} />
          {/* You can add signUp, forgot password etc */}
        </Stack>
        <Toast />
      </ThemeProvider>
    );
  }

  // Authenticated: render main app stack
  return (
    <ThemeProvider value={theme}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack>
        {/* Main app tabs or screens */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Other screens if needed */}
      </Stack>
      <Toast />
    </ThemeProvider>
  );
};
