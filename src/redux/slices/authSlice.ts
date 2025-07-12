import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { removeAuthToken, setAuthToken } from "../utils/auth";
import api from "../utils/api";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
}

interface AuthError {
  message: string;
  statusCode?: number;
}

// Check if user is already authenticated from localStorage
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState: AuthState = {
  user: user ? JSON.parse(user) : null,
  isAuthenticated: !!token,
  status: "idle",
  loading: false,
  error: null,
};

interface LoginResponse {
  user: User;
  jwt: string;
}

export const login = createAsyncThunk<
  LoginResponse,
  { username: string; password: string }
>(
  "auth/login",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });
      const { jwt, user } = response.data;
      setAuthToken(jwt);
      return { jwt, user };
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
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  removeAuthToken();
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
      const response = await api.post("/api/auth/register", {
        username,
        email,
        password,
      });
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
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.jwt);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
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

export default authSlice.reducer;
