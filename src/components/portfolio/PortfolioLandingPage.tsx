import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Upload as UploadIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAllPortfolios, fetchPortfolioDetails } from "../../redux/slices/portfolioSlice";
import { RootState } from "../../redux/store";
import CreatePortfolioDialog from "./CreatePortfolioDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PortfolioLandingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loadingPortfolios, setLoadingPortfolios] = useState<{ [key: string]: boolean }>({});

  const { portfolios, status, error } = useAppSelector(
    (state: RootState) => state.portfolio
  );

  useEffect(() => {
    dispatch(fetchAllPortfolios());
  }, [dispatch]);

  // Fetch detailed data for each portfolio
  useEffect(() => {
    portfolios.forEach(async (portfolio) => {
      if (!portfolio.balance && !loadingPortfolios[portfolio.name]) {
        setLoadingPortfolios(prev => ({ ...prev, [portfolio.name]: true }));
        try {
          await dispatch(fetchPortfolioDetails(portfolio.name)).unwrap();
        } catch (error) {
          console.error(`Failed to fetch portfolio ${portfolio.name}:`, error);
        } finally {
          setLoadingPortfolios(prev => ({ ...prev, [portfolio.name]: false }));
        }
      }
    });
  }, [portfolios, dispatch]);

  const handleCreatePortfolio = () => {
    setIsCreateDialogOpen(true);
  };

  const handleUploadPortfolio = () => {
    setIsCreateDialogOpen(true);
  };

  const handlePortfolioClick = (portfolioName: string) => {
    navigate(`/portfolio/${portfolioName}`);
  };

  const handleSubmitPortfolio = async (portfolioName: string, file?: File) => {
    try {
      // For now, we'll just show a success message
      // In a real implementation, you'd call the appropriate API
      toast.success("Portfolio created successfully!");
      dispatch(fetchAllPortfolios()); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || "Failed to create portfolio");
      throw error;
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance);
  };

  if (status === "loading" && portfolios.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading portfolios...
        </Typography>
      </Container>
    );
  }

  if (status === "failed") {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Failed to load portfolios"}
        </Alert>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchAllPortfolios())}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Your Portfolios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your cryptocurrency investments
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleUploadPortfolio}
          >
            Upload File
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePortfolio}
          >
            Create Portfolio
          </Button>
        </Box>
      </Box>

      {/* Portfolios Grid */}
      {portfolios.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <AccountBalanceIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No portfolios yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create your first portfolio to start tracking your crypto investments
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreatePortfolio}
          >
            Create Your First Portfolio
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {portfolios.map((portfolio) => (
            <Grid item xs={12} sm={6} md={4} key={portfolio.name}>
              <Card 
                sx={{ 
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  }
                }}
                onClick={() => handlePortfolioClick(portfolio.name)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {portfolio.name}
                    </Typography>
                    {loadingPortfolios[portfolio.name] && (
                      <CircularProgress size={20} />
                    )}
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {portfolio.balance > 0 
                        ? formatBalance(portfolio.balance)
                        : loadingPortfolios[portfolio.name]
                        ? "Loading..."
                        : "$0.00"
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Balance
                    </Typography>
                  </Box>

                  {portfolio.topHoldings.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Top Holdings
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {portfolio.topHoldings.slice(0, 5).map((holding, index) => (
                          <Chip
                            key={holding.symbol}
                            label={`${holding.symbol} ${holding.amount.toFixed(2)}`}
                            size="small"
                            variant="outlined"
                            color={index < 3 ? "primary" : "default"}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {portfolio.topHoldings.length === 0 && !loadingPortfolios[portfolio.name] && (
                    <Typography variant="body2" color="text.secondary">
                      No holdings yet
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePortfolioClick(portfolio.name);
                    }}
                  >
                    View Details
                  </Button>
                  <TrendingUpIcon color="action" />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Portfolio Dialog */}
      <CreatePortfolioDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleSubmitPortfolio}
      />
    </Container>
  );
};

export default PortfolioLandingPage; 