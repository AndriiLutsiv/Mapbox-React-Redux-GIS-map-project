import { render, fireEvent, screen } from '@testing-library/react';
import Tab from './Tab';

const sampleConfig = [
    {
        label: {
            icon: <span>Icon 1</span>,
            text: 'Tab 1',
        },
        key: 'tab1',
        children: <div>Content 1</div>,
    },
    {
        label: {
            icon: <span>Icon 2</span>,
            text: 'Tab 2',
        },
        key: 'tab2',
        children: <div>Content 2</div>,
    },
];

describe('Tab component', () => {
    it('renders the default tab content', () => {
        render(<Tab config={sampleConfig} defaultValue="tab1" />);

        expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('switches tab content when clicking on a tab', () => {
        render(<Tab config={sampleConfig} defaultValue="tab1" />);

        fireEvent.click(screen.getByText('Tab 2'));
        expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('updates the active tab state', () => {
        const { rerender } = render(
            <Tab config={sampleConfig} defaultValue="tab1" />
        );

        fireEvent.click(screen.getByText('Tab 2'));
        rerender(<Tab config={sampleConfig} defaultValue="tab1" />);
        expect(screen.getByText('Tab 2')).toHaveClass('active');
    });
});
