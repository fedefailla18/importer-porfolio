// src/components/portfolio/PortfolioComponent.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPortfolio, fetchAllPortfolios } from '../../redux/slices/portfolioSlice';
import PortfolioLandingPage from './PortfolioLandingPage';
import PortfolioPage from './PortfolioPage';
import EmptyPortfolioState from './EmptyPortfolioState';
import PortfolioActionsDialog from './CreatePortfolioDialog';
import { useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { useParams } from 'react-router-dom';
import usePortfolioComponent from './usePortfolioComponent';

const PortfolioComponent = () => {
  const { handleSubmitPortfolioActions } = usePortfolioComponent();
  const dispatch = useAppDispatch();
  const { portfolioName } = useParams<{ portfolioName?: string }>();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dialogDefaultTab, setDialogDefaultTab] = useState(0);

  const { data, error, portfolios } = useSelector((state: RootState) => state.portfolio);

  useEffect(() => {
    dispatch(fetchAllPortfolios());
  }, []);

  useEffect(() => {
    if (portfolioName) {
      // If we have a portfolio name from URL, use it
      setSelectedPortfolio(portfolioName);
    } else if (portfolios?.length > 0 && !selectedPortfolio) {
      // Otherwise use the first portfolio
      setSelectedPortfolio(portfolios[0].name);
    }
  }, [portfolios, selectedPortfolio, portfolioName]);

  useEffect(() => {
    if (selectedPortfolio) {
      dispatch(fetchPortfolio(selectedPortfolio));
    }
  }, [selectedPortfolio]);

  const handleCreatePortfolio = () => {
    setDialogDefaultTab(0);
    setIsCreateDialogOpen(true);
  };

  const handleUploadPortfolio = () => {
    setDialogDefaultTab(1);
    setIsCreateDialogOpen(true);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Show empty state if no portfolios are available
  if (!portfolios || portfolios.length === 0) {
    return (
      <>
        <EmptyPortfolioState
          onCreatePortfolio={handleCreatePortfolio}
          onUploadPortfolio={handleUploadPortfolio}
        />
        <PortfolioActionsDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleSubmitPortfolioActions}
          defaultTab={dialogDefaultTab}
          portfolios={portfolios?.map(p => p.name) || []}
        />
      </>
    );
  }

  // If we have a specific portfolio selected, show the portfolio page
  if (selectedPortfolio && data) {
    return (
      <>
        <PortfolioPage portfolioDistribution={data} />
        <PortfolioActionsDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleSubmitPortfolioActions}
          defaultTab={dialogDefaultTab}
          portfolios={portfolios?.map(p => p.name) || []}
        />
      </>
    );
  }

  // Otherwise show the landing page
  return (
    <>
      <PortfolioLandingPage />
      <PortfolioActionsDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleSubmitPortfolioActions}
        defaultTab={dialogDefaultTab}
        portfolios={portfolios?.map(p => p.name) || []}
      />
    </>
  );
};

export default PortfolioComponent;
