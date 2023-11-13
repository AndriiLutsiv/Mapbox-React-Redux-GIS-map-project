import { urlFormat } from './urlFormat'; // Update this path

describe('urlFormat', () => {
  it('should return empty string for empty data', () => {
    const result = urlFormat({});
    expect(result).toBe('');
  });

  it('should format single key-value pair correctly', () => {
    const data = { key: 'value' };
    const result = urlFormat(data);
    expect(result).toBe('key=value');
  });

  it('should format multiple key-value pairs correctly', () => {
    const data = { key1: 'value1', key2: 'value2' };
    const result = urlFormat(data);
    expect(result).toBe('key1=value1&key2=value2');
  });

  it('should format array values correctly', () => {
    const data = { key: ['value1', 'value2'] };
    const result = urlFormat(data);
    expect(result).toBe('key=value1&key=value2');
  });

  it('should format multiple key-value pairs with array values correctly', () => {
    const data = { key1: 'value1', key2: ['value2', 'value3'] };
    const result = urlFormat(data);
    expect(result).toBe('key1=value1&key2=value2&key2=value3');
  });
});
