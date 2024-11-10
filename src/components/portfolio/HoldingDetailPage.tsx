import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchHoldingDetails } from "../../redux/slices/holdingDetailsSlice";

const HoldingDetailPage: React.FC = () => {
  const { portfolioName, symbol } = useParams<{
    portfolioName: string;
    symbol: string;
  }>();
  const dispatch = useAppDispatch();
  const { holdingDetails, status, error, loading } = useAppSelector(
    (state) => state.holdingDetails
  );

  useEffect(() => {
    if (portfolioName && symbol) {
      dispatch(fetchHoldingDetails({ portfolioName, symbol }));
    }
  }, [dispatch, portfolioName, symbol]);

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
    </div>
  );
};

export default HoldingDetailPage;
