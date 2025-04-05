import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  createOrder,
  cancelOrder,
} from "../api";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch user data",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfileData",
  async (profile, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(profile);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update profile",
      );
    }
  },
);

export const addUserAddress = createAsyncThunk(
  "user/addUserAddress",
  async (address, { rejectWithValue }) => {
    try {
      const response = await addAddress(address);
      return response.data; // Expecting the new address object with _id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to add address",
      );
    }
  },
);

export const updateUserAddress = createAsyncThunk(
  "user/updateUserAddress",
  async ({ id, address }, { rejectWithValue }) => {
    try {
      const response = await updateAddress(id, address);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update address",
      );
    }
  },
);

export const deleteUserAddress = createAsyncThunk(
  "user/deleteUserAddress",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAddress(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to delete address",
      );
    }
  },
);
export const createUserOrder = createAsyncThunk(
  "user/createUserOrder",
  async (order, { rejectWithValue }) => {
    try {
      const response = await createOrder(order);
      return response.data; // Expecting the order object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create order",
      );
    }
  },
);

export const cancelUserOrder = createAsyncThunk(
  "user/cancelUserOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await cancelOrder(id); // Ensure cancelOrder is imported from api.js
      return response.data.order; // Expecting the updated order object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to cancel order",
      );
    }
  },
);
const initialState = {
  profile: null,
  addresses: [],
  orders: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
        state.addresses = action.payload.addresses;
        state.orders = action.payload.orders;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload); // Add the new address to the array
        state.loading = false;
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (addr) => addr._id === action.payload._id,
        );
        if (index !== -1) state.addresses[index] = action.payload;
        state.loading = false;
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (addr) => addr._id !== action.payload,
        );
        state.loading = false;
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUserOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createUserOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelUserOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelUserOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(cancelUserOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
