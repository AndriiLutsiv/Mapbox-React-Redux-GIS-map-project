import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BreadCrumbs from './BreadCrumbs';

describe('BreadCrumbs', () => {
  it('renders breadcrumbs correctly', () => {
    const mockLocation = {
      pathname: '/areas',
    };

    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: jest.fn().mockReturnValue(mockLocation),
    }));

    render(
      <BrowserRouter>
        <BreadCrumbs />
      </BrowserRouter>
    );

    const breadcrumbs = screen.getByTestId('breadCrumbs');
    expect(breadcrumbs).toBeInTheDocument();

    const breadcrumbsLength = mockLocation.pathname.split('/').filter(segment => segment !== '');
    expect(breadcrumbsLength.length).toBe(1);
  });
});
