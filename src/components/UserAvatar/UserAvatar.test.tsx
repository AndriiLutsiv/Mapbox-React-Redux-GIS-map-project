import { render, screen } from '@testing-library/react';
import UserAvatar from './UserAvatar';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from 'test-utils';

describe('UserAvatar component', () => {
    it('renders the component', () => {

        renderWithProviders(<MemoryRouter>
            <UserAvatar />
        </MemoryRouter>);

        const userAvatar = screen.getByAltText('user-avatar');

        expect(userAvatar).toBeInTheDocument();
    });
});
