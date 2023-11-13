import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomCheckbox from './CustomCheckbox';

describe('CustomCheckbox Component', () => {
  const defaultProps = {
    label: 'Checkbox Label',
    value: 'checkboxValue',
    isChecked: false,
    onChange: jest.fn(),
  };

  it('renders with the correct label', () => {
    render(<CustomCheckbox {...defaultProps} />);
    const checkboxLabel = screen.getByTestId('Custom-checkbox-label');

    expect(checkboxLabel).toBeInTheDocument();
    expect(checkboxLabel).toHaveTextContent('Checkbox Label');
  });

  it('renders the checkbox input element', () => {
    render(<CustomCheckbox {...defaultProps} />);
    const checkboxInput = screen.getByTestId('Custom-checkbox-input');

    expect(checkboxInput).toBeInTheDocument();
    expect(checkboxInput).toHaveAttribute('type', 'checkbox');
    expect(checkboxInput).toHaveAttribute('value', 'checkboxValue');
    expect(checkboxInput).not.toBeChecked();
  });

  it('handles onChange event', () => {
    render(<CustomCheckbox {...defaultProps} isChecked/>);
    const checkboxInput = screen.getByTestId('Custom-checkbox-input');

    fireEvent.click(checkboxInput);

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('renders with a checked state', () => {
    render(<CustomCheckbox {...defaultProps} isChecked/>);
    const checkboxInput = screen.getByTestId('Custom-checkbox-input');

    expect(checkboxInput).toBeChecked();
  });
});
