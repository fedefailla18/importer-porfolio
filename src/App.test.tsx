import { render, screen } from '@testing-library/react';
import React from 'react';

import App from './App';

test('renders login page by default', () => {
  render(<App />);
  const loginHeading = screen.getByRole('heading', { name: /login/i });
  expect(loginHeading).toBeInTheDocument();
});
