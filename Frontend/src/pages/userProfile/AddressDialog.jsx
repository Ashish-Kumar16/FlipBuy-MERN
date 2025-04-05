import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const AddressDialog = ({
  open,
  onClose,
  newAddress,
  setNewAddress,
  editAddressIndex,
  handleAddAddress,
}) => {
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {editAddressIndex >= 0 ? "Edit Address" : "Add New Address"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Address Title (e.g. Home, Work)"
              fullWidth
              value={newAddress.name}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="street"
              label="Street Address"
              fullWidth
              value={newAddress.street}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="city"
              label="City"
              fullWidth
              value={newAddress.city}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="state"
              label="State"
              fullWidth
              value={newAddress.state}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="zip"
              label="ZIP Code"
              fullWidth
              value={newAddress.zip}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="phone"
              label="Phone Number"
              fullWidth
              value={newAddress.phone}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newAddress.isDefault}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      isDefault: e.target.checked,
                    })
                  }
                />
              }
              label="Set as default address"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleAddAddress}>
          {editAddressIndex >= 0 ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressDialog;
