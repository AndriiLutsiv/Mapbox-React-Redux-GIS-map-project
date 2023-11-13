import { render } from '@testing-library/react';
import { filterArray } from './filterArrayWithParams'; // Replace with the correct path

describe('filterArray', () => {
  const testData = [
    { id: 1, description: 'Apple', areasId: 1 },
    { id: 2, description: 'Banana', areasId: 2 },
    { id: 3, description: 'Orange', areasId: 2 },
  ];

  it('filters by searchValue', () => {
    const searchValue = { str: 'apple', key: 'description' };
    const result = filterArray(testData, searchValue);

    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Apple');
  });

  it('filters by areaId', () => {
    const areaId = [1];
    const result = filterArray(testData, null, areaId);

    expect(result).toHaveLength(2);
    expect(result[0].description).toBe('Apple');
    expect(result[1].description).toBe('Orange');
  });

  it('filters by both searchValue and areaId', () => {
    const searchValue = { str: 'b', key: 'description' };
    const areaId = [2];
    const result = filterArray(testData, searchValue, areaId);

    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Banana');
  });

  it('returns the original array when no filters are applied', () => {
    const result = filterArray(testData);

    expect(result).toHaveLength(3);
    expect(result).toEqual(testData);
  });
});
