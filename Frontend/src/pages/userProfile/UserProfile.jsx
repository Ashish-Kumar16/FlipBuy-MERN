import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Breadcrumbs,
  Alert,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  fetchUserData,
  updateProfile,
  addUserAddress,
  cancelUserOrder,
} from "../../store/slices/userSlice";
import { logout } from "../../store/slices/authSlice";
import Sidebar from "./Sidebar.jsx";
import ProfileContent from "./ProfileContent.jsx";
import AddressDialog from "./AddressDialog.jsx";
import LogoutDialog from "./LogoutDialog.jsx";
import OrderDetailsDialog from "./OrderDetailsDialog.jsx";
import CancelOrderDialog from "./CancelOrderDialog.jsx";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { profile, orders, addresses, loading, error } = useSelector(
    (state) => state.user,
  );
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(user || {});
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    isDefault: false,
  });
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState(-1);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserData())
        .unwrap()
        .catch((err) => setErrorMessage(`Failed to load user data: ${err}`));
    } else {
      navigate("/");
    }
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (profile) setUserData(profile);
  }, [profile]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleEditProfile = () => setEditMode(true);
  const handleSaveProfile = () => {
    dispatch(updateProfile(userData))
      .unwrap()
      .then(() => {
        setEditMode(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        setErrorMessage(`Failed to update profile: ${err}`);
        setTimeout(() => setErrorMessage(""), 3000);
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleCancelEditProfile = () => {
    setEditMode(false);
    setUserData(profile || {});
  };
  const handleLogout = () => {
    dispatch(logout());
    setLogoutDialogOpen(false);
    navigate("/");
  };
  const handleViewOrderDetails = (order) => setViewOrderDetails(order);
  const handleCloseOrderDetails = () => setViewOrderDetails(null);
  const handleCancelOrder = (id) => setCancelOrderId(id);
  const confirmCancelOrder = () => {
    dispatch(cancelUserOrder(cancelOrderId))
      .unwrap()
      .then(() => {
        setCancelOrderId(null);
        setSuccessMessage("Order cancelled successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        setErrorMessage(`Failed to cancel order: ${err}`);
        setTimeout(() => setErrorMessage(""), 3000);
      });
  };
  const handleAddAddress = () => {
    dispatch(addUserAddress(newAddress))
      .unwrap()
      .then(() => {
        setAddressDialogOpen(false);
        setNewAddress({
          name: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
          isDefault: false,
        });
        setEditAddressIndex(-1);
        setSuccessMessage(
          editAddressIndex >= 0
            ? "Address updated successfully!"
            : "New address added successfully!",
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        setErrorMessage(`Failed to save address: ${err}`);
        setTimeout(() => setErrorMessage(""), 3000);
      });
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
          <Typography color="text.primary">My Account</Typography>
        </Breadcrumbs>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          My Account
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Sidebar
                userData={userData}
                tabValue={tabValue}
                handleTabChange={handleTabChange}
                handleEditProfile={handleEditProfile}
                setLogoutDialogOpen={setLogoutDialogOpen}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <ProfileContent
                tabValue={tabValue}
                userData={userData}
                editMode={editMode}
                orders={orders}
                addresses={addresses}
                favoriteItems={favoriteItems}
                handleInputChange={handleInputChange}
                handleSaveProfile={handleSaveProfile}
                handleCancelEditProfile={handleCancelEditProfile}
                handleViewOrderDetails={handleViewOrderDetails}
                handleCancelOrder={handleCancelOrder}
                setNewAddress={setNewAddress}
                setAddressDialogOpen={setAddressDialogOpen}
                setEditAddressIndex={setEditAddressIndex}
              />
            </Grid>
          </Grid>
        )}
      </Container>

      <AddressDialog
        open={addressDialogOpen}
        onClose={() => setAddressDialogOpen(false)}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        editAddressIndex={editAddressIndex}
        handleAddAddress={handleAddAddress}
      />
      <LogoutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        handleLogout={handleLogout}
      />
      <OrderDetailsDialog
        open={viewOrderDetails !== null}
        onClose={handleCloseOrderDetails}
        order={viewOrderDetails}
        handleCancelOrder={handleCancelOrder}
      />
      <CancelOrderDialog
        open={cancelOrderId !== null}
        onClose={() => setCancelOrderId(null)}
        confirmCancelOrder={confirmCancelOrder}
      />

      <Footer />
    </>
  );
};

export default UserProfile;
