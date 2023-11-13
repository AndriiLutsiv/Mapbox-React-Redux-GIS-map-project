import { getCrumbName } from './getCrumbName';

describe('getCrumbName', () => {
  it('returns "Areas" when index is 0', () => {
    expect(getCrumbName(0)).toBe('Areas');
  });

  it('returns "Scenarios" when index is 1', () => {
    expect(getCrumbName(1)).toBe('Scenarios');
  });

  it('returns "Projects" when index is greater than 1', () => {
    expect(getCrumbName(2)).toBe('Projects');
    expect(getCrumbName(3)).toBe('Projects');
    expect(getCrumbName(100)).toBe('Projects');
  });
});
