import '~/global.css';

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from '@react-navigation/native';
import { ErrorBoundary, Slot, Stack } from 'expo-router';
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

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    setAndroidNavigationBar(colorScheme);

    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppProvider>
        {/* <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="signIn" options={{ headerShown: false }} />
        </Stack> */}
        <Slot />
        <PortalHost />
      </AppProvider>
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
  const isLoading = false;
  const { isAuthenticated, isLoading: isAuthLoading, isError } = useAuthCheck();
  useEffect(() => {
    AsyncStorage.setItem('theme', colorScheme).then(() => {
      dispatch(setIsLight(colorScheme));
    });
  }, [colorScheme]);

  if (isLoading || isAuthLoading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      {children}
      <Toast />
    </ThemeProvider>
  );
};
