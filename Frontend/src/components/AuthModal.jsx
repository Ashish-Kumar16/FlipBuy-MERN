// src/components/AuthModal.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { loginUser, registerUser } from "../store/slices/authSlice"; // Changed import

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogTitle-root": {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ffffff",
  color: "#757575",
  border: "1px solid #dbdbdb",
  boxShadow: "none",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    boxShadow: "none",
  },
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const AuthModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setLoginError("");
    setRegisterError("");
    // Reset form fields when switching tabs
    setLoginEmail("");
    setLoginPassword("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields");
      return;
    }

    try {
      await dispatch(
        loginUser({ email: loginEmail, password: loginPassword }),
      ).unwrap();
      setLoginEmail("");
      setLoginPassword("");
      onClose();
    } catch (error) {
      setLoginError(error || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setRegisterError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error) {
      setRegisterError(error || "Registration failed");
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth here
    console.log("Google login not implemented");
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          {tabValue === 0 ? "Sign In" : "Create Account"}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>

        <Box>
          <GoogleButton
            variant="contained"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </GoogleButton>

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              OR
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          {tabValue === 0 ? (
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {loginError && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {loginError}
                </Typography>
              )}

              <Box sx={{ mt: 1, mb: 2, textAlign: "right" }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ py: 1.5 }}
              >
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {registerError && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {registerError}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ py: 1.5, mt: 2 }}
              >
                Create Account
              </Button>
            </form>
          )}

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {tabValue === 0
                ? "Don't have an account? "
                : "Already have an account? "}
              <Typography
                component="span"
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer", fontWeight: "bold" }}
                onClick={() => setTabValue(tabValue === 0 ? 1 : 0)}
              >
                {tabValue === 0 ? "Sign Up" : "Sign In"}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default AuthModal;
