import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Divider,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterListIcon from "@mui/icons-material/FilterList";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VerifiedIcon from "@mui/icons-material/Verified";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { GridContainer } from "../components/GridContainer";
import { GridItem } from "../components/GridItem";

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: "white",
  padding: theme.spacing(8, 4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  boxSizing: "border-box",
}));

const CategoryPage = ({ vendor = false }) => {
  const { category, vendorName } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const { products } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setTimeout(() => {
      if (vendor) {
        const mockVendors = [
          {
            id: 1,
            name: "TechGadgets Inc.",
            rating: 4.8,
            verified: true,
            products: 128,
            since: "2022",
            image: "https://source.unsplash.com/random/100x100/?tech",
          },
          {
            id: 2,
            name: "Fashion Forward",
            rating: 4.5,
            verified: true,
            products: 85,
            since: "2019",
            image: "https://source.unsplash.com/random/100x100/?fashion",
          },
          {
            id: 3,
            name: "Home Essentials",
            rating: 4.3,
            verified: true,
            products: 64,
            since: "2021",
            image: "https://source.unsplash.com/random/100x100/?home",
          },
          {
            id: 4,
            name: "Beauty Bliss",
            rating: 4.7,
            verified: false,
            products: 42,
            since: "2023",
            image: "https://source.unsplash.com/random/100x100/?beauty",
          },
          {
            id: 5,
            name: "Sports Unlimited",
            rating: 4.2,
            verified: true,
            products: 93,
            since: "2020",
            image: "https://source.unsplash.com/random/100x100/?sports",
          },
          {
            id: 6,
            name: "Kitchen Masters",
            rating: 4.6,
            verified: true,
            products: 56,
            since: "2021",
            image: "https://source.unsplash.com/random/100x100/?kitchen",
          },
          {
            id: 7,
            name: "Book Haven",
            rating: 4.9,
            verified: true,
            products: 112, // Fixed: Removed "Six"
            since: "2018",
            image: "https://source.unsplash.com/random/100x100/?books",
          },
          {
            id: 8,
            name: "Outdoor Adventures",
            rating: 4.4,
            verified: false,
            products: 37,
            since: "2022",
            image: "https://source.unsplash.com/random/100x100/?outdoor",
          },
        ];
        setVendors(mockVendors);
      } else if (vendorName) {
        setItems(products);
      } else if (category) {
        const filtered = products.filter(
          (product) =>
            product.category.toLowerCase() === category.toLowerCase(),
        );
        setItems(filtered);
      } else {
        setItems(products);
      }
      setLoading(false);
    }, 500);
  }, [category, vendorName, vendor, products]);

  const allCategories = [
    ...new Set(products.map((product) => product.category)),
  ];

  const renderVendorsPage = () => (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        All Vendors
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Browse all vendors on our platform
      </Typography>

      <Divider sx={{ my: 3 }} />

      <GridContainer spacing={3}>
        {vendors.map((vendorItem) => (
          <GridItem xs={12} sm={6} md={4} lg={3} key={vendorItem.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={vendorItem.image}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {vendorItem.name}
                      </Typography>
                      {vendorItem.verified && (
                        <VerifiedIcon
                          color="primary"
                          fontSize="small"
                          sx={{ ml: 0.5 }}
                        />
                      )}
                    </Box>
                    <Rating
                      value={vendorItem.rating}
                      size="small"
                      readOnly
                      precision={0.1}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Products
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {vendorItem.products}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Since
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {vendorItem.since}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/vendor/${encodeURIComponent(vendorItem.name)}`}
                  variant="contained"
                  fullWidth
                  startIcon={<StorefrontIcon />}
                >
                  Visit Store
                </Button>
              </Box>
            </Card>
          </GridItem>
        ))}
      </GridContainer>
    </Box>
  );

  const renderCategoriesPage = () => (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        All Categories
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Browse all product categories
      </Typography>

      <Divider sx={{ my: 3 }} />

      <GridContainer spacing={3}>
        {allCategories.map((categoryName, index) => (
          <GridItem xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              component={Link}
              to={`/category/${categoryName}`}
              sx={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderRadius: 2,
                backgroundImage: `url(https://t4.ftcdn.net/jpg/00/81/38/59/360_F_81385977_wNaDMtgrIj5uU5QEQLcC9UNzkJc57xbu.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                textDecoration: "none",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  transition: "background-color 0.3s",
                },
                "&:hover::before": {
                  backgroundColor: "rgba(0,0,0,0.3)",
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  zIndex: 1,
                  fontWeight: "bold",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  textAlign: "center",
                  px: 2,
                }}
              >
                {categoryName}
              </Typography>
            </Paper>
          </GridItem>
        ))}
      </GridContainer>
    </Box>
  );

  const renderVendorPage = () => (
    <Box sx={{ width: "100%" }}>
      <HeroSection>
        <Box sx={{ maxWidth: "lg", mx: "auto", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src="https://source.unsplash.com/random/100x100/?store"
              sx={{ width: 72, height: 72, mr: 2, border: "2px solid white" }}
            />
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="h4" fontWeight="bold">
                  {vendorName}
                </Typography>
                <VerifiedIcon sx={{ ml: 1, color: "white" }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Rating
                  value={4.7}
                  precision={0.5}
                  readOnly
                  sx={{ "& .MuiRating-iconFilled": { color: "white" } }}
                />
                <Typography variant="body2" sx={{ ml: 1, opacity: 0.9 }}>
                  (4.7) • 128 Products
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            High-quality products since 2022
          </Typography>
        </Box>
      </HeroSection>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          px: 2,
        }}
      >
        <Button
          component={Link}
          to="/vendors"
          startIcon={<ArrowBackIcon />}
          sx={{ fontWeight: "medium" }}
        >
          All Vendors
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {items.length} products found
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            component={Link}
            to={`/search?vendor=${vendorName}`}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 600, mx: "auto" }}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This vendor doesn't have any products yet.
          </Typography>
          <Button component={Link} to="/vendors" variant="contained">
            Browse All Vendors
          </Button>
        </Paper>
      ) : (
        <GridContainer spacing={3}>
          {items.map((product) => (
            <GridItem xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </GridItem>
          ))}
        </GridContainer>
      )}
    </Box>
  );

  const renderCategoryPage = () => (
    <Box sx={{ width: "100%" }}>
      <HeroSection>
        <Box sx={{ maxWidth: "lg", mx: "auto", width: "100%" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {category}
          </Typography>
          <Typography variant="subtitle1">
            Explore our selection of {category} products
          </Typography>
        </Box>
      </HeroSection>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          px: 2,
        }}
      >
        <Button
          component={Link}
          to="/categories"
          startIcon={<ArrowBackIcon />}
          sx={{ fontWeight: "medium" }}
        >
          All Categories
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {items.length} products found
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            component={Link}
            to={`/search?category=${category}`}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 600, mx: "auto" }}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            We couldn't find any products in this category.
          </Typography>
          <Button component={Link} to="/categories" variant="contained">
            Browse All Categories
          </Button>
        </Paper>
      ) : (
        <GridContainer spacing={3}>
          {items.map((product) => (
            <GridItem xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </GridItem>
          ))}
        </GridContainer>
      )}
    </Box>
  );

  const getBreadcrumbs = () => {
    const breadcrumbStyles = { mb: 3, px: 2 };
    if (vendor) {
      return (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={breadcrumbStyles}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Typography color="text.primary">Vendors</Typography>
        </Breadcrumbs>
      );
    } else if (vendorName) {
      return (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={breadcrumbStyles}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Link
            to="/vendors"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Vendors
          </Link>
          <Typography color="text.primary">{vendorName}</Typography>
        </Breadcrumbs>
      );
    } else if (category) {
      return (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={breadcrumbStyles}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Link
            to="/categories"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Categories
          </Link>
          <Typography color="text.primary">{category}</Typography>
        </Breadcrumbs>
      );
    } else {
      return (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={breadcrumbStyles}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Typography color="text.primary">
            {vendor ? "Vendors" : "Categories"}
          </Typography>
        </Breadcrumbs>
      );
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "background.default" }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {getBreadcrumbs()}
          {vendor && renderVendorsPage()}
          {vendorName && renderVendorPage()}
          {category && renderCategoryPage()}
          {!vendor && !vendorName && !category && renderCategoriesPage()}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CategoryPage;
