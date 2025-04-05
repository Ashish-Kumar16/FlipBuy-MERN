
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Breadcrumbs,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WalletIcon from '@mui/icons-material/Wallet';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockProducts, mockOrders } from '../data/mockData';

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  }
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered':
      return 'success';
    case 'Shipped':
      return 'info';
    case 'Processing':
      return 'warning';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Delivered':
      return <CheckCircleIcon fontSize="small" />;
    case 'Shipped':
      return <LocalShippingIcon fontSize="small" />;
    case 'Processing':
      return <NavigateNextIcon fontSize="small" />;
    case 'Cancelled':
      return <CancelIcon fontSize="small" />;
    default:
      return null;
  }
};

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isVendor, user } = useSelector((state) => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  
  // Redirect if not a vendor
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else if (!isVendor) {
      navigate('/become-vendor');
    }
  }, [isAuthenticated, isVendor, navigate]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value,
    });
  };
  
  const handleAddProduct = () => {
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...newProduct, price: Number(newProduct.price) } 
          : p
      );
      setProducts(updatedProducts);
      setSuccessMessage('Product updated successfully!');
    } else {
      // Add new product
      const newId = Math.max(...products.map(p => p.id)) + 1;
      const productToAdd = {
        ...newProduct,
        id: newId,
        price: Number(newProduct.price),
        rating: 0,
        vendor: {
          id: user?.id || 1,
          name: user?.name || 'Your Store',
        },
      };
      setProducts([...products, productToAdd]);
      setSuccessMessage('Product added successfully!');
    }
    
    setProductDialogOpen(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
    });
    setEditingProduct(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
    });
    setProductDialogOpen(true);
  };
  
  const confirmDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== productToDelete));
    setDeleteDialogOpen(false);
    setProductToDelete(null);
    setSuccessMessage('Product deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleShipOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'Shipped' } 
        : order
    ));
    setSuccessMessage('Order marked as shipped!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Calculate stats for dashboard
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'Processing').length;
  const productCount = products.length;
  const totalCustomers = [...new Set(orders.map(order => order.id))].length;
  
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
          <Typography color="text.primary">Vendor Dashboard</Typography>
        </Breadcrumbs>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Vendor Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                image: "",
              });
              setProductDialogOpen(true);
            }}
          >
            Add New Product
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ textAlign: "center" }}>
                <WalletIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                  Rs.{totalSales.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Sales
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ textAlign: "center" }}>
                <ShoppingCartIcon
                  sx={{ fontSize: 48, color: "#ff9800", mb: 1 }}
                />
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {pendingOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Orders
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ textAlign: "center" }}>
                <InventoryIcon sx={{ fontSize: 48, color: "#2196f3", mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {productCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Products
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent sx={{ textAlign: "center" }}>
                <BarChartIcon sx={{ fontSize: 48, color: "#4caf50", mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {totalCustomers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customers
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="dashboard tabs"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab icon={<InventoryIcon />} label="Products" />
            <Tab icon={<ShoppingCartIcon />} label="Orders" />
            <Tab icon={<ReceiptIcon />} label="Sales" />
            <Tab icon={<BarChartIcon />} label="Analytics" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Your Products</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                    image: "",
                  });
                  setProductDialogOpen(true);
                }}
              >
                Add New
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Avatar
                          src={product.image}
                          alt={product.name}
                          variant="square"
                          sx={{ width: 50, height: 50 }}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>Rs.{product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.rating}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditProduct(product)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">Recent Orders</Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>Customer #{order.id.split("-")[1]}</TableCell>
                      <TableCell>Rs.{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={order.status}
                          color={getStatusColor(order.status)}
                          icon={getStatusIcon(order.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                          View
                        </Button>
                        {order.status === "Processing" && (
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleShipOrder(order.id)}
                          >
                            Ship
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">Sales Overview</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recent Sales
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    {orders.slice(0, 5).map((order) => (
                      <React.Fragment key={order.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>
                              <ShoppingCartIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`Order #${order.id}`}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Rs.{order.total.toFixed(2)}
                                </Typography>
                                {` - ${new Date(
                                  order.date,
                                ).toLocaleDateString()}`}
                              </>
                            }
                          />
                          <Chip
                            size="small"
                            label={order.status}
                            color={getStatusColor(order.status)}
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Sales Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Sales
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      Rs.{totalSales.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Orders
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {orders.length}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Average Order Value
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      Rs.{(totalSales / (orders.length || 1)).toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">Analytics</Typography>
              <Typography variant="body2" color="text.secondary">
                View your store performance metrics
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Top Products
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    {products.slice(0, 5).map((product) => (
                      <React.Fragment key={product.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt={product.name}
                              src={product.image}
                              variant="square"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={product.name}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Rs.{product.price.toFixed(2)}
                                </Typography>
                                {` - Rs.{product.category}`}
                              </>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Sales by Category
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    {[
                      "Electronics",
                      "Fashion",
                      "Home",
                      "Beauty & Personal Care",
                    ].map((category) => {
                      const categoryProducts = products.filter(
                        (p) => p.category === category,
                      );
                      const categoryCount = categoryProducts.length;

                      return (
                        <React.Fragment key={category}>
                          <ListItem alignItems="flex-start">
                            <ListItemText
                              primary={category}
                              secondary={`${categoryCount} products`}
                            />
                            <Typography variant="subtitle1" fontWeight="bold">
                              Rs.{(Math.random() * 1000).toFixed(2)}
                            </Typography>
                          </ListItem>
                          <Divider component="li" />
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                name="name"
                value={newProduct.name}
                onChange={handleNewProductChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleNewProductChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>Rs.</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                value={newProduct.category}
                onChange={handleNewProductChange}
                fullWidth
                required
                select
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Fashion">Fashion</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
                <MenuItem value="Beauty & Personal Care">
                  Beauty & Personal Care
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                name="image"
                value={newProduct.image}
                onChange={handleNewProductChange}
                fullWidth
                required
                helperText="Enter a URL for the product image"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
            disabled={
              !newProduct.name ||
              !newProduct.description ||
              !newProduct.price ||
              !newProduct.category ||
              !newProduct.image
            }
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteProduct} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

export default VendorDashboard;
