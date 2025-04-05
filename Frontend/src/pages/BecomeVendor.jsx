import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Breadcrumbs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { becomeVendorUser } from "../store/slices/authSlice";

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const BecomeVendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isVendor } = useSelector((state) => state.auth);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleBecomeVendor = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    dispatch(becomeVendorUser())
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "You are now a vendor",
          severity: "success",
        });
        navigate("/vendor/dashboard");
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: error || "Failed to become vendor",
          severity: "error",
        });
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // If already a vendor, redirect to vendor dashboard
  if (isVendor) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
          <CheckCircleIcon
            sx={{ fontSize: 64, color: "success.main", mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            You're already a vendor!
          </Typography>
          <Typography variant="body1" paragraph>
            Your vendor account is already set up and active.
          </Typography>
          <Button
            component={Link}
            to="/vendor/dashboard"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Go to Vendor Dashboard
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

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
          <Typography color="text.primary">Become a Vendor</Typography>
        </Breadcrumbs>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Become a Vendor on FlipBuy
        </Typography>

        <Box sx={{ my: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Start selling to millions of customers
              </Typography>
              <Typography variant="body1" paragraph>
                Join our growing community of vendors and expand your business.
                FlipBuy connects you with customers looking for products like
                yours.
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Reach Millions of Customers"
                    secondary="Get access to our large and growing customer base"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Simple Setup Process"
                    secondary="Create your store and start selling in minutes"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Secure Payments"
                    secondary="Receive payments directly to your bank account"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Powerful Tools"
                    secondary="Manage inventory, orders, and analytics all in one place"
                  />
                </ListItem>
              </List>

              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<StorefrontIcon />}
                onClick={handleBecomeVendor}
                sx={{ mt: 3, py: 1.5, px: 4 }}
              >
                Become a Vendor Now
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <img
                src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Vendor selling products"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  maxHeight: "400px",
                  objectFit: "cover",
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", mb: 4 }}
        >
          Why Sell on FlipBuy?
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard>
              <StorefrontIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Your Own Store
              </Typography>
              <Typography variant="body2">
                Customize your store page, showcase your brand, and build
                customer loyalty.
              </Typography>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard>
              <ShoppingBagIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Easy Inventory Management
              </Typography>
              <Typography variant="body2">
                Upload products, manage inventory, and update listings with our
                simple dashboard.
              </Typography>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard>
              <AccountBalanceIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Fast Payments
              </Typography>
              <Typography variant="body2">
                Receive payments directly to your bank account with our secure
                payment system.
              </Typography>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard>
              <AssignmentIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Detailed Analytics
              </Typography>
              <Typography variant="body2">
                Track sales, view customer insights, and optimize your business
                with our reporting tools.
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<StorefrontIcon />}
            onClick={handleBecomeVendor}
            sx={{ py: 1.5, px: 4 }}
          >
            Start Selling Today
          </Button>
        </Box>
      </Container>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

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

export default BecomeVendor;
