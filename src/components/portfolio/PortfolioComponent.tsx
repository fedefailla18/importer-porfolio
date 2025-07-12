// src/components/portfolio/PortfolioComponent.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchPortfolio, fetchAllPortfolios, uploadTransactions } from "../../redux/slices/portfolioSlice";
import PortfolioLandingPage from "./PortfolioLandingPage";
import EmptyPortfolioState from "./EmptyPortfolioState";
import CreatePortfolioDialog from "./CreatePortfolioDialog";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";

const PortfolioComponent = () => {
  const dispatch = useAppDispatch();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data, error, portfolios } = useSelector(
    (state: RootState) => state.portfolio
  );

  useEffect(() => {
    dispatch(fetchAllPortfolios());
  }, []);

  useEffect(() => {
    if (portfolios?.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(portfolios[0].name);
    }
  }, [portfolios, selectedPortfolio]);

  useEffect(() => {
    if (selectedPortfolio) {
      dispatch(fetchPortfolio(selectedPortfolio));
    }
  }, [selectedPortfolio]);

  const handleDownloadPortfolio = () => {
    // Make the API call to download the portfolio as an Excel file
    fetch("http://localhost:8080/portfolio/download")
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([blob]));
        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = url;
        a.download = "portfolio.xlsx"; // Set the filename
        // Append the anchor to the document body and click it
        document.body.appendChild(a);
        a.click();
        // Remove the anchor from the document body
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading portfolio:", error);
      });
  };

  const handleCreatePortfolio = () => {
    setIsCreateDialogOpen(true);
  };

  const handleUploadPortfolio = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSubmitPortfolio = async (portfolioName: string, file?: File) => {
    try {
      if (file) {
        // Upload transactions to the new portfolio
        await dispatch(uploadTransactions({ 
          file, 
          portfolioName 
        })).unwrap();
        toast.success("Portfolio created and transactions uploaded successfully!");
      } else {
        // Just create an empty portfolio
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
