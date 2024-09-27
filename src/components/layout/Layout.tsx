// src/components/Layout.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Container,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4a90e2",
    },
    background: {
      default: "#1e1e1e",
      paper: "#2d2d2d",
    },
  },
});

const Layout: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Crypto Portfolio
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Portfolio
          </Button>
          <Button color="inherit" component={Link} to="/holdings">
            Holdings
          </Button>
          <Button color="inherit" component={Link} to="/transactions">
            Transactions
          </Button>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            style={{
              marginLeft: "1rem",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />
          <Button color="inherit" style={{ marginLeft: "0.5rem" }}>
            Search
          </Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: "2rem" }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
