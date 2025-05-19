import { configureStore } from '@reduxjs/toolkit';
import appConfigReducer from './features/appConfig/appConfig.slice';
import { API } from './features/API/API';
import authSlice from './features/auth/auth-slice';
export const store = configureStore({
  reducer: {
    [API.reducerPath]: API.reducer,
    appConfig: appConfigReducer.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(API.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
