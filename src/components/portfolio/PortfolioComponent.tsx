// src/components/portfolio/PortfolioComponent.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchPortfolio, fetchAllPortfolios, uploadTransactions } from "../../redux/slices/portfolioSlice";
import PortfolioLandingPage from "./PortfolioLandingPage";
import PortfolioPage from "./PortfolioPage";
import EmptyPortfolioState from "./EmptyPortfolioState";
import CreatePortfolioDialog from "./CreatePortfolioDialog";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const PortfolioComponent = () => {
  const dispatch = useAppDispatch();
  const { portfolioName } = useParams<{ portfolioName?: string }>();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data, error, portfolios } = useSelector(
    (state: RootState) => state.portfolio
  );

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
    setIsCreateDialogOpen(true);
  };

  const handleUploadPortfolio = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSubmitPortfolio = async (portfolioName: string, file?: File) => {
    try {
      if (file) {
        // Upload transactions to the selected portfolio
        await dispatch(uploadTransactions({ 
          file, 
          portfolioName 
        })).unwrap();
        toast.success("Transactions uploaded successfully!");
      } else {
        toast.success("Portfolio created successfully!");
      }
      dispatch(fetchAllPortfolios());
    } catch (error: any) {
      toast.error(error.message || "Failed to create portfolio");
      throw error;
    }
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
        <CreatePortfolioDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleSubmitPortfolio}
        />
      </>
    );
  }

  // If we have a specific portfolio selected, show the portfolio page
  if (selectedPortfolio && data) {
    return (
      <>
        <PortfolioPage portfolioDistribution={data} />
        <CreatePortfolioDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleSubmitPortfolio}
        />
      </>
    );
  }

  // Otherwise show the landing page
  return (
    <>
      <PortfolioLandingPage />
      <CreatePortfolioDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleSubmitPortfolio}
      />
    </>
  );
};

export default PortfolioComponent;
