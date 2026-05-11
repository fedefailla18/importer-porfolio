import {
  AccountBalance as PortfolioIcon,
  CandlestickChart as ExchangeIcon,
  Dashboard as DashboardIcon,
  HelpOutline as DictIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Logout as LogoutIcon,
  MenuBook as ManualIcon,
  PlayCircleOutline as GettingStartedIcon,
  ReceiptLong as TransactionsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { useSyncNotifications } from '../../hooks/useSyncNotifications';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import { getAuthToken } from '../../redux/utils/auth';

type Anchor = HTMLElement | null;

const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const username = useSelector((state: RootState) => state.auth.user?.username);
  useSyncNotifications(isAuthenticated ? getAuthToken() : null);

  const [portfolioAnchor, setPortfolioAnchor] = useState<Anchor>(null);
  const [exchangesAnchor, setExchangesAnchor] = useState<Anchor>(null);
  const [helpAnchor, setHelpAnchor] = useState<Anchor>(null);
  const [accountAnchor, setAccountAnchor] = useState<Anchor>(null);

  const closeAll = () => {
    setPortfolioAnchor(null);
    setExchangesAnchor(null);
    setHelpAnchor(null);
    setAccountAnchor(null);
  };

  const go = (path: string) => {
    navigate(path);
    closeAll();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    closeAll();
  };

  const menuProps = {
    transformOrigin: { horizontal: 'left' as const, vertical: 'top' as const },
    anchorOrigin: { horizontal: 'left' as const, vertical: 'bottom' as const },
    PaperProps: { sx: { mt: 0.5 } },
  };

  return (
    <>
      <AppBar position='static' color='primary'>
        <Toolbar>
          <Typography
            variant='h6'
            fontWeight={700}
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Crypto Portfolio
          </Typography>

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* Dashboard */}
              <Button color='inherit' onClick={() => go('/')}>
                Dashboard
              </Button>

              {/* Portfolio */}
              <Button
                color='inherit'
                endIcon={<ArrowDownIcon />}
                onClick={e => {
                  closeAll();
                  setPortfolioAnchor(e.currentTarget);
                }}
              >
                Portfolio
              </Button>
              <Menu
                anchorEl={portfolioAnchor}
                open={Boolean(portfolioAnchor)}
                onClose={closeAll}
                {...menuProps}
              >
                <MenuItem onClick={() => go('/portfolio-hub')}>
                  <ListItemIcon>
                    <DashboardIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary='Overview' secondary='Portfolio workspace' />
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => go('/portfolio')}>
                  <ListItemIcon>
                    <PortfolioIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary='My Portfolios' secondary='Holdings & P&L' />
                </MenuItem>
                <MenuItem onClick={() => go('/transactions')}>
                  <ListItemIcon>
                    <TransactionsIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary='Transactions' secondary='Full trade history' />
                </MenuItem>
              </Menu>

              {/* Exchanges */}
              <Button
                color='inherit'
                endIcon={<ArrowDownIcon />}
                onClick={e => {
                  closeAll();
                  setExchangesAnchor(e.currentTarget);
                }}
              >
                Exchanges
              </Button>
              <Menu
                anchorEl={exchangesAnchor}
                open={Boolean(exchangesAnchor)}
                onClose={closeAll}
                {...menuProps}
              >
                <MenuItem onClick={() => go('/exchanges')}>
                  <ListItemIcon>
                    <ExchangeIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary='Overview' secondary='All integrations' />
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => go('/binance-activity')}>
                  <ListItemText primary='Binance' secondary='Spot trades & order history' />
                </MenuItem>
                <MenuItem onClick={() => go('/mexc-activity')}>
                  <ListItemText primary='MEXC' secondary='Spot trades & deposits' />
                </MenuItem>
                <MenuItem onClick={() => go('/iol')}>
                  <ListItemText primary='InvertirOnline (IOL)' secondary='Argentine brokerage' />
                </MenuItem>
              </Menu>

              {/* Help */}
              <Button
                color='inherit'
                endIcon={<ArrowDownIcon />}
                onClick={e => {
                  closeAll();
                  setHelpAnchor(e.currentTarget);
                }}
              >
                Help
              </Button>
              <Menu
                anchorEl={helpAnchor}
                open={Boolean(helpAnchor)}
                onClose={closeAll}
                {...menuProps}
              >
                <MenuItem onClick={() => go('/getting-started')}>
                  <ListItemIcon>
                    <GettingStartedIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary='Getting Started' secondary='New user walkthrough' />
                </MenuItem>
                <MenuItem onClick={() => go('/manual')}>
                  <ListItemIcon>
                    <ManualIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary='Manual' secondary='Step-by-step guide' />
                </MenuItem>
                <MenuItem onClick={() => go('/data-dictionary')}>
                  <ListItemIcon>
                    <DictIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary='Data Dictionary' secondary='Metric definitions' />
                </MenuItem>
              </Menu>

              <Divider
                orientation='vertical'
                flexItem
                sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.25)' }}
              />

              {/* Account */}
              <IconButton
                size='small'
                sx={{ p: 0.5 }}
                onClick={e => {
                  closeAll();
                  setAccountAnchor(e.currentTarget);
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'inherit',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {username?.[0]?.toUpperCase() ?? 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={accountAnchor}
                open={Boolean(accountAnchor)}
                onClose={closeAll}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ sx: { minWidth: 180, mt: 0.5 } }}
              >
                {username && (
                  <>
                    <MenuItem disabled sx={{ opacity: '1 !important' }}>
                      <Typography variant='body2' fontWeight={600}>
                        {username}
                      </Typography>
                    </MenuItem>
                    <Divider />
                  </>
                )}
                <MenuItem onClick={() => go('/settings')}>
                  <ListItemIcon>
                    <SettingsIcon fontSize='small' />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize='small' />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color='inherit' onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color='inherit' onClick={() => navigate('/register')}>
                Register
              </Button>
            </Box>
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
