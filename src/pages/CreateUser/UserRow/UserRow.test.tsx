import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserRow from './UserRow';
import { renderWithProviders } from 'test-utils';
import { userAPI } from 'services/UserService';
import { updateUserData } from 'mock/api/user';
const mockUnwrap = jest.fn();

const mockUser = {
    username: "JohnDoe",
    email: "johndoe@example.com",
    company_uuid: 'company_uuid',
    uuid: 'userUUid'
};

jest.mock('hooks/useAuth', () => ({
    useAuth: () => ({
        token: 'dummy_token',
    }),
}));

describe('UserRow', () => {
    beforeEach(() => {
        mockUnwrap.mockReset();

        jest.spyOn(userAPI, 'useCreateUserMutation').mockReturnValue([
            jest.fn().mockResolvedValue({}),
            { error: null, isLoading: false },
        ] as any);

        jest.spyOn(userAPI, 'useUpdateUserMutation').mockReturnValue([
            jest.fn().mockResolvedValue({}),
            { error: null, isLoading: false },
        ] as any);

        jest.spyOn(userAPI, 'useDeleteUserMutation').mockReturnValue([
            jest.fn().mockResolvedValue({}),
            { error: null, isLoading: false },
        ] as any);
    });

    it('renders UserRow component', () => {
        renderWithProviders(<MemoryRouter><UserRow user={mockUser} /></MemoryRouter>);

        expect(screen.getByTestId('UserRow')).toBeInTheDocument();
    });

    it('renders Save and Cancel and does not render Edit and Delete buttons when createRow is true', () => {
        renderWithProviders(<MemoryRouter><UserRow user={mockUser} createRow={true} /></MemoryRouter>);

        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('does not render Save and Cancel and renders Edit and Delete buttons buttons when createRow is false', () => {
        renderWithProviders(<MemoryRouter><UserRow user={mockUser} createRow={false} /></MemoryRouter>);

        expect(screen.queryByText('Save')).not.toBeInTheDocument();
        expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('calls setCreateRow with false on Cancel button click', () => {
        const setCreateRow = jest.fn();

        renderWithProviders(
            <MemoryRouter>
                <UserRow user={mockUser} createRow={true} setCreateRow={setCreateRow} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Cancel'));
        expect(setCreateRow).toHaveBeenCalledWith(false);
    });

    it('updates fields on change, calls handleSaveEdit on Save button click', async () => {
        const mockMutationFunction = jest.fn();

        jest.spyOn(userAPI, 'useUpdateUserMutation').mockReturnValue([
            mockMutationFunction.mockReturnValue({
                unwrap: mockUnwrap.mockResolvedValue({ data: updateUserData }),
            }),
            { data: updateUserData, error: null, isLoading: false },
        ] as any);

        const username = { type: "text", name: "username", label: "User name*", placeholder: "Enter username" };
        const userEmail = { type: "email", name: "userEmail", label: "User email*", placeholder: "Enter user email" };
        const userPassword = { type: "password", name: "userPassword", label: "User password", placeholder: "Create user password" };

        const userNameValue = 'TestName';
        const userEmailValue = 'test@gmail.com';
        const userPasswordValue = '123Test!@#';

        renderWithProviders(
            <MemoryRouter>
                <UserRow user={mockUser} createRow={false} />
            </MemoryRouter>
        );

        //triggering edit state
        fireEvent.click(screen.getByText(/edit/i));

        //testing onchange
        fireEvent.change(screen.getByPlaceholderText(username.placeholder), { target: { value: userNameValue } });
        fireEvent.change(screen.getByPlaceholderText(userEmail.placeholder), { target: { value: userEmailValue } });
        fireEvent.change(screen.getByPlaceholderText(userPassword.placeholder), { target: { value: userPasswordValue } });

        expect(screen.getByPlaceholderText(username.placeholder)).toHaveValue(userNameValue);
        expect(screen.getByPlaceholderText(userEmail.placeholder)).toHaveValue(userEmailValue);
        expect(screen.getByPlaceholderText(userPassword.placeholder)).toHaveValue(userPasswordValue);

        //testing save after edit
        const saveButton = screen.getByText(/save/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            const preparedData = {
                uuid: mockUser.uuid,
                username: userNameValue,
                email: userEmailValue,
                password: userPasswordValue,
            }
            expect(mockMutationFunction).toHaveBeenCalledWith(preparedData);
            expect(mockUnwrap).toHaveBeenCalled();
        });
    });

    it('calls handleDelete on Delete button click', async () => {
        const mockDeleteUser = jest.fn().mockResolvedValue({});

        jest.spyOn(userAPI, 'useDeleteUserMutation').mockReturnValue([
            mockDeleteUser,
            { error: null, isLoading: false },
        ] as any);

        renderWithProviders(
            <MemoryRouter>
                <UserRow user={mockUser} createRow={false} />
            </MemoryRouter>
        );

        //testing delete
        const deleteButton = screen.getByText(/delete/i);
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const preparedData = {
                user_uuid: mockUser.uuid,
                token: 'dummy_token',
            };
            expect(mockDeleteUser).toHaveBeenCalledWith(preparedData);
        });
    });

    it('calls handleSaveCreate on Save button click', async () => {
        const mockCreateUser = jest.fn();

        jest.spyOn(userAPI, 'useCreateUserMutation').mockReturnValue([
            mockCreateUser.mockReturnValue({
                unwrap: mockUnwrap.mockResolvedValue({ data: updateUserData }),
            }),
            { data: updateUserData, error: null, isLoading: false },
        ] as any);

        const username = { type: "text", name: "username", label: "User name*", placeholder: "Enter username" };
        const userEmail = { type: "email", name: "userEmail", label: "User email*", placeholder: "Enter user email" };
        const userPassword = { type: "password", name: "userPassword", label: "User password", placeholder: "Create user password" };

        const userNameValue = 'TestName';
        const userEmailValue = 'test@gmail.com';
        const userPasswordValue = '123Test!@#';

        renderWithProviders(
            <MemoryRouter>
                <UserRow user={mockUser} createRow={true} />
            </MemoryRouter>
        );

        // testing onchange
        fireEvent.change(screen.getByPlaceholderText(username.placeholder), { target: { value: userNameValue } });
        fireEvent.change(screen.getByPlaceholderText(userEmail.placeholder), { target: { value: userEmailValue } });
        fireEvent.change(screen.getByPlaceholderText(userPassword.placeholder), { target: { value: userPasswordValue } });

        expect(screen.getByPlaceholderText(username.placeholder)).toHaveValue(userNameValue);
        expect(screen.getByPlaceholderText(userEmail.placeholder)).toHaveValue(userEmailValue);
        expect(screen.getByPlaceholderText(userPassword.placeholder)).toHaveValue(userPasswordValue);

        // testing save after creating a new user
        const saveButton = screen.getByText(/save/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            const preparedData = {
                username: userNameValue,
                email: userEmailValue,
                password: userPasswordValue,
            }
            expect(mockCreateUser).toHaveBeenCalledWith(preparedData);
            expect(mockUnwrap).toHaveBeenCalled();
        });
    });
});
