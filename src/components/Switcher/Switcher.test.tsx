import { render, screen, fireEvent } from '@testing-library/react';
import { useTheme, Theme } from 'app/providers/ThemeProvider';
import Switcher from './Switcher';

jest.mock('app/providers/ThemeProvider');

describe('Switcher', () => {
  it('renders switcher with checked input when theme is DARK', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: Theme.DARK,
      toggleTheme: jest.fn(),
    });

    render(<Switcher />);

    const input = screen.getByRole('checkbox');
    expect(input).toBeInTheDocument();
    expect(input).toBeChecked();
  });

  it('calls toggleTheme function when input is changed', () => {
    const mockToggleTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: Theme.LIGHT,
      toggleTheme: mockToggleTheme,
    });

    render(<Switcher />);

    const input = screen.getByRole('checkbox');
    fireEvent.click(input);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    expect(input).not.toBeChecked();
  });
});
