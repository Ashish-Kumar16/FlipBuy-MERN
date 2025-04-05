import axios from "axios";

const API_URL = "https://flipbuy-mern.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error: Could not connect to server");
    }
    return Promise.reject(error);
  },
);

// Auth endpoints
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const becomeVendor = async () => {
  try {
    const response = await api.post("/auth/become-vendor");
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Product endpoints
export const getProducts = async (search = "") => {
  try {
    const response = await api.get(`/products?search=${search}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addProduct = async (product) => {
  try {
    const response = await api.post("/products", product);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await api.put(`/products/${id}`, product);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Favorite endpoints
export const getFavorites = async () => {
  try {
    const response = await api.get("/favorites");
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const toggleFavorite = async (product) => {
  try {
    const response = await api.post("/favorites/toggle", { product });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const clearFavorites = async () => {
  try {
    const response = await api.delete("/favorites");
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User endpoints
export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/profile");
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const updateUserProfile = async (profile) => {
  try {
    const response = await api.put("/user/profile", profile);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addAddress = async (address) => {
  try {
    const response = await api.post("/user/address", address);
    return response;
  } catch (error) {
    throw error.response?.data || { error: error.message };
  }
};
export const updateAddress = async (id, address) => {
  try {
    const response = await api.put(`/user/address/${id}`, address);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await api.delete(`/user/address/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createOrder = async (order) => {
  try {
    const response = await api.post("/user/order", order);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const cancelOrder = async (id) => {
  try {
    const response = await api.put(`/user/order/${id}/cancel`);
    return response; 
  } catch (error) {
    throw error.response?.data || error.message;
  }
};