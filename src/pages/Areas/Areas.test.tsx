import { waitFor, screen } from '@testing-library/react';
import Areas from './Areas';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { renderWithProviders } from 'test-utils';
import { areaAPI } from 'services/AreaService';
import { data } from 'mock/api/areas';

// Mock response for area data
const mockAreaData = data;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('hooks/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({ token: 'dummyToken' })
}));

describe('Areas', () => {
  const mockLocation = { pathname: '/areas' };

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (useAuth as jest.Mock).mockReturnValue({ token: 'dummyToken' });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading spinner while fetching areas', async () => {
    jest.spyOn(areaAPI, 'useGetAreasQuery').mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    } as any);

    renderWithProviders(<MemoryRouter><Areas /></MemoryRouter>);

    expect(screen.getByTestId('Spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('Areas')).not.toBeInTheDocument();
  });

  it('renders list of areas', async () => {
    jest.spyOn(areaAPI, 'useGetAreasQuery').mockReturnValue({
      data: mockAreaData,
      error: null,
      isLoading: false,
    } as any);

    renderWithProviders(<MemoryRouter><Areas /></MemoryRouter>);

    const areas = await waitFor(() => screen.findAllByText("areas_name_test"));
    expect(areas).toHaveLength(mockAreaData.length);
    expect(screen.queryByTestId('Spinner')).not.toBeInTheDocument();
  })
});
