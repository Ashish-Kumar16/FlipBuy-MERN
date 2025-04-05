import { useState, createContext, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import UserProfile from "./pages/userProfile/userProfile.jsx";
import BecomeVendor from "./pages/BecomeVendor";
import VendorDashboard from "./pages/VendorDashboard";
import CategoryPage from "./pages/CategoryPage";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3772FF",
      light: "#6B9AFF",
      dark: "#0052cc",
      contrastText: "#fff",
    },
    secondary: {
      main: "#FF7E50",
      light: "#FFA883",
      dark: "#D45D26",
      contrastText: "#fff",
    },
    background: {
      default: "#F9FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A2138",
      secondary: "#646E88",
    },
    error: { main: "#F44336" },
    warning: { main: "#FFC107" },
    info: { main: "#2196F3" },
    success: { main: "#4CAF50" },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
});

// Initialize query client
const queryClient = new QueryClient();

// Create Snackbar Context
const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

const App = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <SnackbarContext.Provider value={showSnackbar}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmation />}
                />
                <Route path="/search" element={<Search />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/products" element={<Search />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/orders" element={<UserProfile />} />
                <Route path="/become-vendor" element={<BecomeVendor />} />
                <Route path="/vendor/:vendorName" element={<Search />} />
                <Route path="/vendors" element={<CategoryPage />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity={snackbarSeverity}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </BrowserRouter>
          </SnackbarContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
