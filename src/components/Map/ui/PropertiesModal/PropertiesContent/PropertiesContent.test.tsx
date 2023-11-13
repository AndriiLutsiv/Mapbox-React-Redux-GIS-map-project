import { render } from '@testing-library/react';
import PropertiesContent from './PropertiesContent';
import { useMap } from 'app/providers/MapProvider';

jest.mock('app/providers/MapProvider', () => ({
    useMap: jest.fn(),
}));

describe('PropertiesContent', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render keys and values properly', () => {
        (useMap as jest.Mock).mockReturnValue({
            propertyFeature: {
                properties: {
                    testProp1: 'testValue1',
                    testProp2: 'testValue2',
                },
            },
        });

        const { getByText } = render(<PropertiesContent />);

        expect(getByText('testProp1')).toBeInTheDocument();
        expect(getByText('testValue1')).toBeInTheDocument();
        expect(getByText('testProp2')).toBeInTheDocument();
        expect(getByText('testValue2')).toBeInTheDocument();
    });

    it('should not render object and array properties', () => {
        // Set the mock return value for useMap hook
        (useMap as jest.Mock).mockReturnValue({
            propertyFeature: {
                properties: {
                    testProp1: 'testValue1',
                    testProp2: 'testValue2',
                    testProp3: { someKey: 'someValue' },
                    testProp4: ['testItem', 'testItem'],
                },
            },
        });

        const { queryByText } = render(<PropertiesContent />);

        expect(queryByText('testProp3')).not.toBeInTheDocument();
        expect(queryByText('testProp4')).not.toBeInTheDocument();
    });

    it('should render nothing if propertyFeature is not available', () => {
        (useMap as jest.Mock).mockReturnValue({ propertyFeature: null });

        const { container } = render(<PropertiesContent />);

        expect(container.firstChild).toBeNull();
    });
});
