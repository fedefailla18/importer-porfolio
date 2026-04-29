import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, isAxiosError } from 'axios';
import Cookies from 'universal-cookie';

import api from '../utils/api';
import { removeAuthToken, setAuthToken } from '../utils/auth';

interface AuthError {
  message: string;
  statusCode?: number;
}

interface User {
  username?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  loading: boolean;
  error: string | null;
}

const getAuthErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError<AuthError>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
let parsedUser: User | null = null;
try {
  if (user && user !== 'undefined' && user !== 'null') {
    parsedUser = JSON.parse(user);
  }
} catch (e) {
  parsedUser = null;
  localStorage.removeItem('user');
}

const initialState: AuthState = {
  user: parsedUser,
  isAuthenticated: !!token,
  status: 'idle',
  loading: false,
  error: null,
};

interface LoginResponse {
  jwt: string;
}

export const login = createAsyncThunk<LoginResponse, { username: string; password: string }>(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });
      const { jwt } = response.data;
      setAuthToken(jwt);
      localStorage.setItem('token', jwt);
      return { jwt };
    } catch (err) {
      const error = err as AxiosError<AuthError>;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue({
        message: error.response.data.message || 'Login failed',
        statusCode: error.response.status,
      });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  removeAuthToken();
});

export const register = createAsyncThunk(
  'auth/register',
  async (
    { username, email, password }: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/api/auth/register', {
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
        message: error.response.data.message || 'Registration failed',
        statusCode: error.response.status,
      });
    }
  }
);

export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/user/current');
      return response.data;
    } catch (error: unknown) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(getAuthErrorMessage(error, 'Token validation failed'));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const cookies = new Cookies();
      cookies.remove('auth_token', { path: '/' });
      cookies.remove('refresh_token', { path: '/' });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.jwt);
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        const payload = action.payload as { message: string } | undefined;
        state.error = payload?.message || action.error.message || 'Login failed';
      })
      .addCase(register.pending, state => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        const payload = action.payload as { message: string } | undefined;
        state.error = payload?.message || action.error.message || 'Registration failed';
      })
      .addCase(validateToken.pending, state => {
        state.status = 'loading';
      })
      .addCase(validateToken.fulfilled, state => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
      })
      .addCase(validateToken.rejected, state => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
