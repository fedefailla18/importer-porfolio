import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BookIcon from '@mui/icons-material/Book';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import DataObjectIcon from '@mui/icons-material/DataObject';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const InvestorHubPage = () => {
  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' gutterBottom>
          Investor Hub
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Everything in one place: track portfolios, understand metrics, and sync exchange data with
          clear explanations before every critical action.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label='Beginner Friendly' color='primary' variant='outlined' />
          <Chip label='Action Before Explanation: Disabled' color='secondary' variant='outlined' />
          <Chip label='Finance-First Navigation' color='success' variant='outlined' />
        </Box>
      </Box>

      <Grid container spacing={2}>
        {[
          {
            title: 'Portfolio Center',
            description:
              'Create portfolios, upload trade files, and review holdings with distribution and P&L.',
            icon: <FolderCopyIcon color='primary' />,
            to: '/portfolio',
            cta: 'Open Portfolios',
          },
          {
            title: 'Binance Activity',
            description:
              'Read what the Binance fetch does, what data it touches, and then start it explicitly.',
            icon: <CandlestickChartIcon color='primary' />,
            to: '/binance-activity',
            cta: 'Review Binance Flow',
          },
          {
            title: 'Manual User Guide',
            description:
              'Step-by-step operational playbook for beginners through advanced investors.',
            icon: <BookIcon color='primary' />,
            to: '/manual',
            cta: 'Read Manual',
          },
          {
            title: 'Data Dictionary',
            description:
              'Plain-language definitions for portfolio, cash flow, cost basis, and P&L metrics.',
            icon: <DataObjectIcon color='primary' />,
            to: '/data-dictionary',
            cta: 'Open Dictionary',
          },
          {
            title: 'Transactions',
            description:
              'Inspect and filter historical transactions to verify accounting outcomes quickly.',
            icon: <AutoGraphIcon color='primary' />,
            to: '/transactions',
            cta: 'Review Transactions',
          },
        ].map(item => (
          <Grid item xs={12} md={6} key={item.title}>
            <Card
              variant='outlined'
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {item.icon}
                  <Typography variant='h6'>{item.title}</Typography>
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={RouterLink} to={item.to} variant='contained' size='small'>
                  {item.cta}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default InvestorHubPage;
