import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // latest orders for the session
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      // Add newest order to the front
      state.items.unshift(action.payload);

      // Keep only latest 3 orders
      if (state.items.length > 3) {
        state.items = state.items.slice(0, 3);
      }
    },
    clearOrders: (state) => {
      state.items = [];
    },
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
