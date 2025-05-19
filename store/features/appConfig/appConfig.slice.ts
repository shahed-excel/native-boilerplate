import { createSlice } from "@reduxjs/toolkit";

interface AppConfigState {
  mode: "light" | "dark";
  isLight: boolean;
}

const initialState: AppConfigState = {
  mode: "light",
  isLight: true,
};

const appConfigSlice = createSlice({
  name: "appConfig",
  initialState,
  reducers: {
    // * Set Is Light
    setIsLight(state, action) {
      state.mode = action.payload;
      state.isLight = action.payload === "light" ? true : false;
    },
  },
});

export const { setIsLight } = appConfigSlice.actions;
export default appConfigSlice;
