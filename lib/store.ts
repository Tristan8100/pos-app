import { configureStore } from '@reduxjs/toolkit';
import categorySlice from '@/modules/category/feature/store';
import discountSlice from '@/modules/discount/feature/store';
import ordersSlice from '@/modules/orders/feature/store';

export const store = configureStore({
  reducer: {
    category: categorySlice,
    discount: discountSlice,
    orders: ordersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;