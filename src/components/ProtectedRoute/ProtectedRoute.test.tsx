import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import '@testing-library/jest-dom';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('services/UserService', () => ({
  userAPI: {
    useGetCurrentUserQuery: jest.fn(),
  },
}));

describe('ProtectedRoute', () => {
  const MockComponent = () => <div>Protected Content</div>;
  const token = 'test-token';

  beforeEach(() => {
    require('../../hooks/useAuth').useAuth.mockReturnValue({ token });
  });

  test('renders spinner when loading', () => {
    require('services/UserService').userAPI.useGetCurrentUserQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <MockComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('Spinner')).toBeInTheDocument();
  });

  test('redirects to /404 if user is not superuser', () => {
    require('services/UserService').userAPI.useGetCurrentUserQuery.mockReturnValue({
      data: { is_superuser: false },
      error: null,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <MockComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/404" element={<div>Not Found</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  test('renders children if user is superuser', () => {
    require('services/UserService').userAPI.useGetCurrentUserQuery.mockReturnValue({
      data: { is_superuser: true },
      error: null,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <MockComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
