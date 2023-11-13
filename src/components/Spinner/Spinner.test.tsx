import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner component', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<Spinner />);
    
    const spinnerElement = getByTestId('Spinner');
    
    expect(spinnerElement).toBeInTheDocument();
  });
});
