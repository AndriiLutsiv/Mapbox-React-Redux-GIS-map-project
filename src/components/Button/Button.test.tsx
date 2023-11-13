import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button />);
  });

  it('displays the correct text inside the button', () => {
    render(<Button>Click me!</Button>);
    
    expect(screen.getByText('Click me!')).toBeInTheDocument();
  });

  it('calls the onClick function when clicked', () => {
    const onClickMock = jest.fn();
    render(<Button onClick={onClickMock}>Click me!</Button>);
    
    fireEvent.click(screen.getByText('Click me!'));
    expect(onClickMock).toHaveBeenCalled();
  });

  it('disables the button when disabled prop is true', () => {
    render(<Button disabled>Click me!</Button>);

    expect(screen.getByText('Click me!')).toBeDisabled();
  });

  it('applies active class when active prop is true', () => {
    render(<Button active>Click me!</Button>);

    expect(screen.getByText('Click me!')).toHaveClass('active');
  });

  it('does not apply active class when active prop is false', () => {
    render(<Button active={false}>Click me!</Button>);

    expect(screen.getByText('Click me!')).not.toHaveClass('active');
  });

  it('renders the icon when provided', () => {
    const mockIcon = <span data-testid="mock-icon">Icon</span>;
    render(<Button icon={mockIcon}>Click me!</Button>);

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });
});
