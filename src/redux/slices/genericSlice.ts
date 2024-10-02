// src/redux/slices/genericSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface PageableResponse<T> {
  content: T[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: any; // You can define a more specific type if needed
  size: number;
  sort: any; // You can define a more specific type if needed
  totalElements: number;
  totalPages: number;
}

interface GenericState<T> {
  items: T[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const createGenericSlice = <T>(name: string, fetchUrl: string) => {
  const initialState: GenericState<T> = {
    items: [],
    status: "idle",
    error: null,
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
    },
  };

  const fetchItems = createAsyncThunk(
    `${name}/fetchItems`,
    async (params: { page: number; size: number }, { rejectWithValue }) => {
      try {
        const response = await axios.get<PageableResponse<T>>(fetchUrl, {
          params,
        });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
    }
  );

  const slice = createSlice({
    name,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchItems.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(
          fetchItems.fulfilled,
          (state, action: PayloadAction<PageableResponse<T>>) => {
            state.status = "succeeded";
            state.items = action.payload.content;
            state.pagination = {
              currentPage: action.payload.number,
              totalPages: action.payload.totalPages,
              totalItems: action.payload.totalElements,
              itemsPerPage: action.payload.size,
            };
            state.error = null;
          }
        )
        .addCase(fetchItems.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message || "An error occurred";
        });
    },
  });

  return { slice, fetchItems };
};

export default createGenericSlice;
