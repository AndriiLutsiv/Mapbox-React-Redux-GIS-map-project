import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenState {
  value: string;
}

const initialState: TokenState = {
  value: localStorage.getItem('APP_TOKEN') || '', 
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
      localStorage.setItem('APP_TOKEN', action.payload);
    },
    clearToken: (state) => {
      state.value = '';
      localStorage.removeItem('APP_TOKEN');
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;

export default tokenSlice.reducer;
