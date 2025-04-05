import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Grid,
  Chip,
  Breadcrumbs,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderConfirmation = () => {
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { order } = location.state || {
    order: {
      id: "ORD" + Math.floor(Math.random() * 10000000),
      date: new Date().toISOString(),
      status: "Processing",
      payment: {
        method: "Credit Card",
        cardLast4: "4242",
      },
      total: 299.99,
      items: [
        {
          id: 1,
          name: "Product 1",
          image: "https://source.unsplash.com/random/100x100/?product",
          price: 149.99,
          quantity: 1,
        },
        {
          id: 2,
          name: "Product 2",
          image: "https://source.unsplash.com/random/100x100/?electronics",
          price: 75.0,
          quantity: 2,
        },
      ],
      address: {
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        phone: "(123) 456-7890",
      },
    },
  };

  useEffect(() => {
    if (!location.state) {
      setSnackbar({
        open: true,
        message: "We've created a sample order confirmation for demonstration",
        severity: "info",
      });
    }
  }, [location.state]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Typography color="text.primary">Order Confirmation</Typography>
        </Breadcrumbs>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: 64, mb: 2 }}
          />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Order Placed Successfully!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6">Order Details</Typography>
            <Chip
              label={order.status}
              color={order.status === "Processing" ? "info" : "success"}
              variant="outlined"
            />
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Number
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {order.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Date
              </Typography>
              <Typography variant="body1">
                {new Date(order.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1">
                {order.payment.method}
                {order.payment.cardLast4 &&
                  ` (ending in ${order.payment.cardLast4})`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="primary">
                Rs.{order.total.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Items Ordered
          </Typography>

          <Box sx={{ mb: 3 }}>
            {order.items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  mb: 2,
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "background.default",
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: "contain",
                    borderRadius: 1,
                    bgcolor: "white",
                    mr: 2,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rs.{item.price.toFixed(2)} each
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Shipping Address
              </Typography>
              <Box
                sx={{ p: 2, borderRadius: 1, bgcolor: "background.default" }}
              >
                <Typography variant="body1">{order.address.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.address.street}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.zip}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {order.address.phone}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              <Box
                sx={{ p: 2, borderRadius: 1, bgcolor: "background.default" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">
                    Rs.{(order.total - 5).toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">Rs.5.00</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="primary"
                  >
                    Rs.{order.total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<HomeIcon />}
          >
            Continue Shopping
          </Button>
          <Button
            component={Link}
            to="/orders"
            variant="contained"
            color="primary"
            startIcon={<ShoppingBagIcon />}
          >
            View All Orders
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default OrderConfirmation;
