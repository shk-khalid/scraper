// src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  email: string;
  shopUrl: string;
  active: boolean;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  lastActivity: number;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  lastActivity: Date.now(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Now expects the full AuthUser shape
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.lastActivity = Date.now();
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.lastActivity = Date.now();
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.lastActivity = 0;
    },
  },
});

export const {
  setUser,
  setAccessToken,
  updateLastActivity,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
