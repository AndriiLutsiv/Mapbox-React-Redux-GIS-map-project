import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NavItem from './NavItem';

describe('NavItem', () => {
    it('renders pointerText on mouse over and hides it on mouse out', () => {
        const pointerText = 'Pointer Text';
        render(
            <MemoryRouter initialEntries={['/']} initialIndex={0}>
                <NavItem link="/example" pointerText={pointerText}>
                    Icon
                </NavItem>
            </MemoryRouter>
        );

        const navItem = screen.getByText('Icon');

        expect(navItem).toBeInTheDocument();

        fireEvent.mouseOver(navItem);
        expect(screen.getByText(pointerText)).toBeInTheDocument();

        fireEvent.mouseOut(navItem);
        expect(screen.queryByText(pointerText)).not.toBeInTheDocument();
    });

    it('has class "active" when pathname matches the link', () => {
        const pointerText = 'Pointer Text';

        render(
            <MemoryRouter initialEntries={['/example']} initialIndex={0}>
                <Routes>
                    <Route path="/example" element={<div>Example Component</div>} />
                </Routes>
                <NavItem link="/example" pointerText={pointerText}>
                    Icon
                </NavItem>
            </MemoryRouter>
        );

        const navItem = screen.getByText('Icon').parentElement;
        expect(navItem).toHaveClass('active');
    });

    it('does not have class "active" when pathname does not match the link', () => {
        const pointerText = 'Pointer Text';

        render(
            <MemoryRouter initialEntries={['/']} initialIndex={0}>
                <NavItem link="/example" pointerText={pointerText}>
                    Icon
                </NavItem>
            </MemoryRouter>
        );

        const navItem = screen.getByText('Icon').parentElement;
        expect(navItem).not.toHaveClass('active');
    });
});
