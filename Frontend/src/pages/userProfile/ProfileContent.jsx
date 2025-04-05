import React from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`vertical-tabpanel-${index}`}
    aria-labelledby={`vertical-tab-${index}`}
    style={{ width: "100%" }}
    {...other}
  >
    {value === index && <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>}
  </div>
);

const OrderCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s ease-in-out",
  "&:hover": { transform: "translateY(-3px)", boxShadow: theme.shadows[3] },
}));

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "success";
    case "Shipped":
      return "info";
    case "Processing":
      return "warning";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Delivered":
      return <CheckCircleIcon fontSize="small" />;
    case "Shipped":
      return <LocalShippingIcon fontSize="small" />;
    case "Processing":
      return <NavigateNextIcon fontSize="small" />;
    case "Cancelled":
      return <CancelIcon fontSize="small" />;
    default:
      return null;
  }
};

const ProfileContent = ({
  tabValue,
  userData,
  editMode,
  orders,
  addresses,
  favoriteItems,
  handleInputChange,
  handleSaveProfile,
  handleCancelEditProfile,
  handleViewOrderDetails,
  handleCancelOrder,
  setNewAddress,
  setAddressDialogOpen,
  setEditAddressIndex,
}) => {
  return (
    <Paper elevation={2}>
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Profile Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={userData.name || ""}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userData.email || ""}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={userData.phone || ""}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Avatar URL"
              name="avatar"
              value={userData.avatar || ""}
              onChange={handleInputChange}
              disabled={!editMode}
              helperText={editMode ? "Enter URL for your profile picture" : ""}
            />
          </Grid>
          {editMode && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button variant="outlined" onClick={handleCancelEditProfile}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          My Orders
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {orders.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <ShoppingBagIcon
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your order history will appear here once you've made a purchase.
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="primary"
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Box>
            {orders.map((order) => (
              <OrderCard key={order._id} elevation={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Order #{order._id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ mr: 1 }}>
                        Status:
                      </Typography>
                      <Chip
                        size="small"
                        label={order.status}
                        color={getStatusColor(order.status)}
                        icon={getStatusIcon(order.status)}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      Rs.{order.total.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 1 }}
                      onClick={() => handleViewOrderDetails(order)}
                    >
                      View Details
                    </Button>
                    {order.status === "Pending" && (
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: "flex", overflow: "auto", py: 1 }}>
                      {order.items.map((item) => (
                        <Box
                          key={item.id}
                          sx={{ mr: 2, p: 1, width: 80, textAlign: "center" }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "contain",
                              backgroundColor: "#f5f5f5",
                              borderRadius: 4,
                              marginBottom: 4,
                            }}
                          />
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </OrderCard>
            ))}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight="medium">
            My Addresses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
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
              setAddressDialogOpen(true);
            }}
          >
            Add New Address
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {addresses.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <HomeIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No addresses saved
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add a new address for faster checkout.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddressDialogOpen(true)}
            >
              Add New Address
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {addresses.map((address, index) => (
              <Grid item xs={12} sm={6} key={address._id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    position: "relative",
                    height: "100%",
                    border: address.isDefault ? "2px solid" : "1px solid",
                    borderColor: address.isDefault ? "primary.main" : "divider",
                  }}
                >
                  {address.isDefault && (
                    <Chip
                      label="Default"
                      size="small"
                      color="primary"
                      sx={{ position: "absolute", top: 12, right: 12 }}
                    />
                  )}
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {address.name}
                  </Typography>
                  <Typography variant="body2">{address.street}</Typography>
                  <Typography variant="body2">
                    {address.city}, {address.state} {address.zip}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Phone: {address.phone}
                  </Typography>
                  <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setEditAddressIndex(index);
                        setNewAddress(address);
                        setAddressDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    {!address.isDefault && (
                      <>
                        <Button variant="outlined" size="small" color="primary">
                          Set Default
                        </Button>
                        <Button variant="outlined" size="small" color="error">
                          Delete
                        </Button>
                      </>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          My Favorites
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {favoriteItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <FavoriteIcon
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No favorites yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Items you mark as favorites will be saved here.
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="primary"
            >
              Explore Products
            </Button>
          </Box>
        ) : (
          <List>
            {favoriteItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  component={Link}
                  to={`/product/${item.id}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    py: 2,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 80 }}>
                    <Avatar
                      src={item.image}
                      alt={item.name}
                      variant="square"
                      sx={{ width: 60, height: 60, borderRadius: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Rs.{item.price.toFixed(2)}
                        </Typography>
                        {" — "}
                        {item.description?.substring(0, 60)}...
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </TabPanel>
    </Paper>
  );
};

export default ProfileContent;
