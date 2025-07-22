import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { fetchHoldingDetails } from '../../redux/slices/holdingDetailsSlice'

const HoldingDetailPage: React.FC = () => {
  const { portfolioName, symbol } = useParams<{
    portfolioName: string
    symbol: string
  }>()
  const dispatch = useAppDispatch()
  const { holdingDetails, status, error, loading } = useAppSelector(
    (state) => state.holdingDetails
  )

  useEffect(() => {
    if (portfolioName && symbol) {
      dispatch(fetchHoldingDetails({ portfolioName, symbol }))
    }
  }, [dispatch, portfolioName, symbol])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!holdingDetails) {
    return <div>No data available</div>
  }

  return (
    <div>
      <h1>{holdingDetails.symbol} Details</h1>
      <p>
        Amount:{' '}
        {new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        }).format(holdingDetails.amount)}
      </p>
      <p>
        Total Amount Bought:{' '}
        {holdingDetails.totalAmountBought !== undefined
          ? new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 6,
              maximumFractionDigits: 6,
            }).format(holdingDetails.totalAmountBought)
          : 'Not available'}
      </p>
      <p>
        Total Amount Sold:{' '}
        {holdingDetails.totalAmountSold !== undefined
          ? new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 6,
              maximumFractionDigits: 6,
            }).format(holdingDetails.totalAmountSold)
          : 'Not available'}
      </p>
      <p>
        Price in BTC:{' '}
        {holdingDetails.priceInBtc !== undefined
          ? new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 8,
              maximumFractionDigits: 8,
            }).format(holdingDetails.priceInBtc)
          : 'Not available'}
      </p>
      <p>
        Price in USDT:{' '}
        {holdingDetails.priceInUsdt !== undefined
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(holdingDetails.priceInUsdt)
          : 'Not available'}
      </p>
      <p>
        Amount in BTC:{' '}
        {new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 8,
          maximumFractionDigits: 8,
        }).format(holdingDetails.amountInBtc)}
      </p>
      <p>
        Current Position in USDT:{' '}
        {holdingDetails.currentPositionInUsdt !== undefined
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(holdingDetails.currentPositionInUsdt)
          : 'Not available'}
      </p>
      <p>
        Percentage:{' '}
        {holdingDetails.percentage !== undefined
          ? new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(holdingDetails.percentage) + '%'
          : 'Not available'}
      </p>
      <p>
        Total Cost Basis:{' '}
        {holdingDetails.stableTotalCost !== undefined
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(holdingDetails.stableTotalCost)
          : 'Not available'}
      </p>
      <p>
        Total Realized Profit:{' '}
        {holdingDetails.totalRealizedProfitUsdt !== undefined
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(holdingDetails.totalRealizedProfitUsdt)
          : 'Not available'}
      </p>
    </div>
  )
}

export default HoldingDetailPage
