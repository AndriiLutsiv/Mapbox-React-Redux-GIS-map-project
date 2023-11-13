import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardSettings from './CardSettings';

describe('CardSettings', () => {
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockProps = {
        editHandler: mockEdit,
        deleteHandler: mockDelete,
        editText: 'Edit'
    };

    it('renders the settings button', () => {
        render(<CardSettings {...mockProps} />);
        const settingsButton = screen.getByTestId('CardSettings');
        expect(settingsButton).toBeInTheDocument();
    });

    it('opens the context menu when settings button is clicked', () => {
        render(<CardSettings {...mockProps} />);
        const settingsButton = screen.getByTestId('CardSettings');
        fireEvent.click(settingsButton);

        const contextMenu = screen.getByTestId('context-menu');
        expect(contextMenu).toBeInTheDocument();
    });

    it('calls rename function when Rename menu item is clicked', () => {
        render(<CardSettings {...mockProps} />);
        const settingsButton = screen.getByTestId('CardSettings');
        fireEvent.click(settingsButton);

        const renameMenuItem = screen.getByTestId('card-settings-edit-text');
        fireEvent.click(renameMenuItem);

        expect(mockEdit).toHaveBeenCalled();
    });

    it('closes the context menu when outside is clicked', () => {
        render(<div>
            <CardSettings {...mockProps} />
            <div data-testid="outside-area" />
        </div>);
        const settingsButton = screen.getByTestId('CardSettings');
        fireEvent.click(settingsButton);

        const outsideArea = screen.getByTestId('outside-area');
        fireEvent.mouseDown(outsideArea);
        fireEvent.mouseUp(outsideArea);

        const contextMenu = screen.queryByTestId('context-menu');
        expect(contextMenu).not.toBeInTheDocument();
    });

});
