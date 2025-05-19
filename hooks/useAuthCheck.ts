import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetMeQuery } from '~/store/features/auth/auth.api';

export function useAuthCheck() {
  const [tokenExists, setTokenExists] = useState<boolean | null>(null);

  // Check if token exists in AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('access-token').then((token) => {
      setTokenExists(!!token);
    });
  }, []);

  // Trigger RTK query only if token exists
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useGetMeQuery(undefined, {
    skip: tokenExists === false || tokenExists === null,
  });

  // You can extend this to handle refreshing token, logout on error, etc.

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
    tokenExists,
    refetch,
  };
}
