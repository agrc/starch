import React from 'react';
import { render } from '@testing-library/react';
import App, { getDefQueryForSpeed } from './App';

test('renders without errors', () => {
  const { getByText } = render(<App />);
  const checkbox = getByText(/wireline/i);
  expect(checkbox).toBeInTheDocument();
});

test('getDefQueryForSpeed', () => {
  expect(getDefQueryForSpeed('field', 9)).toEqual('field >= 9');
  expect(getDefQueryForSpeed('field', 0.768)).toEqual('field >= 0.768');
  expect(getDefQueryForSpeed('field', 'all')).toEqual('1 = 1');
});
