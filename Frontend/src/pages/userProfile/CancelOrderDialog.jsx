import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const CancelOrderDialog = ({ open, onClose, confirmCancelOrder }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Cancel Order</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to cancel this order? This action cannot be
        undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>No, Keep Order</Button>
      <Button onClick={confirmCancelOrder} color="error" variant="contained">
        Yes, Cancel Order
      </Button>
    </DialogActions>
  </Dialog>
);

export default CancelOrderDialog;
