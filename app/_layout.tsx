import '~/global.css';

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from '@react-navigation/native';
import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, Text } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { Provider } from 'react-redux';
import { store } from '~/store/store';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '~/store/hooks';
import { setIsLight } from '~/store/features/appConfig/appConfig.slice';
import SplashScreen from '~/components/splashScreen/SplashScreen';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useAuthCheck } from '~/hooks/useAuthCheck';
import { ErrorBoundary } from '~/builder/ErrorBoundary';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

interface State {
  hasError: boolean;
  error: Error | null;
}

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    setAndroidNavigationBar(colorScheme);

    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, [colorScheme]);

  if (!isColorSchemeLoaded) {
    return null; // Or loading splash
  }

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppProvider>
          <PortalHost />
        </AppProvider>
      </ErrorBoundary>
    </Provider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDarkColorScheme, colorScheme } = useColorScheme();
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

  if (!isAuthenticated) {
    return (
      <ThemeProvider value={theme}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <Stack>
          {/* Your auth screens */}
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          {/* You can add signUp, forgot password etc */}
        </Stack>
        <Toast />
      </ThemeProvider>
    );
  }

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
