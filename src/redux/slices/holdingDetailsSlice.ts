// src/redux/slices/holdingDetailsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { HoldingDetailsState, HoldingDto } from '../types/types'
import api from '../utils/api'

const initialState: HoldingDetailsState = {
  holdingDetails: null,
  status: 'idle',
  error: null,
}

export const fetchHoldingDetails = createAsyncThunk(
  'holdingDetails/fetchHoldingDetails',
  async ({
    portfolioName,
    symbol,
  }: {
    portfolioName: string
    symbol: string
  }) => {
    const response = await api.get<HoldingDto>(
      `/portfolio/${portfolioName}/${symbol}`
    )
    return response.data
  }
)

const holdingDetailsSlice = createSlice({
  name: 'holdingDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoldingDetails.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(
        fetchHoldingDetails.fulfilled,
        (state, action: PayloadAction<HoldingDto>) => {
          state.status = 'succeeded'
          state.holdingDetails = action.payload
          state.error = null
        }
      )
      .addCase(fetchHoldingDetails.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'An error occurred'
      })
  },
})

export default holdingDetailsSlice.reducer
