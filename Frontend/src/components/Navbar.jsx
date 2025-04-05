
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  InputBase,
  Avatar, 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import { logout } from '../store/slices/authSlice';
import { setSearchQuery } from '../store/slices/productsSlice';
import AuthModal from './AuthModal';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: 'all 0.3s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.7),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NavbarContainer = styled(AppBar)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  backgroundImage: 'linear-gradient(to right, #3772FF, #6B9AFF)',
  position: 'fixed',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '0.5px',
  background: 'linear-gradient(45deg, #FFFFFF 30%, #F0F0F0 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  fontSize: '1.6rem',
  marginRight: theme.spacing(2),
  fontFamily: '"Poppins", "Roboto", sans-serif',
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  padding: '8px 16px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: 'white',
  margin: theme.spacing(0, 0.5),
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  fontWeight: 600,
  padding: '8px 20px',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: 'bold',
  },
}));

const MenuDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: 'linear-gradient(180deg, #F8FAFF 0%, #EEF2FF 100%)',
    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '5px 0 15px rgba(0, 0, 0, 0.05)',
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(to right, #3772FF, #6B9AFF)',
  color: 'white',
}));

const DrawerItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateX(5px)',
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: favoriteItems } = useSelector((state) => state.favorites);
  
  const [searchValue, setSearchValue] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchValue));
    navigate('/search');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          minWidth: 180,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          mt: 1.5,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
            borderRadius: 1,
            mx: 0.5,
            my: 0.3,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          },
        },
      }}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        <ListItemIcon>
          <PersonIcon fontSize="small" color="primary" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
        <ListItemIcon>
          <ShoppingBagIcon fontSize="small" color="primary" />
        </ListItemIcon>
        Orders
      </MenuItem>
      {user?.isVendor ? (
        <MenuItem onClick={() => { navigate('/vendor/dashboard'); handleMenuClose(); }}>
          <ListItemIcon>
            <StorefrontIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Vendor Dashboard
        </MenuItem>
      ) : (
        <MenuItem onClick={() => { navigate('/become-vendor'); handleMenuClose(); }}>
          <ListItemIcon>
            <StorefrontIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Become a Vendor
        </MenuItem>
      )}
      <Divider sx={{ my: 1 }} />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <Box
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <DrawerHeader>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          FlipBuy
        </Typography>
        <Typography variant="body2">
          Shop smart, buy better
        </Typography>
      </DrawerHeader>
      <Divider />
      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
        <DrawerItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </DrawerItem>
        <DrawerItem button component={Link} to="/categories">
          <ListItemIcon>
            <CategoryIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </DrawerItem>
        <DrawerItem button component={Link} to="/vendors">
          <ListItemIcon>
            <StorefrontIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Vendors" />
        </DrawerItem>
        <DrawerItem button component={Link} to="/favorites">
          <ListItemIcon>
            <FavoriteIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </DrawerItem>
        <DrawerItem button component={Link} to="/cart">
          <ListItemIcon>
            <ShoppingCartIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Cart" />
        </DrawerItem>
      </List>
      <Divider />
      <List sx={{ px: 1, py: 2 }}>
        {isAuthenticated ? (
          <>
            <DrawerItem button component={Link} to="/profile">
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </DrawerItem>
            <DrawerItem button component={Link} to="/orders">
              <ListItemIcon>
                <ShoppingBagIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </DrawerItem>
            <DrawerItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </DrawerItem>
          </>
        ) : (
          <DrawerItem button onClick={() => setAuthModalOpen(true)}>
            <ListItemIcon>
              <AccountCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Sign In" />
          </DrawerItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <NavbarContainer position="fixed">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <IconButtonStyled
              size="large"
              edge="start"
              aria-label="open drawer"
              sx={{ mr: 1, display: { md: 'none' } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButtonStyled>

            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <LogoText variant="h6" noWrap>
                FlipBuy
              </LogoText>
            </Link>

            <form onSubmit={handleSearchSubmit} style={{ flexGrow: 1, display: 'flex' }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search products…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchValue}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Search>
              <SearchButton 
                type="submit" 
                variant="contained" 
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                Search
              </SearchButton>
            </form>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Favorites">
                <IconButtonStyled
                  size="large"
                  component={Link}
                  to="/favorites"
                  aria-label="show favorites"
                >
                  <StyledBadge badgeContent={favoriteItems.length} color="error">
                    <FavoriteIcon />
                  </StyledBadge>
                </IconButtonStyled>
              </Tooltip>
              
              <Tooltip title="Cart">
                <IconButtonStyled
                  size="large"
                  component={Link}
                  to="/cart"
                  aria-label="show cart items"
                >
                  <StyledBadge badgeContent={cartItems.length} color="error">
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButtonStyled>
              </Tooltip>
              
              {isAuthenticated ? (
                <Tooltip title="Account">
                  <IconButtonStyled
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                  >
                    {user?.avatar ? (
                      <Avatar 
                        src={user.avatar} 
                        alt={user.name} 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          border: '2px solid white' 
                        }} 
                      />
                    ) : (
                      <AccountCircleIcon />
                    )}
                  </IconButtonStyled>
                </Tooltip>
              ) : (
                <NavButton 
                  color="inherit" 
                  onClick={() => setAuthModalOpen(true)}
                  variant="outlined"
                  sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    border: '1px solid rgba(255,255,255,0.5)',
                    color: 'white'
                  }}
                >
                  Sign In
                </NavButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </NavbarContainer>
      {renderMenu}
      
      <MenuDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </MenuDrawer>
      
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      
      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
};

export default Navbar;
