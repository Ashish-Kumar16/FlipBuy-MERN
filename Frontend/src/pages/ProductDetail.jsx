import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  Tabs,
  Tab,
  Paper,
  Rating,
  Chip,
  TextField,
  IconButton,
  Breadcrumbs,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
  Info as InfoIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  Comment as CommentIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { addToCart } from "../store/slices/cartSlice";
import { toggleFavoriteItem } from "../store/slices/favoritesSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { GridContainer } from "../components/GridContainer";
import { GridItem } from "../components/GridItem";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { products } = useSelector((state) => state.products);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    setTimeout(() => {
      const foundProduct = products.find((p) => p.id.toString() === id);

      if (foundProduct) {
        setProduct({
          ...foundProduct,
          description:
            foundProduct.description + " " + foundProduct.description,
          images: [
            foundProduct.image,
            `https://source.unsplash.com/random/600x600/?${foundProduct.category}/1`,
            `https://source.unsplash.com/random/600x600/?${foundProduct.category}/2`,
            `https://source.unsplash.com/random/600x600/?${foundProduct.category}/3`,
          ],
          specs: [
            { name: "Brand", value: "Premium Brand" },
            { name: "Material", value: "High Quality" },
            { name: "Weight", value: "1.2 kg" },
            { name: "Dimensions", value: "30 x 20 x 10 cm" },
            { name: "Color", value: "Multiple Options" },
          ],
          stock: Math.floor(Math.random() * 50) + 1,
          discount:
            Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 5 : 0,
          reviews: [
            {
              id: 1,
              user: "John D.",
              rating: 5,
              comment: "Excellent product, very satisfied with the quality.",
              date: "2025-03-15",
            },
            {
              id: 2,
              user: "Sarah M.",
              rating: 4,
              comment: "Good value for money, would recommend.",
              date: "2025-03-10",
            },
            {
              id: 3,
              user: "Mike P.",
              rating: 5,
              comment: "Exactly as described, fast shipping too!",
              date: "2025-03-05",
            },
          ],
          vendor: {
            name: "TechGadgets Inc.",
            rating: 4.8,
            verified: true,
            products: 128,
            since: "2022",
          },
          features: [
            "High-quality materials",
            "Durable construction",
            "Easy to use",
            "Modern design",
            "Eco-friendly",
          ],
        });
      } else {
        navigate("/not-found");
      }

      setLoading(false);
    }, 800);
  }, [id, products, navigate]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      setSnackbarMessage("Product added to cart!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add favorites.");
      return;
    }

    try {
      const res = await dispatch(toggleFavoriteItem(product));
      console.log("Favorite response:", res);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out this product: ${product?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage("Link copied to clipboard!");
      setSnackbarSeverity("info");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const isInCart = product
    ? cartItems.some((item) => item.id === product.id)
    : false;
  const isInFavorites = product
    ? favoriteItems.some((item) => item.id === product.id)
    : false;

  const relatedProducts = product
    ? products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];

  const finalPrice = product
    ? product.discount
      ? (product.price - product.price * (product.discount / 100)).toFixed(2)
      : product.price.toFixed(2)
    : 0;

  const renderImageGallery = () => {
    if (!product) return null;

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column-reverse" : "row",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            gap: 2,
            flexWrap: isMobile ? "wrap" : "nowrap",
            justifyContent: "center",
          }}
        >
          {product.images.map((image, index) => (
            <Box
              key={index}
              onClick={() => setSelectedImage(index)}
              sx={{
                width: 70,
                height: 70,
                borderRadius: 1,
                overflow: "hidden",
                border:
                  selectedImage === index
                    ? `2px solid ${theme.palette.primary.main}`
                    : "2px solid transparent",
                cursor: "pointer",
                "&:hover": { opacity: 0.9 },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            position: "relative",
            height: isMobile ? 300 : 450,
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#f8f9fa",
          }}
        >
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transition: "all 0.3s ease",
            }}
          />
          {product.discount > 0 && (
            <Chip
              label={`${product.discount}% OFF`}
              color="error"
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            />
          )}
        </Box>
      </Box>
    );
  };

  const renderLoading = () => (
    <Box sx={{ mb: 4 }}>
      <Skeleton width="30%" height={24} sx={{ mb: 2 }} />
      <GridContainer spacing={4}>
        <GridItem xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 2, width: "100%" }}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2, width: "100%" }}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                width={80}
                height={80}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        </GridItem>
        <GridItem xs={12} md={6}>
          <Box sx={{ width: "100%" }}>
            <Skeleton height={40} sx={{ mb: 1, width: "100%" }} />
            <Skeleton width="40%" height={24} sx={{ mb: 2 }} />
            <Skeleton width="60%" height={30} sx={{ mb: 2 }} />
            <Skeleton width="80%" height={100} sx={{ mb: 3 }} />
            <Skeleton width="40%" height={56} sx={{ mb: 2 }} />
            <Skeleton width="100%" height={56} sx={{ mb: 2 }} />
            <Skeleton width="60%" height={40} />
          </Box>
        </GridItem>
      </GridContainer>
    </Box>
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          renderLoading()
        ) : product ? (
          <>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{ mb: 3 }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                Home
              </Link>
              <Link
                to={`/category/${product.category}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {product.category}
              </Link>
              <Typography color="text.primary">{product.name}</Typography>
            </Breadcrumbs>

            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mb: 4 }}
            >
              Back
            </Button>

            <GridContainer spacing={4}>
              <GridItem xs={12} md={6}>
                {renderImageGallery()}
              </GridItem>
              <GridItem xs={12} md={6}>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {product.name}
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={handleToggleFavorite}
                        color={isInFavorites ? "error" : "default"}
                        sx={{
                          bgcolor: "rgba(0,0,0,0.05)",
                          mr: 1,
                          "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
                        }}
                      >
                        {isInFavorites ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={handleShare}
                        sx={{
                          bgcolor: "rgba(0,0,0,0.05)",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Rating value={product.rating} precision={0.5} readOnly />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({product.rating.toFixed(1)})
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                    <Link
                      to="#reviews"
                      style={{
                        textDecoration: "none",
                        color: theme.palette.primary.main,
                      }}
                      onClick={() => setTabValue(2)}
                    >
                      {product.reviews.length} Reviews
                    </Link>
                  </Box>

                  <Card
                    sx={{
                      mb: 3,
                      bgcolor:
                        product.discount > 0
                          ? "rgba(244, 67, 54, 0.05)"
                          : "transparent",
                      border:
                        product.discount > 0
                          ? "1px dashed rgba(244, 67, 54, 0.5)"
                          : "none",
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        {product.discount > 0 && (
                          <Typography
                            variant="h6"
                            sx={{
                              textDecoration: "line-through",
                              color: "text.secondary",
                              opacity: 0.7,
                            }}
                          >
                            Rs.{product.price.toFixed(2)}
                          </Typography>
                        )}
                        <Typography
                          variant="h4"
                          color="primary"
                          fontWeight="bold"
                        >
                          Rs.{finalPrice}
                        </Typography>
                        {product.discount > 0 && (
                          <Chip
                            label={`Save ${product.discount}%`}
                            color="error"
                            size="small"
                            sx={{ fontWeight: "medium" }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                      Description
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {product.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                      Features
                    </Typography>
                    <List dense disablePadding>
                      {product.features.map((feature, index) => (
                        <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                          <CheckCircleIcon
                            color="success"
                            fontSize="small"
                            sx={{ mr: 1 }}
                          />
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Chip
                        icon={<CheckCircleIcon />}
                        label={
                          product.stock > 0
                            ? `In Stock (${product.stock} available)`
                            : "Out of Stock"
                        }
                        color={product.stock > 0 ? "success" : "error"}
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalShippingIcon color="primary" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        Free shipping & 30-day returns
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        sx={{ mr: 2 }}
                      >
                        Quantity:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 1,
                          border: 1,
                          borderColor: "divider",
                          bgcolor: "#f5f5f5",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          value={quantity}
                          onChange={handleQuantityChange}
                          inputProps={{
                            min: 1,
                            max: product.stock,
                            style: { width: "40px", textAlign: "center" },
                          }}
                          variant="standard"
                          sx={{
                            "& .MuiInput-underline:before": {
                              borderBottom: "none",
                            },
                            "& .MuiInput-underline:after": {
                              borderBottom: "none",
                            },
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={increaseQuantity}
                          disabled={quantity >= product.stock}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <GridContainer spacing={2}>
                      <GridItem xs={12} sm={6}>
                        <Button
                          variant="contained"
                          size="large"
                          fullWidth
                          onClick={handleAddToCart}
                          sx={{
                            py: 1.5,
                            bgcolor: isInCart ? "success.main" : "primary.main",
                            "&:hover": {
                              bgcolor: isInCart
                                ? "success.dark"
                                : "primary.dark",
                            },
                            width: "100%",
                          }}
                          startIcon={
                            isInCart ? (
                              <CheckCircleIcon />
                            ) : (
                              <ShoppingCartIcon />
                            )
                          }
                        >
                          {isInCart ? "Added to Cart" : "Add to Cart"}
                        </Button>
                      </GridItem>
                      <GridItem xs={12} sm={6}>
                        <Button
                          variant="outlined"
                          size="large"
                          fullWidth
                          component={Link}
                          to="/cart"
                          sx={{ py: 1.5, width: "100%" }}
                        >
                          Buy Now
                        </Button>
                      </GridItem>
                    </GridContainer>
                  </Box>

                  <Card sx={{ mt: 4, mb: 3 }}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}
                        >
                          {product.vendor.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {product.vendor.name}
                            </Typography>
                            {product.vendor.verified && (
                              <VerifiedIcon
                                color="primary"
                                fontSize="small"
                                sx={{ ml: 0.5 }}
                              />
                            )}
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating
                              value={product.vendor.rating}
                              size="small"
                              readOnly
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 0.5 }}
                            >
                              ({product.vendor.rating})
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ ml: "auto" }}>
                          <Link to={`/search?vendor=${product.vendor.name}`}>
                            <Button variant="outlined" size="small">
                              View Products
                            </Button>
                          </Link>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Products
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {product.vendor.products}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Since
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {product.vendor.since}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Rating
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {product.vendor.rating}/5
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </GridItem>
            </GridContainer>

            <Paper sx={{ mt: 6, mb: 6, borderRadius: 2, overflow: "hidden" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    fontSize: "1rem",
                    fontWeight: "medium",
                    py: 2,
                  },
                }}
              >
                <Tab
                  label="Specifications"
                  id="product-tab-0"
                  icon={<InfoIcon />}
                  iconPosition="start"
                />
                <Tab
                  label="Description"
                  id="product-tab-1"
                  icon={<InfoIcon />}
                  iconPosition="start"
                />
                <Tab
                  label={`Reviews (${product.reviews.length})`}
                  id="product-tab-2"
                  icon={<StarIcon />}
                  iconPosition="start"
                />
              </Tabs>

              <Box sx={{ p: 3 }}>
                <TabPanel value={tabValue} index={0}>
                  <List>
                    {product.specs.map((spec, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <GridContainer spacing={3}>
                            <GridItem xs={12} sm={4}>
                              <Typography
                                variant="subtitle2"
                                fontWeight="medium"
                              >
                                {spec.name}
                              </Typography>
                            </GridItem>
                            <GridItem xs={12} sm={8}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {spec.value}
                              </Typography>
                            </GridItem>
                          </GridContainer>
                        </ListItem>
                        {index < product.specs.length - 1 && (
                          <Divider component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Typography variant="body1" paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant="body1">
                    Enjoy our high-quality products with a 30-day money-back
                    guarantee. If you're not completely satisfied, return it for
                    a full refund.
                  </Typography>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {product.reviews.length > 0 ? (
                    <>
                      <Box sx={{ mb: 4 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Typography variant="h6" fontWeight="medium">
                            Customer Reviews
                          </Typography>
                          <Box
                            sx={{
                              ml: 2,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Rating
                              value={product.rating}
                              precision={0.5}
                              readOnly
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {product.rating.toFixed(1)} out of 5
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Based on {product.reviews.length} reviews
                        </Typography>
                      </Box>

                      {product.reviews.map((review) => (
                        <Card
                          key={review.id}
                          sx={{
                            mb: 3,
                            boxShadow: "none",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: theme.palette.primary.main,
                                    mr: 2,
                                  }}
                                >
                                  {review.user.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="medium"
                                  >
                                    {review.user}
                                  </Typography>
                                  <Rating
                                    value={review.rating}
                                    readOnly
                                    size="small"
                                  />
                                </Box>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <ScheduleIcon
                                  fontSize="small"
                                  color="action"
                                  sx={{ mr: 0.5 }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {review.date}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body1">
                              {review.comment}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                      <CommentIcon
                        sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                      />
                      <Typography variant="h6" gutterBottom>
                        No reviews yet
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Be the first to review this product!
                      </Typography>
                    </Box>
                  )}
                </TabPanel>
              </Box>
            </Paper>

            {relatedProducts.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold" }}
                >
                  You May Also Like
                </Typography>
                <GridContainer spacing={3}>
                  {relatedProducts.map((relatedProduct) => (
                    <GridItem xs={12} sm={6} md={3} key={relatedProduct.id}>
                      <ProductCard product={relatedProduct} />
                    </GridItem>
                  ))}
                </GridContainer>
              </Box>
            )}
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Product Not Found
            </Typography>
            <Typography variant="body1" paragraph>
              The product you are looking for does not exist or has been
              removed.
            </Typography>
            <Button component={Link} to="/" variant="contained">
              Return to Home
            </Button>
          </Paper>
        )}
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default ProductDetail;
