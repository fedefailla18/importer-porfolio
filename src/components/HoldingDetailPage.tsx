import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../configureStore";
import { fetchHoldingDetails } from "../redux/actions/portfolioActions"; // You might need to create this action
import { useAppDispatch } from "../redux/hooks";

const HoldingDetailsPage = () => {
  const { symbol } = useParams<{ symbol: string }>(); // Get the symbol from the URL
  const dispatch = useAppDispatch();
  const { holdingDetails, loading, error } = useSelector(
    (state: RootState) => state.holdingDetails
  );
  const { data } = useSelector((state: RootState) => state.portfolio);
  console.log("symbol: " + symbol);

  useEffect(() => {
    if (data && symbol)
      dispatch(fetchHoldingDetails(data.portfolioName, symbol)); // Fetch holding details
  }, [data, dispatch, symbol]);
  console.log("holdingDetails: " + holdingDetails);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!holdingDetails) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h1>{holdingDetails.symbol} Details</h1>
      <p>Amount: {holdingDetails.amount}</p>
      <p>Total Amount Bought: {holdingDetails.totalAmountBought}</p>
      <p>Total Amount Sold: {holdingDetails.totalAmountSold}</p>
      <p>Price in BTC: {holdingDetails.priceInBtc}</p>
      <p>Price in USDT: {holdingDetails.priceInUsdt}</p>
      <p>Amount in BTC: {holdingDetails.amountInBtc}</p>
      <p>Amount in USDT: {holdingDetails.amountInUsdt}</p>
      <p>Percentage: {holdingDetails.percentage}</p>
      <p>Stable Total Cost: {holdingDetails.stableTotalCost}</p>
      <p>
        Total Realized Profit USDT: {holdingDetails.totalRealizedProfitUsdt}
      </p>
      <p>Current Position in USDT: {holdingDetails.currentPositionInUsdt}</p>
    </div>
  );
};

export default HoldingDetailsPage;
