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
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";
import { useAppDispatch } from "../../redux/hooks";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8fbc8f",
    },
    background: {
      default: "#f0f8ff",
      paper: "#8fbc8f",
    },
  },
});

const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Crypto Portfolio
          </Typography>
          {isAuthenticated ? (
            <>
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
              <Button
                color="inherit"
                onClick={handleLogout}
                style={{ marginLeft: "0.5rem" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: "2rem" }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
