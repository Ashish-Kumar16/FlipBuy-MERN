import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box textAlign="center">
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: "6rem", fontWeight: "bold", mb: 2 }}
        >
          404
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary", mb: 3 }}>
          Oops! Page not found
        </Typography>
        <Button
          component="a"
          href="/"
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
