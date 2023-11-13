import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Favourite from './Favourite';

describe('Favourite', () => {
  it('renders as not favourite by default', () => {
    render(<Favourite />);

    const favouriteElement = screen.getByTestId('Favourite');
    expect(favouriteElement).toBeInTheDocument();
  });

  it('toggles favourite state when clicked', () => {
    render(<Favourite />);

    const favouriteElement = screen.getByTestId('Favourite');
    fireEvent.click(favouriteElement);

    const favouriteIcon = screen.getByTestId('favouriteIcon');
    expect(favouriteIcon).toBeInTheDocument();

    fireEvent.click(favouriteElement);

    const notFavouriteIcon = screen.getByTestId('notFavouriteIcon');
    expect(notFavouriteIcon).toBeInTheDocument();
  });
});
