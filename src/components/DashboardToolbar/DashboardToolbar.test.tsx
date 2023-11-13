import { render, screen } from '@testing-library/react';
import DashboardToolbar from './DashboardToolbar';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from 'test-utils';
import { MapProvider } from 'app/providers/MapProvider';

describe('DashboardToolbar', () => {
  it('renders DashboardToolbar', () => {
    renderWithProviders(<MemoryRouter><MapProvider><DashboardToolbar /></MapProvider></MemoryRouter>);

    const favouriteElement = screen.getByTestId('DashboardToolbar');
    expect(favouriteElement).toBeInTheDocument();
  });
});
