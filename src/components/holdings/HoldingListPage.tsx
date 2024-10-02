import styled from "@emotion/styled";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  Input,
} from "@mui/material";
import { Link } from "react-router-dom";
import { HoldingDto } from "../../redux/types/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface HoldingListPageProps {
  holdings: HoldingDto[];
  portfolioName: string;
  setPriceMultiplier: Dispatch<SetStateAction<{ [key: number]: number }>>;
  setPredictionBtc: Dispatch<SetStateAction<{ [key: number]: number }>>;
  setPredictionUsdt: Dispatch<SetStateAction<{ [key: number]: number }>>;
  priceMultiplier: {
    [key: number]: number;
  };
}

const HoldingListPage = ({
  holdings,
  portfolioName,
  setPriceMultiplier,
  setPredictionBtc,
  setPredictionUsdt,
  priceMultiplier,
}: HoldingListPageProps) => {
  const [sortBy, setSortBy] = useState<string>(""); // State to store the field to sort by
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // State to store the sort direction

  useEffect(() => {
    // Initialize priceMultiplier with default values
    const initialPriceMultiplier = holdings.reduce((acc, _, index) => {
      acc[index] = 1;
      return acc;
    }, {} as { [key: number]: number });
    setPriceMultiplier(initialPriceMultiplier);

    // Initialize predictions
    holdings.forEach((holding, index) => {
      setPredictionUsdt((prev) => ({
        ...prev,
        [index]: holding.amountInUsdt || 0,
      }));
      setPredictionBtc((prev) => ({
        ...prev,
        [index]: holding.amountInBtc || 0,
      }));
    });
  }, [holdings, setPriceMultiplier, setPredictionUsdt, setPredictionBtc]);

  // Function to handle sorting when a table header is clicked
  const handleSort = (field: string) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const sortedHoldings = holdings.slice().sort((a, b) => {
    if (sortBy === "symbol") {
      return sortDirection === "asc"
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    } else if (sortBy === "amountInUsdt") {
      const aaUsdt = a?.amountInUsdt || 0;
      const baUsdt = b?.amountInUsdt || 0;
      return sortDirection === "asc" ? aaUsdt - baUsdt : baUsdt - aaUsdt;
    } else if (sortBy === "priceInUsdt") {
      const aaUsdt = a?.priceInUsdt || 0;
      const baUsdt = b?.priceInUsdt || 0;
      return sortDirection === "asc" ? aaUsdt - baUsdt : baUsdt - aaUsdt;
    }
    return 0;
  });

  return (
    <TableContainer component={Paper}>
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
          {sortedHoldings?.map((holding: HoldingDto, index: number) => (
            <TableRow key={holding.symbol}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Link to={`/portfolio/${portfolioName}/${holding.symbol}`}>
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

                    const amountInUsdt = holding?.amountInUsdt || 0;
                    const amountInBtc = holding?.amountInBtc || 0;

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
              <TableCell>
                {(priceMultiplier[index] || 1) * (holding?.amountInUsdt || 0)}
              </TableCell>
              <TableCell>
                {(priceMultiplier[index] || 1) * (holding?.amountInBtc || 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HoldingListPage;
