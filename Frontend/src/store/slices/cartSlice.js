import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload; // Expecting { _id, name, price, image, ... }
      const existingItem = state.items.find((item) => item.id === product._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: product._id, // Use _id from backend as the identifier
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
      }
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
