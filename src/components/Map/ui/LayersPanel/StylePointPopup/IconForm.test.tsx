import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { IconForm } from './IconForm';

describe('IconForm component', () => {
  it('renders with the correct label and input', () => {
    const onChange = jest.fn();

    render(<IconForm onChange={onChange} />);

    expect(screen.getByText('Upload custom shape')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload custom shape')).toBeInTheDocument();
  });

  it('calls onChange function when file input changes', () => {
    const onChange = jest.fn();

   render(<IconForm onChange={onChange} />);

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Upload custom shape'), {
      target: { files: [file] },
    });

    expect(onChange).toHaveBeenCalled();
  });
});
