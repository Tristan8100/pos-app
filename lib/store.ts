import { configureStore } from '@reduxjs/toolkit';
//import counterReducer from '@/features/counterSlice';
import categorySlice from '@/modules/category/feature/store';

export const store = configureStore({
  reducer: {
    category: categorySlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;