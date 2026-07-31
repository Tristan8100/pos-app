import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiscountItem, SelectedOrderItem } from '../types/orders.types';

interface OrdersState {
  orders: SelectedOrderItem[];
  total: number;
  receivedPayment: number;
  givenChange: number;
  discountsItems: DiscountItem[];
}

const initialState: OrdersState = {
  orders: [],
  total: 0,
  receivedPayment: 0,
  givenChange: 0,
  discountsItems: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrdersValue: (state, action: PayloadAction<SelectedOrderItem[]>) => {
      state.orders = action.payload;
    },
    addOrderValue: (state, action: PayloadAction<SelectedOrderItem>) => {
      state.orders = [...state.orders, action.payload];
    },
    removeOrderAtIndex: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter((_, index) => index !== action.payload);
    },
    clearOrders: (state) => {
      state.orders = [];
    },
    setOrderTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setReceivedPaymentValue: (state, action: PayloadAction<number>) => {
      state.receivedPayment = action.payload;
    },
    setGivenChangeValue: (state, action: PayloadAction<number>) => {
      state.givenChange = action.payload;
    },
    setDiscountsItemsValue: (state, action: PayloadAction<DiscountItem[]>) => {
      state.discountsItems = action.payload;
    },
    addDiscountItem: (state, action: PayloadAction<DiscountItem>) => {
      state.discountsItems = [...state.discountsItems, action.payload];
    },
    resetOrderPayment: (state) => {
      state.receivedPayment = 0;
      state.givenChange = 0;
      state.total = 0;
    },
  },
});

export const {
  setOrdersValue,
  addOrderValue,
  removeOrderAtIndex,
  clearOrders,
  setOrderTotal,
  setReceivedPaymentValue,
  setGivenChangeValue,
  setDiscountsItemsValue,
  addDiscountItem,
  resetOrderPayment,
} = ordersSlice.actions;

export default ordersSlice.reducer;
