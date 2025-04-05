import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Rating,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentsIcon from "@mui/icons-material/Payments";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import CategoryIcon from "@mui/icons-material/Category";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SecurityIcon from "@mui/icons-material/Security";
import { fetchProductsSuccess } from "../store/slices/productsSlice";
import { mockProducts } from "../data/mockData";

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%), url(https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(12, 2),
  borderRadius: theme.spacing(3),
  marginBottom: theme.spacing(6),
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  color: "white",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "30%",
    background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
  },
}));

const HeroButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  padding: "12px 24px",
  fontWeight: 700,
  fontSize: "1rem",
  textTransform: "none",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
  transition: "all 0.3s ease",
  background: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  "&:hover": {
    background: theme.palette.secondary.dark,
    transform: "translateY(-3px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
  },
}));

const SectionHeading = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -10,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const ViewAllButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  padding: "8px 16px",
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateX(5px)",
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  borderRadius: theme.spacing(2),
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  border: "1px solid",
  borderColor: alpha(theme.palette.primary.main, 0.1),
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    borderColor: theme.palette.primary.main,
  },
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.spacing(2),
  height: "100%",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.07)",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  },
  "&:hover .MuiCardContent-root": {
    backgroundColor: alpha(theme.palette.primary.main, 0.8),
  },
  "&:hover img": {
    transform: "scale(1.1)",
  },
}));

const CategoryCardContent = styled(CardContent)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
  backgroundColor: alpha(theme.palette.primary.main, 0.7),
  transition: "background-color 0.3s ease-in-out",
  padding: theme.spacing(2),
}));

const CategoryImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  transition: "transform 0.5s ease",
}));

const VendorCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
  },
}));

const VendorAvatar = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: "50%",
  overflow: "hidden",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  border: "3px solid",
  borderColor: theme.palette.primary.main,
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const CTASection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
  padding: theme.spacing(6, 4),
  borderRadius: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: "white",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\")",
    opacity: 0.2,
  },
}));

// Sample static categories & featured vendors (can be replaced with dynamic values)
const staticCategories = [
  {
    id: 1,
    name: "Electronics",
    image:
      "https://3.imimg.com/data3/JD/EG/MY-4017618/supplier-of-electronics-items-in-andaman.jpg",
  },
  {
    id: 2,
    name: "Fashion",
    image:
      "https://www.fashioncronical.com/wp-content/uploads/2024/05/Fashion-Accessories-For-Women-1.webp",
  },
  {
    id: 3,
    name: "Home & Kitchen",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlaiVoZV-guO40eTsjZJxmCM3tD9ksgsIELA&s",
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5YpTOHtOEAWtwpXNhQAnVQHOl98IN5B_Rnw&s",
  },
];

const featuredVendors = [
  {
    id: 1,
    name: "TechGadgets",
    logo: "https://source.unsplash.com/random/100x100/?tech",
    rating: 4.7,
    productsCount: 127,
  },
  {
    id: 2,
    name: "HomeDecor",
    logo: "https://source.unsplash.com/random/100x100/?decor",
    rating: 4.8,
    productsCount: 98,
  },
  {
    id: 3,
    name: "FashionHub",
    logo: "https://source.unsplash.com/random/100x100/?fashion",
    rating: 4.5,
    productsCount: 215,
  },
  {
    id: 4,
    name: "SportsGear",
    logo: "https://source.unsplash.com/random/100x100/?sports",
    rating: 4.6,
    productsCount: 74,
  },
];

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    // Load mock products on initial render
    dispatch(fetchProductsSuccess(mockProducts));
  }, [dispatch]);

  // Compute trending products based on rating (top 4)
  const trendingProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // Featured products can be chosen as the first four or any other slice
  const featuredProducts = products.slice(0, 4);

  // Alternatively, if you wish to generate categories dynamically from products:
  // const dynamicCategories = [...new Set(products.map(p => p.category))];
  // For this example, we use the staticCategories above.

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        {/* Hero Section */}
        <HeroSection>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  pl: { md: 6 },
                  pr: { md: 2 },
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  fontWeight="bold"
                  sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
                >
                  Discover Amazing Products at Unbeatable Prices
                </Typography>
                <Typography
                  variant="h6"
                  paragraph
                  sx={{ mb: 4, textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                >
                  Shop the latest trends, enjoy free shipping on orders over
                  Rs.50, and explore products from trusted vendors.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <HeroButton
                    variant="contained"
                    component={Link}
                    to="/products"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Shop Now
                  </HeroButton>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/categories"
                    sx={{
                      borderRadius: theme.shape.borderRadius * 5,
                      padding: "12px 24px",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "none",
                      borderColor: "white",
                      color: "white",
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    Browse Categories
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </HeroSection>

        {/* Trending Products Section */}
        <Box sx={{ my: 6 }}>
          <SectionHeading>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TrendingUpIcon color="primary" />
                <Typography
                  variant="overline"
                  color="primary.main"
                  fontWeight="bold"
                >
                  HOT RIGHT NOW
                </Typography>
              </Box>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Trending Products
              </Typography>
            </Box>
            <ViewAllButton
              component={Link}
              to="/products?sort=trending"
              endIcon={<ArrowForwardIcon />}
              color="primary"
            >
              View All
            </ViewAllButton>
          </SectionHeading>
          <Grid container spacing={3}>
            {trendingProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Categories Section */}
        <Box sx={{ my: 8 }}>
          <SectionHeading>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CategoryIcon color="primary" />
                <Typography
                  variant="overline"
                  color="primary.main"
                  fontWeight="bold"
                >
                  SHOP BY
                </Typography>
              </Box>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Popular Categories
              </Typography>
            </Box>
            <ViewAllButton
              component={Link}
              to="/categories"
              endIcon={<ArrowForwardIcon />}
              color="primary"
            >
              View All
            </ViewAllButton>
          </SectionHeading>
          <Grid container spacing={3}>
            {staticCategories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <CategoryCard
                  component={Link}
                  to={`/category/${category.id}`}
                  sx={{ textDecoration: "none" }}
                >
                  <CategoryImage
                    component="img"
                    image={category.image}
                    alt={category.name}
                  />
                  <CategoryCardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {category.name}
                    </Typography>
                  </CategoryCardContent>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Products Section */}
        <Box sx={{ my: 8 }}>
          <SectionHeading>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <StarIcon color="primary" />
                <Typography
                  variant="overline"
                  color="primary.main"
                  fontWeight="bold"
                >
                  HAND-PICKED
                </Typography>
              </Box>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Featured Products
              </Typography>
            </Box>
            <ViewAllButton
              component={Link}
              to="/products?featured=true"
              endIcon={<ArrowForwardIcon />}
              color="primary"
            >
              View All
            </ViewAllButton>
          </SectionHeading>
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ my: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Why Choose FlipBuy?
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6, maxWidth: 700, mx: "auto" }}
          >
            We offer an outstanding shopping experience with free shipping,
            trusted vendors, and quality products.
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard elevation={0}>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: "50%",
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocalShippingIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  Free Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On orders over Rs.50.
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard elevation={0}>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: "50%",
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SupportAgentIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Always ready to help.
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard elevation={0}>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: "50%",
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PaymentsIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  Secure Payments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Safe checkout options.
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard elevation={0}>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: "50%",
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <StarIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  Top Quality
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Premium products.
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Box>

        {/* Featured Vendors Section */}
        <Box sx={{ my: 8 }}>
          <SectionHeading>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <StorefrontIcon color="primary" />
                <Typography
                  variant="overline"
                  color="primary.main"
                  fontWeight="bold"
                >
                  TRUSTED SELLERS
                </Typography>
              </Box>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Top Vendors
              </Typography>
            </Box>
            <ViewAllButton
              component={Link}
              to="/vendors"
              endIcon={<ArrowForwardIcon />}
              color="primary"
            >
              View All
            </ViewAllButton>
          </SectionHeading>
          <Grid container spacing={3}>
            {featuredVendors.map((vendor) => (
              <Grid item xs={12} sm={6} md={3} key={vendor.id}>
                <VendorCard
                  component={Link}
                  to={`/vendor/${vendor.id}`}
                  sx={{ textDecoration: "none", height: "100%" }}
                >
                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <VendorAvatar>
                      <img
                        src={vendor.logo}
                        alt={vendor.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </VendorAvatar>
                    <Typography
                      variant="h6"
                      component="div"
                      gutterBottom
                      fontWeight="bold"
                    >
                      {vendor.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Rating
                        value={vendor.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
                        ({vendor.rating})
                      </Typography>
                    </Box>
                    <Chip
                      label={`${vendor.productsCount} Products`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </VendorCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Become a Vendor CTA Section */}
        <CTASection>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ position: "relative", zIndex: 1 }}
          >
            Start Selling on FlipBuy Today
          </Typography>
          <Typography
            variant="subtitle1"
            paragraph
            sx={{
              mb: 4,
              maxWidth: 700,
              mx: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            Join our growing community of vendors and reach millions of
            customers. It’s quick and easy to get started.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/become-vendor"
            sx={{
              fontWeight: "bold",
              bgcolor: "white",
              color: theme.palette.primary.main,
              borderRadius: theme.shape.borderRadius * 5,
              padding: "12px 28px",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              position: "relative",
              zIndex: 1,
              "&:hover": {
                bgcolor: "white",
                transform: "translateY(-3px)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Become a Vendor
          </Button>
        </CTASection>
      </Container>
      <Footer />
    </>
  );
};

export default Index;
