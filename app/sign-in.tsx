import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { loginState } from '~/store/features/auth/auth-slice';
import { useLoginMutation } from '~/store/features/auth/auth.api';

const Login = () => {
  const router = useRouter();
  // * Shared value for the top image
  const topImage = useSharedValue(-230);

  // * Hokes
  const isLight = useSelector((state: any) => state.appConfig.isLight);
  const navigation = useNavigation();

  const segments = useSegments();

  // * Local State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const dispatch = useDispatch();

  // * API Call
  const [login, { isLoading }] = useLoginMutation();

  //  * Handle Login
  const handleLogin = () => {
    if (!email && !password) {
      setEmailError(true);
      setPasswordError(true);
      return;
    }
    if (!email) {
      setEmailError(true);
      return;
    }
    if (!password) {
      setPasswordError(true);
      return;
    }
    login({ email, password })
      .unwrap()
      .then((res) => {
        dispatch(
          loginState({
            user: {
              ...res?.data?.user,
              accessToken: res?.data?.accessToken,
            },
            token: res?.data?.accessToken,
          }),
        );
        AsyncStorage.setItem('access-token', res?.data?.accessToken);
        AsyncStorage.setItem('refresh-token', res?.data?.refreshToken);
        Toast.show({
          text1: 'Login Success',
          type: 'success',
        });
        router.replace('/');
      })
      .catch((err) => {
        console.log(err);
        Toast.show({
          text1: 'Login Failed',
          type: 'error',
        });
      });
  };

  // * Animated style for the top image
  const topImageHandler = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: topImage.value }],
    };
  });

  // * Disable gesture on iOS
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

  // * Animated the top image
  useEffect(() => {
    setTimeout(() => {
      topImage.value = withSpring(-20);
    }, 400);
  }, []);

  // * Check if email and password are valid
  useEffect(() => {
    if (email) {
      setEmailError(false);
    }
    if (password) {
      setPasswordError(false);
    }
  }, [email, password]);

  // * return JSX
  return (
    <View className="flex-1 items-center justify-end relative w-full bg-white dark:bg-black">
      <StatusBar
        style={isLight ? 'dark' : 'light'}
        backgroundColor={'transparent'}
      />
      <Animated.Image
        style={topImageHandler}
        source={require('~/assets/images/light.png')}
        className="absolute top-0 left-0 w-full h-[280px] object-contain"
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        resetScrollToCoords={{ x: 0, y: scrollY }}
        onScroll={(e) => {
          const { x, y } = e.nativeEvent.contentOffset;
          setScrollY(y);
        }}
      >
        <Animated.View entering={FadeInDown.delay(700)} className="flex-1">
          <View
            className="items-center flex-col gap-4 w-[300px]"
            style={{
              marginTop: 250,
            }}
          >
            <Image
              source={
                isLight
                  ? require('~/assets/images/logo.png')
                  : require('~/assets/images/logo-white.png')
              }
              style={{ height: wp(35), width: wp(35), objectFit: 'contain' }}
              className="object-contain"
            />

            <View className="w-full">
              <Input
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              {emailError && (
                <Text className="text-red-500 text-xs">Email is required</Text>
              )}
            </View>
            <View className="w-full">
              <Input
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
                keyboardType="default"
                secureTextEntry={true}
              />
              {passwordError && (
                <Text className="text-red-500 text-xs">
                  Password is required
                </Text>
              )}
            </View>

            <Button onPress={handleLogin} className="w-full">
              <Text className="text-white">Login</Text>
            </Button>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;
