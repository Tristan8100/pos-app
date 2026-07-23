import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Discount } from '../types/discount.types';

const discountSlice = createSlice({
  name: 'discount',
  initialState: {
    value: null,
  } as { value: Discount[] | null },
  reducers: {
    setDiscountValue: (state, action: PayloadAction<Discount[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setDiscountValue } = discountSlice.actions;
export default discountSlice.reducer;
