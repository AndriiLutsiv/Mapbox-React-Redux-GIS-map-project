import React from 'react';
import { render } from '@testing-library/react';
import PropertiesModal from './PropertiesModal';
import { MapProvider } from 'app/providers/MapProvider';

describe('PropertiesModal', () => {

    it('should render without crashing', () => {
        const { getByTestId } = render(<MapProvider><PropertiesModal /></MapProvider>);

        const modalElement = getByTestId('PropertiesModal');

        expect(modalElement).toBeInTheDocument();
    });
});
