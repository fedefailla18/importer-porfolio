import { isAxiosError } from 'axios';

interface ApiErrorBody {
  message?: string;
  error?: string;
}

/**
 * Always returns a string, never the raw response body. Spring Boot's default error body
 * (`{timestamp, status, error, path}`) has no `message` field, so a bare
 * `error.response?.data?.message || error.response?.data` falls through to that raw object —
 * fine as a rejectWithValue payload until something renders it directly as a React child.
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const data = error.response?.data;
    if (typeof data === 'string' && data) {
      return data;
    }
    if (data?.message) {
      return data.message;
    }
    if (data?.error) {
      return data.error;
    }
    return fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
