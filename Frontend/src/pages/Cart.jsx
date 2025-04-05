import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  IconButton,
  Divider,
  TextField,
  Card,
  CardContent,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";

const ProductImage = styled("img")(({ theme }) => ({
  width: 80,
  height: 80,
  objectFit: "contain",
  backgroundColor: "#f5f5f5",
  borderRadius: theme.shape.borderRadius,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  verticalAlign: "middle",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleQuantityChange = (item, amount) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    setSnackbarMessage("Item removed from cart");
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  const confirmRemoveItem = (id) => {
    setItemToRemove(id);
    setDialogOpen(true);
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // For demo purposes, we'll just show an error
    setCouponError("Invalid coupon code");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    navigate("/checkout");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Typography color="text.primary">Shopping Cart</Typography>
        </Breadcrumbs>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Your Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              mt: 4,
            }}
          >
            <ShoppingCartIcon
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Looks like you haven't added anything to your cart yet.
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper} elevation={2} sx={{ mb: 4 }}>
                <Table>
                  <TableHead sx={{ bgcolor: "background.default" }}>
                    <TableRow>
                      <StyledTableCell>Product</StyledTableCell>
                      <StyledTableCell align="center">Price</StyledTableCell>
                      <StyledTableCell align="center">Quantity</StyledTableCell>
                      <StyledTableCell align="center">Total</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <StyledTableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ProductImage src={item.image} alt={item.name} />
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle1"
                                component={Link}
                                to={`/product/${item.id}`}
                                sx={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  fontWeight: "medium",
                                  "&:hover": {
                                    color: "primary.main",
                                  },
                                }}
                              >
                                {item.name}
                              </Typography>
                              {item.vendor && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Sold by: {item.vendor.name}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Rs.{item.price.toFixed(2)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 1,
                              width: "fit-content",
                              margin: "0 auto",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item, -1)}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 2 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item, 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Typography fontWeight="bold" color="primary">
                            Rs.{(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => confirmRemoveItem(item.id)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  component={Link}
                  to="/products"
                  startIcon={<ArrowBackIcon />}
                  sx={{ textTransform: "none" }}
                >
                  Continue Shopping
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => setDialogOpen(true)}
                  sx={{ textTransform: "none" }}
                >
                  Clear Cart
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Apply Coupon
                  </Typography>
                  <form onSubmit={handleCouponSubmit}>
                    <TextField
                      fullWidth
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      error={!!couponError}
                      helperText={couponError}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              type="submit"
                              variant="contained"
                              size="small"
                              color="primary"
                            >
                              Apply
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </form>
                </CardContent>
              </Card>

              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>

                  <Box sx={{ my: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1">Subtotal</Typography>
                      <Typography variant="body1">
                        Rs.{total.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1">Shipping</Typography>
                      <Typography variant="body1">
                        {total >= 50 ? "Free" : "Rs.5.00"}
                      </Typography>
                    </Box>
                    {total < 50 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          bgcolor: "secondary.light",
                          color: "secondary.dark",
                          p: 1,
                          borderRadius: 1,
                          mt: 1,
                          mb: 2,
                        }}
                      >
                        <LocalShippingIcon sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">
                          Add Rs.{(50 - total).toFixed(2)} more for free
                          shipping
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      Rs.{(total + (total >= 50 ? 0 : 5)).toFixed(2)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleCheckout}
                    sx={{ py: 1.5 }}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Remove</DialogTitle>
        <DialogContent>
          <Typography>
            {itemToRemove
              ? "Are you sure you want to remove this item from your cart?"
              : "Are you sure you want to clear your entire cart?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (itemToRemove) {
                handleRemoveItem(itemToRemove);
              } else {
                dispatch(clearCart());
                setSnackbarMessage("Cart cleared");
                setSnackbarOpen(true);
                setDialogOpen(false);
              }
            }}
            color="error"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default Cart;
