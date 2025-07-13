import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Upload as UploadIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

interface EmptyPortfolioStateProps {
  onCreatePortfolio: () => void;
  onUploadPortfolio: () => void;
}

const EmptyPortfolioState: React.FC<EmptyPortfolioStateProps> = ({
  onCreatePortfolio,
  onUploadPortfolio,
}) => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Welcome to Crypto Portfolio
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Start tracking your cryptocurrency investments and analyze your portfolio performance
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          Create your first portfolio to begin monitoring your crypto holdings, track transactions, 
          and get insights into your investment performance.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: "100%", 
              display: "flex", 
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <Box sx={{ mb: 2 }}>
                <AddIcon sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Create New Portfolio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start fresh with a new portfolio. Add your holdings manually and track them over time.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={onCreatePortfolio}
                sx={{ px: 4 }}
              >
                Create Portfolio
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: "100%", 
              display: "flex", 
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <Box sx={{ mb: 2 }}>
                <UploadIcon sx={{ fontSize: 60, color: "secondary.main" }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Upload Portfolio File
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Import your existing portfolio data from CSV or Excel files. 
                We'll help you get started quickly.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 3 }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<UploadIcon />}
                onClick={onUploadPortfolio}
                sx={{ px: 4 }}
              >
                Upload File
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom color="primary">
          What you can do with your portfolio:
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
              <AnalyticsIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1" fontWeight="medium">
                Track Performance
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Monitor your portfolio's growth and performance over time
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
              <TrendingUpIcon sx={{ mr: 1, color: "success.main" }} />
              <Typography variant="body1" fontWeight="medium">
                Analyze Holdings
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Get detailed insights into your crypto holdings and distributions
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
              <UploadIcon sx={{ mr: 1, color: "info.main" }} />
              <Typography variant="body1" fontWeight="medium">
                Manage Transactions
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Record and track all your buy/sell transactions
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EmptyPortfolioState; 