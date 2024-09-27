import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  styled,
  Input,
} from "@mui/material";
import { PortfolioDistribution, HoldingDto } from "../../redux/types/types";

// Define styles using makeStyles
const StyledContainer = styled(Container)({
  marginTop: "2rem",
});

const StyledTableContainer = styled(TableContainer)({
  marginTop: "2rem",
});

interface Props {
  portfolioDistribution: PortfolioDistribution;
}

const PortfolioPage = ({ portfolioDistribution }: Props) => {
  //const classes = useStyles();
  const [sortBy, setSortBy] = useState<string>(""); // State to store the field to sort by
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // State to store the sort direction
  const [priceMultiplier, setPriceMultiplier] = useState<{
    [key: number]: number;
  }>({});
  const [predictionUsdt, setPredictionUsdt] = useState<{
    [key: number]: number;
  }>({});
  const [predictionBtc, setPredictionBtc] = useState<{
    [key: number]: number;
  }>({});

  // Function to handle sorting when a table header is clicked
  const handleSort = (field: string) => {
    // If the field is already being sorted, toggle the sort direction
    if (field === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, set the field to sort by and default to ascending direction
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const sortedHoldings = portfolioDistribution.holdings.slice().sort((a, b) => {
    if (sortBy === "symbol") {
      return sortDirection === "asc"
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    } else if (sortBy === "amountInUsdt") {
      return sortDirection === "asc"
        ? a.amountInUsdt - b.amountInUsdt
        : b.amountInUsdt - a.amountInUsdt;
    } else if (sortBy === "priceInUsdt") {
      return sortDirection === "asc"
        ? a.priceInUsdt - b.priceInUsdt
        : b.priceInUsdt - a.priceInUsdt;
    }
    // Add additional sorting cases as needed
    return 0;
  });

  return (
    <StyledContainer maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Portfolio Distribution
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Portfolio Name: {portfolioDistribution.portfolioName}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total USDT: {portfolioDistribution.totalUsdt}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Holdings: {portfolioDistribution.totalHoldings}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Reazlized Profit:{" "}
        {sortedHoldings
          .map((e) => e.totalRealizedProfitUsdt)
          .reduce((acc, curr) => acc + curr, 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Stable Total Cost:{" "}
        {sortedHoldings
          .map((e) => e.stableTotalCost)
          .reduce((acc, curr) => acc + curr, 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Current Position in USDT:{" "}
        {sortedHoldings
          .map((e) => e.amountInUsdt)
          .reduce((acc, curr) => acc + curr, 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Current Position in BTC:{" "}
        {sortedHoldings
          .map((e) => e.amountInBtc)
          .reduce((acc, curr) => acc + curr, 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Prediction USDT:{" "}
        {Object.values(predictionUsdt).reduce((acc, curr) => acc + curr, 0)}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Prediction BTC:{" "}
        {Object.values(predictionBtc).reduce((acc, curr) => acc + curr, 0)}
      </Typography>

      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>
                <TableSortLabel>Amount</TableSortLabel>
              </TableCell>
              <TableCell>totalAmountBought</TableCell>
              <TableCell>totalAmountSold</TableCell>
              <TableCell>Price in BTC</TableCell>
              <TableCell>
                <TableSortLabel onClick={() => handleSort("priceInUsdt")}>
                  Price in USDT
                </TableSortLabel>
              </TableCell>
              <TableCell>Amount in BTC</TableCell>
              <TableCell>
                <TableSortLabel onClick={() => handleSort("amountInUsdt")}>
                  Amount in USDT
                </TableSortLabel>
              </TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>stableTotalCost</TableCell>
              <TableCell>totalRealizedProfitUsdt</TableCell>
              <TableCell>currentPositionInUsdt</TableCell>
              <TableCell>Price Multiplier</TableCell>
              <TableCell>Prediction USDT</TableCell>
              <TableCell>Prediction BTC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedHoldings.map((holding: HoldingDto, index: number) => (
              <TableRow key={holding.symbol}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Link
                    to={`/portfolio/${portfolioDistribution.portfolioName}/${holding.symbol}`}
                  >
                    {holding.symbol}
                  </Link>
                </TableCell>
                <TableCell>{holding.amount}</TableCell>
                <TableCell>{holding.totalAmountBought}</TableCell>
                <TableCell>{holding.totalAmountSold}</TableCell>
                <TableCell>{holding.priceInBtc}</TableCell>
                <TableCell>{holding.priceInUsdt}</TableCell>
                <TableCell>{holding.amountInBtc}</TableCell>
                <TableCell>{holding.amountInUsdt}</TableCell>
                <TableCell>{holding.percentage}</TableCell>
                <TableCell>{holding.stableTotalCost}</TableCell>
                <TableCell>{holding.totalRealizedProfitUsdt}</TableCell>
                <TableCell>{holding.currentPositionInUsdt}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={priceMultiplier[index] || 1}
                    onChange={(e) => {
                      const multiplier =
                        e.target.value !== "" ? Number(e.target.value) : 1;

                      setPriceMultiplier((prevState) => ({
                        ...prevState,
                        [index]: multiplier,
                      }));

                      const amountInUsdt = holding.amountInUsdt;
                      const amountInBtc = holding.amountInBtc;

                      setPredictionUsdt((prevState) => ({
                        ...prevState,
                        [index]: multiplier * amountInUsdt,
                      }));

                      setPredictionBtc((prevState) => ({
                        ...prevState,
                        [index]: multiplier * amountInBtc,
                      }));
                    }}
                  />
                </TableCell>
                <TableCell
                  onChange={(e) => {
                    setPredictionBtc((prevState) => ({
                      ...prevState,
                      [index]: priceMultiplier[index] * holding.amountInBtc,
                    }));
                  }}
                >
                  {priceMultiplier[index] * holding.amountInUsdt}
                </TableCell>
                <TableCell
                  onChange={(e) =>
                    setPredictionUsdt((prevState) => ({
                      ...prevState,
                      [index]: priceMultiplier[index] * holding.amountInUsdt,
                    }))
                  }
                >
                  {priceMultiplier[index] * holding.amountInBtc}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </StyledContainer>
  );
};

export default PortfolioPage;
