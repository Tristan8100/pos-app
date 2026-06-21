import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchCategories } from '../types/category.types';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    value: null
  } as { value: FetchCategories[] | null },
  reducers: {
    // increment: (state) => {
    //   state.value += 1;
    // },
    // addByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
    setCategoryValue : (state, action: PayloadAction<FetchCategories[]>) => {
      state.value = action.payload
    }
  },
});

export const { setCategoryValue } = categorySlice.actions;
export default categorySlice.reducer;