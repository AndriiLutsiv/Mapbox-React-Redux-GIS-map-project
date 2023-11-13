import { fireEvent, screen, waitFor } from '@testing-library/react';
import SignIn from './SignIn';
import { renderWithProviders } from 'test-utils';
import { tokenAPI } from 'services/TokenService';
import { data } from 'mock/api/oAuth';
import { MemoryRouter } from 'react-router-dom';

// Mock response for sign in data
const mockSignInData = data

const mockSetTokenFn = jest.fn();

jest.mock("hooks/useAuth", () => ({
    useAuth: () => ({ setToken: mockSetTokenFn, token: '12312312' }),
}));

describe('SignIn component', () => {
    it('renders the component', () => {
        renderWithProviders(
            <MemoryRouter><SignIn /></MemoryRouter>
        );
        expect(screen.getByTestId('SignIn')).toBeInTheDocument();
    });

    it('updates fields on change, submits the form, setsToken', async () => {
        const mockFetchLoginToken = jest.fn().mockResolvedValue({ data: mockSignInData });
        jest.spyOn(tokenAPI, 'useFetchLoginTokenMutation').mockReturnValue([
            mockFetchLoginToken,
            { data: mockSignInData, error: null, isLoading: false },
        ] as any);

        const email = { type: "text", name: "email", label: "Email", placeholder: "Enter your email" };
        const password = { type: "password", name: "password", label: "Password", placeholder: "Enter your password" };
        renderWithProviders(
            <MemoryRouter><SignIn /></MemoryRouter>
        )

        const emailValue = 'test@gmail.com';
        const passwordValue = '123Test!@#';

        fireEvent.change(screen.getByPlaceholderText(email.placeholder), { target: { value: emailValue } });
        fireEvent.change(screen.getByPlaceholderText(password.placeholder), { target: { value: passwordValue } });

        expect(screen.getByPlaceholderText(email.placeholder)).toHaveValue(emailValue);
        expect(screen.getByPlaceholderText(password.placeholder)).toHaveValue(passwordValue);

        // Submit the form
        const submitButton = screen.getByText(/sign in/i);
        fireEvent.click(submitButton);

        //expect(mockSetTokenFn).toHaveBeenCalledWith('dummy_token');//mockSignUpData.access_token
        // Wait for the token API call to resolve
        await waitFor(() => {
            const body = new URLSearchParams({
                username: emailValue,
                password: passwordValue,
                scope: 'all'
            })
            expect(mockFetchLoginToken).toHaveBeenCalledWith(body);
            expect(mockSetTokenFn).toHaveBeenCalledWith(mockSignInData.access_token);

        });
    });
});
