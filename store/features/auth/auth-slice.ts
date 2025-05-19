import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { API } from '../API/API';
const initialState = {
  user: {},
  isLoggedIn: false,
  token: '',
  employee: {},
  accessToken: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the entire formData

    loginState(state, action) {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = {};
      state.isLoggedIn = false;
      state.token = '';
      AsyncStorage.removeItem('access-token');
      AsyncStorage.removeItem('refresh-token');
    },
  },
});

// Export actions
export const { loginState, logout } = authSlice.actions;

export const currentUser = (state: any) => state.auth.user;

export default authSlice;
