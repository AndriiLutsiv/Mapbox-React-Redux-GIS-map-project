import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuth } from 'hooks/useAuth';

jest.mock('hooks/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({ token: 'dummyToken' }),
}));

describe('Navigation', () => {
  it('renders Navigation when token exists', () => {
    (useAuth as jest.Mock).mockReturnValue({ token: 'dummyToken' });

    const { queryByTestId } = render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const navigationElement = queryByTestId('Navigation');

    expect(navigationElement).toBeInTheDocument();
  });

  it('does not render Navigation when token does not exist', () => {
    (useAuth as jest.Mock).mockReturnValue({ token: '' });

    const { queryByTestId } = render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const navigationElement = queryByTestId('Navigation');

    expect(navigationElement).not.toBeInTheDocument();
  });
});
