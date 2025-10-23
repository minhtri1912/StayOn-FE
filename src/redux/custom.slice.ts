import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  item: string;
}

const initialState: AuthState = {
  item: ''
};

const customSlice = createSlice({
  name: 'custom',
  initialState,
  reducers: {
    updateCustom: (state, action) => {
      state.item = action.payload;
    }
  }
});

export const { updateCustom } = customSlice.actions;
const customReducer = customSlice.reducer;
export default customReducer;
