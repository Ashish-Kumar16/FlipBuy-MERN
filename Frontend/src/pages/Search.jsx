import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  MenuItem,
  InputAdornment,
  Slider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Breadcrumbs,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { setSearchQuery } from "../store/slices/productsSlice";
import { GridContainer } from "../components/GridContainer";
import { GridItem } from "../components/GridItem";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest Arrivals" },
];

const Search = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { searchQuery, filteredProducts, products, loading } = useSelector(
    (state) => state.products,
  );

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState({});

  useEffect(() => {
    // Parse search query from URL if available
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");
    const categoryParam = params.get("category");

    if (queryParam && queryParam !== searchQuery) {
      dispatch(setSearchQuery(queryParam));
      setSearchInput(queryParam);
    }

    // Initialize category filters
    const categories = [...new Set(products.map((p) => p.category))];
    const initialFilters = {};
    categories.forEach((cat) => {
      initialFilters[cat] = categoryParam ? cat === categoryParam : true;
    });
    setCategoryFilters(initialFilters);
  }, [dispatch, location.search, products, searchQuery]);

  useEffect(() => {
    // Apply filters and sorting when loading is finished
    if (loading) return;

    let results = searchQuery ? filteredProducts : products;

    // Apply category filters
    results = results.filter((p) => categoryFilters[p.category]);

    // Apply price range filter
    results = results.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // Apply sorting
    switch (sortBy) {
      case "price_low":
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // For demo purposes, shuffle the array
        results = [...results].sort(() => Math.random() - 0.5);
        break;
      case "relevance":
      default:
        // Keep current order for relevance
        break;
    }

    setDisplayedProducts(results);
  }, [
    filteredProducts,
    products,
    searchQuery,
    sortBy,
    priceRange,
    categoryFilters,
    loading,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchInput));
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilters({
      ...categoryFilters,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClearFilters = () => {
    // Reset all filters to default
    const resetFilters = {};
    Object.keys(categoryFilters).forEach((cat) => {
      resetFilters[cat] = true;
    });
    setCategoryFilters(resetFilters);

    setPriceRange([0, 1000]);
    setSortBy("relevance");
  };

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  const categories = Object.keys(categoryFilters);
  const maxPrice = Math.max(...products.map((p) => p.price), 1000);

  const renderFilters = () => (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: "medium" }}
        >
          Sort By
        </Typography>
        <TextField
          select
          fullWidth
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          size="small"
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: "medium" }}
        >
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={maxPrice}
          sx={{ mt: 3 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Rs.{priceRange[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rs.{priceRange[1]}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: "medium" }}
        >
          Categories
        </Typography>
        <FormControl component="fieldset">
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={categoryFilters[category]}
                    onChange={handleCategoryChange}
                    name={category}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>
    </>
  );

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
          <Typography color="text.primary">Search Results</Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "All Products"}
          </Typography>

          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button type="submit" variant="contained" color="primary">
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </form>
        </Box>

        <Box
          sx={{
            display: "flex",
            mb: 3,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {displayedProducts.length} results found
            </Typography>
          </Box>

          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={toggleMobileFilter}
            >
              Filters
            </Button>
          )}
        </Box>

        {/* Main grid layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 3,
          }}
        >
          {/* Desktop Filters */}
          {!isMobile && (
            <Card
              sx={{
                width: 280,
                height: "fit-content",
                p: 0,
                position: "sticky",
                top: 20,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    <FilterListIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
                    Filters
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    onClick={handleClearFilters}
                  >
                    Clear All
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />
                {renderFilters()}
              </CardContent>
            </Card>
          )}

          {/* Product Grid */}
          <Box sx={{ flexGrow: 1 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : displayedProducts.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <SearchIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  No results found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We couldn't find any products matching your search criteria.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </Paper>
            ) : (
              <GridContainer spacing={3}>
                {displayedProducts.map((product) => (
                  <GridItem xs={12} sm={6} md={4} lg={4} key={product.id}>
                    <ProductCard product={product} />
                  </GridItem>
                ))}
              </GridContainer>
            )}
          </Box>
        </Box>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="bottom"
          open={mobileFilterOpen}
          onClose={toggleMobileFilter}
          PaperProps={{
            sx: {
              maxHeight: "85vh",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              px: 2,
              py: 3,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              <FilterListIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Filters
            </Typography>
            <Box>
              <Button
                variant="text"
                color="primary"
                onClick={handleClearFilters}
                sx={{ mr: 1 }}
              >
                Clear All
              </Button>
              <IconButton onClick={toggleMobileFilter}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />
          {renderFilters()}

          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              bgcolor: "background.paper",
              pt: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={toggleMobileFilter}
              sx={{ py: 1.5 }}
            >
              Apply Filters
            </Button>
          </Box>
        </Drawer>
      </Container>

      <Footer />
    </>
  );
};

export default Search;
