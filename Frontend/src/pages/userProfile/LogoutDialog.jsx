import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const LogoutDialog = ({ open, onClose, handleLogout }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Logout Confirmation</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to log out of your account?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleLogout} color="error">
        Logout
      </Button>
    </DialogActions>
  </Dialog>
);

export default LogoutDialog;
