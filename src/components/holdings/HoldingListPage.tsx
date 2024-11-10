import styled from "@emotion/styled";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  Input,
  Theme,
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

const StyledTableContainer = styled(TableContainer)({
  maxHeight: "70vh",
  overflow: "auto",
  "& table": {
    borderCollapse: "separate",
    borderSpacing: 0,
  },
});

const StickyTableCell = styled(TableCell)(({ theme }) => ({
  position: "sticky",
  backgroundColor: (theme as Theme).palette?.background?.paper || "#fff",
  zIndex: 2,
}));

const StickyHeaderCell = styled(StickyTableCell)({
  top: 0,
  zIndex: 1,
});

const StickyColumnCell = styled(StickyTableCell)(
  ({ index }: { index: number }) => ({
    left: index === 0 ? 0 : 60,
    zIndex: 2,
  })
);

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
        [index]: holding?.amountInUsdt || 0,
      }));
      setPredictionBtc((prev) => ({
        ...prev,
        [index]: holding?.amountInBtc || 0,
      }));
    });
  }, []);

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
    <StyledTableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StickyHeaderCell></StickyHeaderCell>
            <StickyHeaderCell>Symbol</StickyHeaderCell>
            <StickyHeaderCell>
              <TableSortLabel>Amount</TableSortLabel>
            </StickyHeaderCell>
            <StickyHeaderCell>totalAmountBought</StickyHeaderCell>
            <StickyHeaderCell>totalAmountSold</StickyHeaderCell>
            <StickyHeaderCell>Price in BTC</StickyHeaderCell>
            <StickyHeaderCell>
              <TableSortLabel onClick={() => handleSort("priceInUsdt")}>
                Price in USDT
              </TableSortLabel>
            </StickyHeaderCell>
            <StickyHeaderCell>Amount in BTC</StickyHeaderCell>
            <StickyHeaderCell>
              <TableSortLabel onClick={() => handleSort("amountInUsdt")}>
                Amount in USDT
              </TableSortLabel>
            </StickyHeaderCell>
            <StickyHeaderCell>Percentage</StickyHeaderCell>
            <StickyHeaderCell>stableTotalCost</StickyHeaderCell>
            <StickyHeaderCell>totalRealizedProfitUsdt</StickyHeaderCell>
            <StickyHeaderCell>Price Multiplier</StickyHeaderCell>
            <StickyHeaderCell>Prediction USDT</StickyHeaderCell>
            <StickyHeaderCell>Prediction BTC</StickyHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedHoldings?.map((holding: HoldingDto, index: number) => (
            <TableRow key={holding.symbol}>
              <StickyColumnCell index={0}>{index + 1}</StickyColumnCell>
              <StickyColumnCell index={0}>
                <Link to={`/portfolio/${portfolioName}/${holding.symbol}`}>
                  {holding.symbol}
                </Link>
              </StickyColumnCell>
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
              <TableCell>
                <Input
                  type="number"
                  value={priceMultiplier[index]}
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
    </StyledTableContainer>
  );
};

export default HoldingListPage;
