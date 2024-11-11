import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface AuthError {
  message: string;
  statusCode?: number;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  status: "idle",
  error: null,
};

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  message: string;
}

export const login = createAsyncThunk<
  LoginResponse,
  { username: string; password: string }
>("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<AuthError>;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue({
      message: error.response.data.message || "Login failed",
      statusCode: error.response.status,
    });
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      username,
      email,
      password,
    }: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        { username, email, password }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<AuthError>;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue({
        message: error.response.data.message || "Registration failed",
        statusCode: error.response.status,
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Registration failed";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;