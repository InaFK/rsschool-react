import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormData {
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  termsAccepted: boolean;
  picture: string;
  country: string;
}

interface FormState {
  uncontrolledFormData: FormData | null;
  hookFormData: FormData | null;
}

const initialState: FormState = {
  uncontrolledFormData: null,
  hookFormData: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setUncontrolledFormData(state, action: PayloadAction<FormData>) {
      state.uncontrolledFormData = action.payload;
    },
    setHookFormData(state, action: PayloadAction<FormData>) {
      state.hookFormData = action.payload;
    },
  },
});

export const { setUncontrolledFormData, setHookFormData } = formSlice.actions;
export default formSlice.reducer;
