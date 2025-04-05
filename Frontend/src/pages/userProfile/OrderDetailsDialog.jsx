import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CancelIcon from "@mui/icons-material/Cancel";

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

const OrderDetailsDialog = ({ open, onClose, order, handleCancelOrder }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    {order && (
      <>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Order Details - #{order._id}</Typography>
            <Chip
              label={order.status}
              color={getStatusColor(order.status)}
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1" gutterBottom>
                {order.payment.method}
                {order.payment.cardLast4 &&
                  ` (ending in ${order.payment.cardLast4})`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Shipping Address
              </Typography>
              <Typography variant="body1">{order.address.street}</Typography>
              <Typography variant="body1" gutterBottom>
                {order.address.city}, {order.address.state} {order.address.zip}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Items
          </Typography>
          <Divider />
          <List sx={{ width: "100%" }}>
            {order.items.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
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
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography
                          component="div"
                          variant="body2"
                          color="text.primary"
                          sx={{ mt: 1 }}
                        >
                          Rs.{item.price.toFixed(2)} each
                        </Typography>
                      </>
                    }
                  />
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "background.default",
              p: 2,
              borderRadius: 1,
              mt: 3,
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Rs.{order.total.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          {order.status === "Pending" && (
            <Button
              color="error"
              onClick={() => {
                handleCancelOrder(order._id);
                onClose();
              }}
            >
              Cancel Order
            </Button>
          )}
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </>
    )}
  </Dialog>
);

export default OrderDetailsDialog;
