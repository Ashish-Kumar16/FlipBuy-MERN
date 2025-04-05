// src/store/slices/favoritesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFavorites, toggleFavorite, clearFavorites } from "../api";

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFavorites();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch favorites",
      );
    }
  },
);

export const toggleFavoriteItem = createAsyncThunk(
  "favorites/toggleFavoriteItem",
  async (product, { rejectWithValue }) => {
    try {
      const response = await toggleFavorite(product);
      return { productId: product.id, message: response.data.msg };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to toggle favorite",
      );
    }
  },
);


export const clearAllFavorites = createAsyncThunk(
  "favorites/clearAllFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearFavorites();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to clear favorites",
      );
    }
  },
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavoriteItem.fulfilled, (state, action) => {
        const { productId, message } = action.payload;
        if (message === "Added to favorites") {
          state.items.push({ id: productId });
        } else {
          state.items = state.items.filter((item) => item.id !== productId);
        }
      })
      .addCase(clearAllFavorites.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default favoritesSlice.reducer;
