import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLogin: boolean;
  role: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  isLogin: false,
  role: null,
  userId: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<
        { role?: string | null; userId?: string | null } | undefined
      >
    ) {
      state.isLogin = true;
      if (action.payload) {
        state.role = action.payload.role || null;
        state.userId = action.payload.userId || null;
      }
    },
    logout(state) {
      state.isLogin = false;
      state.role = null;
      state.userId = null;
    },
    setRole(state, action: PayloadAction<string | null>) {
      state.role = action.payload;
    }
  }
});

export const { login, logout, setRole } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
