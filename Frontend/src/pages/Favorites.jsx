// src/pages/Favorites.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Breadcrumbs,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Rating,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toggleFavoriteItem } from "../store/slices/favoritesSlice";
import { addToCart } from "../store/slices/cartSlice";

const FavoriteCard = styled(Card)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  width: 180,
  height: 180,
  objectFit: "contain",
  backgroundColor: "#f8f9fa",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: 200,
  },
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.secondary.main,
  },
  fontSize: "0.9rem",
}));

const EmptyState = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "16px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
}));

const Favorites = () => {
  const dispatch = useDispatch();
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  const handleRemoveFromFavorites = (id) => {
    dispatch(toggleFavoriteItem(id));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleAddAllToCart = () => {
    favoriteItems.forEach((item) => dispatch(addToCart(item)));
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Typography color="text.primary">Favorites</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Your Favorites
          </Typography>

          {favoriteItems.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddAllToCart}
            >
              Add All to Cart
            </Button>
          )}
        </Box>

        {favoriteItems.length === 0 ? (
          <EmptyState>
            <HeartBrokenIcon
              sx={{
                fontSize: 80,
                color: "text.secondary",
                mb: 3,
                opacity: 0.7,
              }}
            />
            <Typography variant="h5" gutterBottom fontWeight="medium">
              Your favorites list is empty
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ maxWidth: 500, mx: "auto", mb: 4 }}
            >
              Discover amazing products and save them to your favorites for
              quick access later.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              size="large"
            >
              Start Shopping
            </Button>
          </EmptyState>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                {favoriteItems.length}{" "}
                {favoriteItems.length === 1 ? "item" : "items"}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {favoriteItems.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <FavoriteCard>
                    <ProductImage
                      image={item.image}
                      title={item.name}
                      component={Link}
                      to={`/product/${item.id}`}
                      sx={{
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        justifyContent: "space-between",
                        p: 3,
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              component={Link}
                              to={`/product/${item.id}`}
                              sx={{
                                textDecoration: "none",
                                color: "inherit",
                                fontWeight: 600,
                                "&:hover": { color: "primary.main" },
                              }}
                            >
                              {item.name}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 1,
                                mb: 2,
                              }}
                            >
                              <StyledRating
                                value={item.rating || 4.5}
                                precision={0.5}
                                size="small"
                                readOnly
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                              >
                                ({item.rating || 4.5})
                              </Typography>
                            </Box>
                          </Box>

                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleRemoveFromFavorites(item.id)}
                            sx={{
                              bgcolor: "rgba(244,67,54,0.1)",
                              "&:hover": {
                                bgcolor: "rgba(244,67,54,0.2)",
                              },
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {item.description &&
                            (item.description.length > 150
                              ? `${item.description.substring(0, 150)}...`
                              : item.description)}
                        </Typography>

                        {item.vendor && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component={Link}
                            to={`/vendor/${item.vendor.id}`}
                            sx={{
                              textDecoration: "none",
                              display: "block",
                              mb: 2,
                              "&:hover": { color: "primary.main" },
                            }}
                          >
                            Seller: {item.vendor.name}
                          </Typography>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="secondary"
                          fontWeight="bold"
                        >
                          Rs.{item.price}
                        </Typography>
                        <Box>
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => handleAddToCart(item)}
                            sx={{
                              borderRadius: "8px",
                              textTransform: "none",
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </FavoriteCard>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default Favorites;
