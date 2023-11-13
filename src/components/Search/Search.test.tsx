import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Search from './Search';

it('renders the Search component', () => {
  render(<Search onChange={() => {}} />);

  const inputElement = screen.getByTestId('Search');
  const labelElement = screen.getByTestId('SearchLabel');

  expect(inputElement).toBeInTheDocument();
  expect(labelElement).toBeInTheDocument();
});

it('calls onChange when input value changes', () => {
  const mockOnChange = jest.fn();
  render(<Search onChange={mockOnChange} />);

  const inputElement = screen.getByTestId('SearchInput');
  const labelElement = screen.getByTestId('SearchLabel');

  fireEvent.click(labelElement);
  fireEvent.change(inputElement, { target: { value: 'test' } });

  expect(mockOnChange).toHaveBeenCalledTimes(1);
  expect(mockOnChange).toHaveBeenCalledWith('test');
});
