import { render, screen } from '@testing-library/react';
import FormCheckbox from './FormCheckbox';

describe('FormCheckbox component', () => {
  it('renders the component', () => {
    const text = 'Remember me';
    const checked = false;

    render(<FormCheckbox text={text} checked={checked} />);

    const textElement = screen.getByText(text);
    const checkboxElement = screen.getByRole('checkbox');

    expect(textElement).toBeInTheDocument();
    expect(checkboxElement).toBeInTheDocument();
  });

  it('renders unchecked checkbox', () => {
    const text = 'Remember me';

    render(<FormCheckbox text={text} checked={true} />);

    const updatedCheckboxElement = screen.getByRole('checkbox');
    expect(updatedCheckboxElement).toBeChecked();
  });

  it('redners unchecked checkox', () => {
    const text = 'Remember me';

    render(<FormCheckbox text={text} checked={false} />);

    const updatedCheckboxElement = screen.getByRole('checkbox');
    expect(updatedCheckboxElement).not.toBeChecked();
  })
});
