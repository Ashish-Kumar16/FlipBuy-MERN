
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SendIcon from '@mui/icons-material/Send';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#212121',
        color: 'white',
        pt: 6,
        pb: 4,
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
              FlipBuy
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#aaa' }}>
              Your one-stop multi-vendor marketplace for all your shopping needs. Find the best products from trusted vendors.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" aria-label="Facebook" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn" size="small">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
            <List sx={{ p: 0 }}>
              <ListItem component={Link} to="/" sx={{ color: '#aaa', textDecoration: 'none', py: 0.5, '&:hover': { color: 'white' } }}>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem component={Link} to="/products" sx={{ color: '#aaa', textDecoration: 'none', py: 0.5, '&:hover': { color: 'white' } }}>
                <ListItemText primary="All Products" />
              </ListItem>
              <ListItem component={Link} to="/vendors" sx={{ color: '#aaa', textDecoration: 'none', py: 0.5, '&:hover': { color: 'white' } }}>
                <ListItemText primary="Vendors" />
              </ListItem>
              <ListItem component={Link} to="/become-vendor" sx={{ color: '#aaa', textDecoration: 'none', py: 0.5, '&:hover': { color: 'white' } }}>
                <ListItemText primary="Sell on FlipBuy" />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>Customer Service</Typography>
            <List sx={{ p: 0 }}>
              <ListItem component={Link} to="/contact" sx={{ color: '#aaa', textDecoration: 'none', py: 0.5, '&:hover': { color: 'white' } }}>
                <ListItemText primary="Contact Us" />
              </ListItem>
              <ListItem component={Link} to="/faq" sx={{ color: '#aaa', textDecoration: 'none', py: 0.5, '&:hover': { color: 'white' } }}>
                <ListItemText primary="FAQs" />
              </ListItem>
              <ListItem component={Link} to="/shipping" sx={{ color: '#aaa', textDecoration: 'none', py: 0.5, '&:hover': { color: 'white' } }}>
                <ListItemText primary="Shipping & Returns" />
              </ListItem>
              <ListItem component={Link} to="/privacy" sx={{ color: '#aaa', textDecoration: 'none', py: 0.5, '&:hover': { color: 'white' } }}>
                <ListItemText primary="Privacy Policy" />
              </ListItem>
            </List>
          </Grid>

          
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="#aaa">
            © {new Date().getFullYear()} FlipBuy. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Typography component={Link} to="/terms" variant="body2" sx={{ color: '#aaa', textDecoration: 'none', '&:hover': { color: 'white' } }}>
              Terms of Service
            </Typography>
            <Typography component={Link} to="/privacy" variant="body2" sx={{ color: '#aaa', textDecoration: 'none', '&:hover': { color: 'white' } }}>
              Privacy Policy
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
