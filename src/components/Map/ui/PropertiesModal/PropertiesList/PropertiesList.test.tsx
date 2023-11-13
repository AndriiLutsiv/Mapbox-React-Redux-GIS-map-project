import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertiesList from './PropertiesList'; // Update the path as needed
import { useMap } from 'app/providers/MapProvider';

// Mocking the MapProvider
jest.mock('app/providers/MapProvider', () => ({
  useMap: jest.fn(),
}));

describe('PropertiesList Component', () => {
  const mockCloseList = jest.fn();
  const mockSetPropertyFeature = jest.fn();
  const featureKeyMap = { 'uuid-1': 'key-1', 'uuid-2': 'key-2' };

  beforeEach(() => {
    // Resetting mocks before each test
    mockCloseList.mockReset();
    mockSetPropertyFeature.mockReset();
    (useMap as jest.Mock).mockReturnValue({
      setPropertyFeature: mockSetPropertyFeature,
      featureKeyMap,
    });
  });

  it('should render the list of properties', () => {
    const listItems = [
      { layer_type: 'Type 1', properties: { uuid: 'uuid-1' } },
      { layer_type: 'Type 2', properties: { uuid: 'uuid-2' } },
    ] as any;
    
    render(<PropertiesList showList={true} listItems={listItems} closeList={mockCloseList} />);
    
    expect(screen.getByTestId('PropertiesList')).toBeInTheDocument();
  });

  it('should not render the list when there are no items', () => {
    render(<PropertiesList showList={true} listItems={[]} closeList={mockCloseList} />);
    
    expect(screen.queryByTestId('PropertiesList')).toBeNull();
  });

  it('should apply scrollable style when there are 10 or more items', () => {
    const listItems = new Array(10).fill({ layer_type: 'Type', properties: { uuid: 'uuid' } });
    const { container } = render(<PropertiesList showList={true} listItems={listItems} closeList={mockCloseList} />);
    
    expect(container.firstChild).toHaveClass('scrollable');
  });

  it('should apply custom className if provided', () => {
    const className = 'customClass';
    const { container } = render(<PropertiesList showList={true} listItems={[{ layer_type: 'Type 1', properties: { uuid: 'uuid-1' } }] as any} closeList={mockCloseList} className={className} />);
    
    expect(container.firstChild).toHaveClass(className);
  });
});
