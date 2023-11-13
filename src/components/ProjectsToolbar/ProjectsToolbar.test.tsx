import { render, screen } from '@testing-library/react';
import ProjectsToolbar from './ProjectsToolbar';
import { MemoryRouter } from 'react-router-dom';
import { MapProvider } from 'app/providers/MapProvider';
import { renderWithProviders } from 'test-utils';

describe('ProjectsToolbar', () => {
  it('renders ProjectsToolbar', () => {
    renderWithProviders(<MemoryRouter><MapProvider><ProjectsToolbar /></MapProvider></MemoryRouter>);

    const favouriteElement = screen.getByTestId('ProjectsToolbar');
    expect(favouriteElement).toBeInTheDocument();
  });
});
