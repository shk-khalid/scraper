// src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userEmail: string | null;
  lastActivity: number;
}

const initialState: AuthState = {
  userEmail: null,
  lastActivity: Date.now(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string }>) => {
      state.userEmail = action.payload.email;
      state.lastActivity = Date.now();
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    logout: (state) => {
      state.userEmail = null;
      state.lastActivity = 0;
    },
  },
});

export const { setUser, updateLastActivity, logout } = authSlice.actions;

export default authSlice.reducer;
