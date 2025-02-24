// src/components/portfolio/PortfolioComponent.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchPortfolio } from "../../redux/actions/portfolioActions";
import PortfolioPage from "./PortfolioPage";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { MenuItem, Select, Button } from "@mui/material";

const PortfolioComponent = () => {
  const dispatch = useAppDispatch();
  const portfoliosName = ["Binance", "MexC", "Buenbit", "all"];
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>(
    portfoliosName[0] ?? "Select Portfolio"
  );

  const { data, loading, error } = useSelector(
    (state: RootState) => state.portfolio
  );

  useEffect(() => {
    dispatch(fetchPortfolio(selectedPortfolio));
  }, [dispatch, selectedPortfolio]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <Select
        value={selectedPortfolio}
        onChange={(e) => setSelectedPortfolio(e.target.value)}
      >
        <option value="">All Portfolios</option>
        {/* Map over portfolio names to populate the select options */}
        {portfoliosName.map((portfolio) => (
          <MenuItem key={portfolio} value={portfolio}>
            {portfolio}
          </MenuItem>
        ))}
      </Select>
      <Button onClick={handleDownloadPortfolio}>Download Portfolio</Button>
      <PortfolioPage portfolioDistribution={data} />
    </div>
  );
};

export default PortfolioComponent;
