import { configureStore } from '@reduxjs/toolkit';
//import counterReducer from '@/features/counterSlice';
import categorySlice from '@/modules/category/feature/store';
import discountSlice from '@/modules/discount/feature/store';

export const store = configureStore({
  reducer: {
    category: categorySlice,
    discount: discountSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;