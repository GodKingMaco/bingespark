import React from 'react';
import { render, screen } from '@testing-library/react';
import { RestfulApp } from '.';

test('renders learn react link', () => {
  render(<RestfulApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
