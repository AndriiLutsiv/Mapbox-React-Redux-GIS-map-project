import { render, screen } from '@testing-library/react';
import AuthGreeting from './AuthGreeting';

describe('AuthGreeting component', () => {
  it('renders the component', () => {
    const title = 'Log in to your account';
    const subtitle = 'Welcome back! Please enter your details.';

    render(<AuthGreeting title={title} subtitle={subtitle}/>);

    const titleElement = screen.getByText(title);
    const subtitleElement = screen.getByText(subtitle);

    expect(titleElement).toBeInTheDocument();
    expect(subtitleElement).toBeInTheDocument();
  });
});
