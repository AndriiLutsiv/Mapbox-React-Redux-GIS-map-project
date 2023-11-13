import '@testing-library/jest-dom/extend-expect';
import { getArrayOfUniqueValues } from './arrayOfUniqueValues';

describe('getArrayOfUniqueValues', () => {
  it('should return an array of unique values', () => {
    const inputArray = [1, 2, 2, 3, 4, 4, 5];
    const uniqueArray = getArrayOfUniqueValues(inputArray);

    expect(uniqueArray).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return an empty array if input array is empty', () => {
    const inputArray: [] = [];
    const uniqueArray = getArrayOfUniqueValues(inputArray);

    expect(uniqueArray).toEqual([]);
  });

  it('should handle arrays with non-numeric values', () => {
    const inputArray = ['apple', 'banana', 'apple', 'orange', 'banana'];
    const uniqueArray = getArrayOfUniqueValues(inputArray);

    expect(uniqueArray).toEqual(['apple', 'banana', 'orange']);
  });

});
