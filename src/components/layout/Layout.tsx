import { AppBar, Button, Container, Toolbar, Typography, Stack, Divider } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { useSyncNotifications } from '../../hooks/useSyncNotifications';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import { getAuthToken } from '../../redux/utils/auth';

const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  useSyncNotifications(isAuthenticated ? getAuthToken() : null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <AppBar position='static' color='primary'>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            Crypto Portfolio
          </Typography>
          {isAuthenticated ? (
            <Stack direction='row' spacing={1} alignItems='center'>
              <Button color='inherit' component={Link} to='/'>
                Home
              </Button>
              <Button color='inherit' component={Link} to='/portfolio'>
                Portfolios
              </Button>
              <Button color='inherit' component={Link} to='/transactions'>
                Transactions
              </Button>
              <Button color='inherit' component={Link} to='/binance-activity'>
                Binance
              </Button>
              <Button color='inherit' component={Link} to='/mexc-activity'>
                MEXC
              </Button>
              <Button color='inherit' component={Link} to='/manual'>
                Manual
              </Button>
              <Button color='inherit' component={Link} to='/data-dictionary'>
                Data Dictionary
              </Button>
              <Divider
                orientation='vertical'
                flexItem
                sx={{ borderColor: 'rgba(255,255,255,0.25)' }}
              />
              <Button color='inherit' component={Link} to='/settings'>
                Settings
              </Button>
              <Button color='inherit' onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          ) : (
            <>
              <Button color='inherit' component={Link} to='/login'>
                Login
              </Button>
              <Button color='inherit' component={Link} to='/register'>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
