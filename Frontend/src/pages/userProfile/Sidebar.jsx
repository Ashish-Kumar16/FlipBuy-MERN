import React from "react";
import {
  Paper,
  Box,
  Typography,
  Divider,
  Button,
  Badge,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";

const ProfileTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  "& .MuiTab-root": {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlign: "left",
    paddingLeft: theme.spacing(3),
    minHeight: 56,
  },
  [theme.breakpoints.down("md")]: {
    borderRight: "none",
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .MuiTab-root": { paddingLeft: theme.spacing(2) },
  },
}));

const ProfileTab = styled(Tab)(({ theme }) => ({
  minWidth: 160,
  [theme.breakpoints.down("md")]: { minWidth: "auto", flex: 1 },
}));

const Sidebar = ({
  userData,
  tabValue,
  handleTabChange,
  handleEditProfile,
  setLogoutDialogOpen,
}) => {
  return (
    <Paper elevation={2} sx={{ mb: { xs: 3, md: 0 } }}>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <IconButton
              size="small"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                width: 32,
                height: 32,
                "&:hover": { bgcolor: "primary.dark" },
              }}
              onClick={handleEditProfile}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          }
        >
          <Avatar
            src={userData.avatar}
            alt={userData.name}
            sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
          />
        </Badge>
        <Typography variant="h6">{userData.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {userData.email}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={() => setLogoutDialogOpen(true)}
        >
          Logout
        </Button>
      </Box>

      <ProfileTabs
        orientation={{ xs: "horizontal", md: "vertical" }}
        variant="scrollable"
        value={tabValue}
        onChange={handleTabChange}
        aria-label="profile tabs"
        sx={{ borderColor: "divider" }}
      >
        <ProfileTab
          icon={<PersonIcon />}
          label="Profile"
          iconPosition="start"
          id="vertical-tab-0"
          aria-controls="vertical-tabpanel-0"
        />
        <ProfileTab
          icon={<ShoppingBagIcon />}
          label="Orders"
          iconPosition="start"
          id="vertical-tab-1"
          aria-controls="vertical-tabpanel-1"
        />
        <ProfileTab
          icon={<HomeIcon />}
          label="Addresses"
          iconPosition="start"
          id="vertical-tab-2"
          aria-controls="vertical-tabpanel-2"
        />
        <ProfileTab
          icon={<FavoriteIcon />}
          label="Favorites"
          iconPosition="start"
          id="vertical-tab-3"
          aria-controls="vertical-tabpanel-3"
        />
      </ProfileTabs>
    </Paper>
  );
};

export default Sidebar;
