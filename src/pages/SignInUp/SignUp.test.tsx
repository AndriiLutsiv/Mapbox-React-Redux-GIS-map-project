import { fireEvent, screen, waitFor } from '@testing-library/react';
import SignUp from './SignUp';
import { renderWithProviders } from 'test-utils';
import { useParams, useLocation, MemoryRouter } from 'react-router-dom';
import { userAPI } from 'services/UserService';
import { data } from 'mock/api/user';

// Mock response for sign up data
const mockSignUpData = data;

const mockSetTokenFn = jest.fn();

jest.mock("hooks/useAuth", () => ({
    useAuth: () => ({ setToken: mockSetTokenFn, token: '12312312' }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useParams: jest.fn()
}));


describe('SignUp component', () => {
    const mockLocation = { pathname: '/signup' };

    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({ id: 'dummy_token' })
    });

    it('renders the component', () => {
        renderWithProviders(
            <MemoryRouter><SignUp /></MemoryRouter>
        );
        expect(screen.getByTestId('SignUp')).toBeInTheDocument();
    });

    it('updates fields on change, submits the form', async () => {
        const mockUpdateScenario = jest.fn().mockResolvedValue({ data: mockSignUpData });

        jest.spyOn(userAPI, 'useSignupUserMutation').mockReturnValue([
            mockUpdateScenario,
            { data: mockSignUpData, error: null, isLoading: false },
        ] as any);

        const name = { type: "text", name: "name", label: "Name*", placeholder: "Enter your name" };
        const email = { type: "email", name: "email", label: "Email*", placeholder: "Enter your email" };
        const password = { type: "password", name: "password", label: "Password", placeholder: "Create a password" };
        renderWithProviders(
            <MemoryRouter><SignUp /></MemoryRouter>
        )

        const nameValue = 'SomeName'
        const emailValue = 'test@gmail.com';
        const passwordValue = '123Test!@#';

        fireEvent.change(screen.getByPlaceholderText(name.placeholder), { target: { value: nameValue } });
        fireEvent.change(screen.getByPlaceholderText(email.placeholder), { target: { value: emailValue } });
        fireEvent.change(screen.getByPlaceholderText(password.placeholder), { target: { value: passwordValue } });

        expect(screen.getByPlaceholderText(name.placeholder)).toHaveValue(nameValue);
        expect(screen.getByPlaceholderText(email.placeholder)).toHaveValue(emailValue);
        expect(screen.getByPlaceholderText(password.placeholder)).toHaveValue(passwordValue);

        // Submit the form
        const submitButton = screen.getByText(/get started/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockUpdateScenario).toHaveBeenCalledWith({
                username: nameValue,
                email: emailValue,
                password: passwordValue,
                token: 'dummy_token'
            });
        });
    });
});
