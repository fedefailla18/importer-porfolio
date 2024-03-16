import React, { useState } from "react";

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
import { PortfolioDistribution, HoldingDto } from "../redux/types/types"; // Adjust the path as needed

// Define styles using makeStyles
const StyledContainer = styled(Container)({
  marginTop: "2rem",
});

const StyledTableContainer = styled(TableContainer)({
  marginTop: "2rem",
});

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof HoldingDto;
  label: string;
  numeric: boolean;
}
const headCells: readonly HeadCell[] = [
  {
    id: "symbol",
    numeric: false,
    disablePadding: true,
    label: "Symbol",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Amount",
  },
  {
    id: "amountInBtc",
    numeric: true,
    disablePadding: false,
    label: "amount In Btc",
  },
  {
    id: "amountInUsdt",
    numeric: true,
    disablePadding: false,
    label: "amountInUsdt",
  },
  {
    id: "percentage",
    numeric: true,
    disablePadding: false,
    label: "percentage",
  },
];

interface Props {
  portfolioDistribution: PortfolioDistribution;
}

const PortfolioPage = ({ portfolioDistribution }: Props) => {
  //const classes = useStyles();
  const [sortBy, setSortBy] = useState<string>(""); // State to store the field to sort by
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // State to store the sort direction
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);
  const [prediction, setPrediction] = useState<number>(1);

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

  // Function to sort the holdings based on the current sorting state
  const sortedHoldings = portfolioDistribution.holdings.slice().sort((a, b) => {
    if (sortBy === "symbol") {
      // Sort by symbol
      return sortDirection === "asc"
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    } else if (sortBy === "amount") {
      // Sort by amount
      return sortDirection === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else if (sortBy === "priceInUsdt") {
      // Sort by price in USDT
      return sortDirection === "asc"
        ? a.priceInUsdt - b.priceInUsdt
        : b.priceInUsdt - a.priceInUsdt;
    }
    // Add additional sorting cases as needed
    return 0;
  });

  return (
    <StyledContainer maxWidth="md">
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

      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>
                <TableSortLabel>Amount</TableSortLabel>
              </TableCell>
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
              <TableCell>Price Multiplier</TableCell>
              <TableCell>Prediction USDT</TableCell>
              <TableCell>Prediction BTC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedHoldings.map((holding: HoldingDto, index: number) => (
              <TableRow key={holding.symbol}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{holding.symbol}</TableCell>
                <TableCell>{holding.amount}</TableCell>
                <TableCell>{holding.priceInBtc}</TableCell>
                <TableCell>{holding.priceInUsdt}</TableCell>
                <TableCell>{holding.amountInBtc}</TableCell>
                <TableCell>{holding.amountInUsdt}</TableCell>
                <TableCell>{holding.percentage}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={priceMultiplier}
                    onChange={(e) => setPriceMultiplier(Number(e.target.value))}
                  />
                </TableCell>
                <TableCell>{priceMultiplier * holding.amountInUsdt}</TableCell>
                <TableCell>{priceMultiplier * holding.amountInBtc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </StyledContainer>
  );
};

export default PortfolioPage;
