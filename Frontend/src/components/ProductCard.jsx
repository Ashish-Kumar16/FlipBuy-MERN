
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
  Box,
  IconButton,
  Chip,
  CardActionArea,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavoriteItem } from "../store/slices/favoritesSlice";

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  }
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 220,
  objectFit: 'contain',
  backgroundSize: 'contain',
  backgroundColor: '#f8f9fa',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const ProductContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const PriceRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1),
}));

const ActionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  fontSize: '0.75rem',
  height: 24,
  zIndex: 1,
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.secondary.main,
  },
  fontSize: '0.9rem',
}));

const ProductCard = ({ product, loading = false }) => {
  const dispatch = useDispatch();
  const { items: favoriteItems } = useSelector((state) => state.favorites);
  
  if (!product && !loading) return null;
  
  const { id, name, price, image, rating, vendor, category } = product || {};
  
  const isFavorite = favoriteItems.some(item => item?.id === id);
  
  const handleToggleFavorite = () => {
    if (product) {
      dispatch(toggleFavoriteItem(product.id));
      setSnackbarMessage(
        favoriteItems.some((item) => item.id === product.id)
          ? "Product removed from favorites!"
          : "Product added to favorites!",
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }
  };
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
  };
  
  if (loading) {
    return (
      <StyledCard>
        <Skeleton variant="rectangular" height={220} animation="wave" />
        <ProductContent>
          <Skeleton variant="text" width="60%" height={20} animation="wave" />
          <Skeleton variant="text" width="80%" height={20} animation="wave" />
          <Skeleton variant="text" width="40%" height={20} animation="wave" />
          <Box sx={{ display: 'flex', mt: 2, mb: 1 }}>
            <Skeleton variant="rectangular" width={120} height={36} animation="wave" />
            <Skeleton variant="circular" width={36} height={36} sx={{ ml: 'auto' }} animation="wave" />
          </Box>
        </ProductContent>
      </StyledCard>
    );
  }
  
  return (
    <StyledCard>
      <CardActionArea component={Link} to={`/product/${id}`}>
        <CategoryChip size="small" label={category} />
        <ProductImage image={image} title={name} />
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
            },
            zIndex: 1,
          }}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "remove from favorites" : "add to favorites"}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>

        <ProductContent>
          <Box>
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                height: "48px",
              }}
            >
              {name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <StyledRating
                value={rating}
                precision={0.5}
                size="small"
                readOnly
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                ({rating})
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                height: "40px",
              }}
            >
              {vendor?.name || "FlipBuy Store"}
            </Typography>
          </Box>

          <Box>
            <PriceRow>
              <Typography
                variant="h6"
                color="secondary"
                sx={{ fontWeight: "bold" }}
              >
                Rs.{price?.toFixed(2)}
              </Typography>
            </PriceRow>

            <ActionRow>
              <Button
                variant="contained"
                size="small"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  bgcolor: "secondary.main",
                  "&:hover": {
                    bgcolor: "secondary.dark",
                  },
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 0.7,
                }}
              >
                Add to Cart
              </Button>
            </ActionRow>
          </Box>
        </ProductContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default ProductCard;
