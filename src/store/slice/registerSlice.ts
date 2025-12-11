import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegisteredUser {
  name: string;
  email: string;
  password: string;
}

interface RegisterState {
  registeredUsers: RegisteredUser[];
}

const initialState: RegisterState = {
  registeredUsers: [],    
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    saveUser: (state, action: PayloadAction<RegisteredUser>) => {
      state.registeredUsers.push(action.payload);
    },
  },
});

export const { saveUser } = registerSlice.actions;
export default registerSlice.reducer;
