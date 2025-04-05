import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  InputAdornment,
  Breadcrumbs,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentsIcon from "@mui/icons-material/Payments";
import DoneIcon from "@mui/icons-material/Done";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  fetchUserData,
  createUserOrder,
  addUserAddress,
} from "../store/slices/userSlice";
import { clearCart } from "../store/slices/cartSlice";

const PaymentMethodCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : "1px solid transparent",
  backgroundColor: selected
    ? theme.palette.action.selected
    : theme.palette.background.paper,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ProductImage = styled("img")(({ theme }) => ({
  width: 60,
  height: 60,
  objectFit: "contain",
  backgroundColor: "#f5f5f5",
  borderRadius: theme.shape.borderRadius,
}));

const steps = ["Shipping", "Payment", "Review"];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, total } = useSelector((state) => state.cart);
  const { addresses, loading, error } = useSelector((state) => state.user);

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    isDefault: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

 useEffect(() => {
   const token = localStorage.getItem("token");
   if (!token) {
     navigate("/login");
   } else {
     dispatch(fetchUserData());
   }
 }, [dispatch, navigate]);
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]._id);
    }
  }, [addresses, selectedAddress]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      const newOrder = {
        items: cartItems.map((item) => ({
          id: item.id, // Should now be present
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: Number(
          (
            total +
            (total >= 50 ? 0 : 5) +
            (paymentMethod === "cod" ? 20 : 0)
          ).toFixed(2),
        ),
        address: selectedAddress,
        payment: {
          method:
            paymentMethod === "card"
              ? "Credit Card"
              : paymentMethod === "netbanking"
              ? "Net Banking"
              : paymentMethod === "upi"
              ? "UPI"
              : "Cash on Delivery",
          cardLast4:
            paymentMethod === "card" ? cardDetails.number.slice(-4) : null,
        },
      };

      console.log(
        "Order being sent to backend:",
        JSON.stringify(newOrder, null, 2),
      );

      dispatch(createUserOrder(newOrder))
        .unwrap()
        .then((order) => {
          dispatch(clearCart());
          setSnackbarMessage("Order placed successfully!");
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate("/order-confirmation", { state: { order } });
          }, 2000);
        })
        .catch((err) => {
          console.error("Order creation failed:", err);
          setSnackbarMessage(`Failed to place order: ${err}`);
          setSnackbarOpen(true);
        });
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleAddressSelect = (id) => {
    setSelectedAddress(id);
    setNewAddress(false);
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: value,
    });
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    dispatch(addUserAddress(addressForm))
      .unwrap()
      .then((newAddr) => {
        setSelectedAddress(newAddr._id);
        setNewAddress(false);
        setAddressForm({
          name: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
          isDefault: false,
        });
        setSnackbarMessage("Address added successfully!");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        setSnackbarMessage(`Failed to add address: ${err}`);
        setSnackbarOpen(true);
      });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Grid container spacing={2}>
                {addresses.map((address) => (
                  <Grid item xs={12} sm={6} key={address._id}>
                    <Paper
                      elevation={selectedAddress === address._id ? 3 : 1}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        border:
                          selectedAddress === address._id
                            ? "2px solid"
                            : "1px solid",
                        borderColor:
                          selectedAddress === address._id
                            ? "primary.main"
                            : "divider",
                        backgroundColor:
                          selectedAddress === address._id
                            ? "action.selected"
                            : "background.paper",
                      }}
                      onClick={() => handleAddressSelect(address._id)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {address.name}
                        </Typography>
                        {address.isDefault && (
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: "primary.main",
                              color: "white",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "0.7rem",
                            }}
                          >
                            Default
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2">{address.street}</Typography>
                      <Typography variant="body2">
                        {address.city}, {address.state} {address.zip}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Phone: {address.phone}
                      </Typography>
                      {selectedAddress === address._id && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 1,
                          }}
                        >
                          <DoneIcon color="primary" />
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      border: "1px dashed",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      minHeight: 150,
                    }}
                    onClick={() => setNewAddress(true)}
                  >
                    <AddIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      fontWeight="medium"
                    >
                      Add New Address
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
            {newAddress && (
              <Box component="form" onSubmit={handleAddAddress} sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Add New Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Address Name (e.g. Home, Work)"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Street Address"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="City"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      label="State"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      label="ZIP Code"
                      name="zip"
                      value={addressForm.zip}
                      onChange={handleAddressFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={addressForm.isDefault}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              isDefault: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Set as default address"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setNewAddress(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        Save Address
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <PaymentMethodCard
                      selected={paymentMethod === "card"}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CreditCardIcon
                              sx={{ color: "primary.main", mr: 1 }}
                            />
                            <Typography variant="subtitle1">
                              Credit / Debit Card
                            </Typography>
                          </Box>
                        }
                        sx={{ flexGrow: 1 }}
                      />
                    </PaymentMethodCard>
                  </Grid>
                  <Grid item xs={12}>
                    <PaymentMethodCard
                      selected={paymentMethod === "netbanking"}
                      onClick={() => setPaymentMethod("netbanking")}
                    >
                      <FormControlLabel
                        value="netbanking"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AccountBalanceIcon
                              sx={{ color: "primary.main", mr: 1 }}
                            />
                            <Typography variant="subtitle1">
                              Net Banking
                            </Typography>
                          </Box>
                        }
                        sx={{ flexGrow: 1 }}
                      />
                    </PaymentMethodCard>
                  </Grid>
                  <Grid item xs={12}>
                    <PaymentMethodCard
                      selected={paymentMethod === "upi"}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <FormControlLabel
                        value="upi"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PaymentsIcon
                              sx={{ color: "primary.main", mr: 1 }}
                            />
                            <Typography variant="subtitle1">UPI</Typography>
                          </Box>
                        }
                        sx={{ flexGrow: 1 }}
                      />
                    </PaymentMethodCard>
                  </Grid>
                  <Grid item xs={12}>
                    <PaymentMethodCard
                      selected={paymentMethod === "cod"}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <FormControlLabel
                        value="cod"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <HomeIcon sx={{ color: "primary.main", mr: 1 }} />
                            <Typography variant="subtitle1">
                              Cash on Delivery
                            </Typography>
                          </Box>
                        }
                        sx={{ flexGrow: 1 }}
                      />
                    </PaymentMethodCard>
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
            {paymentMethod === "card" && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Card Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleCardDetailsChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCardIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name on Card"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleCardDetailsChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                      name="expiry"
                      value={cardDetails.expiry}
                      onChange={handleCardDetailsChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardDetailsChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {paymentMethod === "cod" && (
              <Box sx={{ mt: 4 }}>
                <Alert severity="info">
                  Pay in cash at the time of delivery. Extra convenience fee of
                  Rs.20 will be charged for COD orders.
                </Alert>
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Items ({cartItems.length})
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      mb: 2,
                      py: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ProductImage src={item.image} alt={item.name} />
                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                      <Typography variant="subtitle2">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">Rs.{total.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">
                  {total >= 50 ? "Free" : "Rs.5.00"}
                </Typography>
              </Box>
              {paymentMethod === "cod" && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">COD Fee</Typography>
                  <Typography variant="body1">Rs.20.00</Typography>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Rs.
                  {(
                    total +
                    (total >= 50 ? 0 : 5) +
                    (paymentMethod === "cod" ? 20 : 0)
                  ).toFixed(2)}
                </Typography>
              </Box>
            </Paper>
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Shipping Address
              </Typography>
              {selectedAddress && (
                <Box>
                  <Typography variant="body1">
                    {
                      addresses.find((addr) => addr._id === selectedAddress)
                        ?.name
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {
                      addresses.find((addr) => addr._id === selectedAddress)
                        ?.street
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {
                      addresses.find((addr) => addr._id === selectedAddress)
                        ?.city
                    }
                    ,{" "}
                    {
                      addresses.find((addr) => addr._id === selectedAddress)
                        ?.state
                    }{" "}
                    {
                      addresses.find((addr) => addr._id === selectedAddress)
                        ?.zip
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone:{" "}
                    {
                      addresses.find((addr) => addr._id === selectedAddress)
                        ?.phone
                    }
                  </Typography>
                </Box>
              )}
            </Paper>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Payment Method
              </Typography>
              <Typography variant="body1">
                {paymentMethod === "card" && "Credit/Debit Card"}
                {paymentMethod === "netbanking" && "Net Banking"}
                {paymentMethod === "upi" && "UPI"}
                {paymentMethod === "cod" && "Cash on Delivery"}
              </Typography>
              {paymentMethod === "card" && cardDetails.number && (
                <Typography variant="body2" color="text.secondary">
                  Card ending with {cardDetails.number.slice(-4)}
                </Typography>
              )}
            </Paper>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 4 }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Home
        </Link>
        <Link to="/cart" style={{ textDecoration: "none", color: "inherit" }}>
          Cart
        </Link>
        <Typography color="text.primary">Checkout</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Checkout
      </Typography>
      <Box sx={{ width: "100%", mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
              {getStepContent(activeStep)}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && !selectedAddress) ||
                    (activeStep === 1 &&
                      paymentMethod === "card" &&
                      (!cardDetails.number ||
                        !cardDetails.name ||
                        !cardDetails.expiry ||
                        !cardDetails.cvv))
                  }
                >
                  {activeStep === steps.length - 1 ? "Place Order" : "Next"}
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: "auto", mb: 2 }}>
                  {cartItems.map((item) => (
                    <Box key={item.id} sx={{ display: "flex", mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">
                          {item.name} x {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        Rs.{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">Rs.{total.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">
                    {total >= 50 ? "Free" : "Rs.5.00"}
                  </Typography>
                </Box>
                {paymentMethod === "cod" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">COD Fee</Typography>
                    <Typography variant="body2">Rs.20.00</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight="bold"
                  >
                    Rs.
                    {(
                      total +
                      (total >= 50 ? 0 : 5) +
                      (paymentMethod === "cod" ? 20 : 0)
                    ).toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;
