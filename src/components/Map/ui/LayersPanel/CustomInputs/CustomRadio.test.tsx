import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import CustomRadio from './CustomRadio';

describe('CustomRadio Component', () => {
  const defaultProps = {
    label: 'Option 1',
    name: 'radioGroup',
    value: 'option1',
    isChecked: false,
    handleRadioChange: jest.fn(),
  };

  it('renders with the correct label', () => {
    render(<CustomRadio {...defaultProps} />);
    
    const radioLabel = screen.getByTestId('Custom-radio-label');

    expect(radioLabel).toBeInTheDocument();
    expect(radioLabel).toHaveTextContent('Option 1');
  });

  it('renders the radio input element', () => {
    render(<CustomRadio {...defaultProps} />);
    
    const radioInput = screen.getByTestId('Custom-radio-input');

    expect(radioInput).toBeInTheDocument();
    expect(radioInput).toHaveAttribute('type', 'radio');
    expect(radioInput).toHaveAttribute('name', 'radioGroup');
    expect(radioInput).toHaveAttribute('value', 'option1');
    expect(radioInput).not.toBeChecked();
  });
  it('handles onChange event', () => {
    render(<CustomRadio {...defaultProps} />);
    const radioInput = screen.getByTestId('Custom-radio-input');

    fireEvent.click(radioInput);

    expect(defaultProps.handleRadioChange).toHaveBeenCalled();
  });

  it('renders with a checked state', () => {
    render(<CustomRadio {...defaultProps} isChecked />);
    const radioInput = screen.getByTestId('Custom-radio-input');

    expect(radioInput).toBeChecked();
  });


});
