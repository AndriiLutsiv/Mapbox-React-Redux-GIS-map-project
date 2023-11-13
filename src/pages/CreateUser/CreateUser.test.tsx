import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from 'test-utils';
import CreateUser from './CreateUser';
import { userAPI } from '../../services/UserService';
import { UserRow } from './UserRow';
import { useAuth } from 'hooks/useAuth';
import { getUsersData } from 'mock/api/user';

jest.mock('./UserRow', () => ({
    UserRow: jest.fn(({ user }) => <div>{user.username}</div>),
}));

jest.mock('hooks/useAuth', () => ({
    useAuth: jest.fn().mockReturnValue({ token: 'dummyToken' }),
}));

describe('CreateUser', () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'dummyToken' });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading spinner while fetching users', async () => {
        jest.spyOn(userAPI, 'useGetUsersQuery').mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        } as any);

        renderWithProviders(<MemoryRouter><CreateUser /></MemoryRouter>);

        expect(screen.getByTestId('Spinner')).toBeInTheDocument();
        expect(screen.queryByTestId('CreateUser')).not.toBeInTheDocument();
    });

    it('renders CreateUser component', async () => {
        jest.spyOn(userAPI, 'useGetUsersQuery').mockReturnValue({
            data: getUsersData,
            error: null,
            isLoading: false,
        } as any);

        renderWithProviders(
            <MemoryRouter>
                <CreateUser />
            </MemoryRouter>
        );

        const createUserElement = await screen.findByTestId('CreateUser');
        expect(createUserElement).toBeInTheDocument();
    });

    it('renders UserRow on "Add user" button click', () => {
        jest.spyOn(userAPI, 'useGetUsersQuery').mockReturnValue({
            data: getUsersData,
            error: null,
            isLoading: false,
        } as any);

        renderWithProviders(
            <MemoryRouter>
                <CreateUser />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(/Add user/i));

        expect(UserRow).toHaveBeenCalledWith(
            expect.objectContaining({ createRow: true }),
            expect.anything(),
        );
    });

    it('renders "Generate invite token" button when tokenLink is empty', () => {
        jest.spyOn(userAPI, 'useGetUsersQuery').mockReturnValue({
            data: getUsersData,
            error: null,
            isLoading: false,
        } as any);
        renderWithProviders(
          <MemoryRouter>
            <CreateUser />
          </MemoryRouter>
        );
        
        const generateInviteButton = screen.getByText(/Generate invite token/i);
        expect(generateInviteButton).toBeInTheDocument();
      }); 
});
