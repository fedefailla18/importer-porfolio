import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchPortfolio,
  fetchPortfolioHoldingDistribution,
} from "../redux/actions/portfolioActions";
import PortfolioPage from "./PortfolioPage";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../configureStore";
import { toast } from "react-toastify";

const PortfolioComponent = () => {
  const dispatch = useAppDispatch();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("all");

  const { data, loading, error } = useSelector(
    (state: RootState) => state.portfolio
  );

  useEffect(() => {
    dispatch(fetchPortfolio("all"));
  }, [dispatch]);

  const handleCalculateDistribution = (name: string) => {
    dispatch(fetchPortfolioHoldingDistribution(name)).then(() => {
      toast.success("Portfolio updated");
    });
  };
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

  const portfoliosName = ["Binance", "MexC", "Buenbit", "all"];
  return (
    <div>
      <select
        value={selectedPortfolio}
        onChange={(e) => setSelectedPortfolio(e.target.value)}
      >
        <option value="all">All Portfolios</option>
        {/* Map over portfolio names to populate the select options */}
        {portfoliosName.map((portfolio) => (
          <option key={portfolio} value={portfolio}>
            {portfolio}
          </option>
        ))}
      </select>
      <button onClick={() => handleCalculateDistribution(selectedPortfolio)}>
        Calculate Distribution
      </button>
      <button onClick={handleDownloadPortfolio}>Download Portfolio</button>
      <PortfolioPage portfolioDistribution={data} />
    </div>
  );
};

export default PortfolioComponent;
