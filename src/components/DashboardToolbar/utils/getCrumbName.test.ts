import { getCrumbName } from './getCrumbName';

describe('getCrumbName', () => {
  it('returns "Areas" when index is 0', () => {
    expect(getCrumbName(0)).toBe('Helicopter View');
  });

  it('returns "Projects" when index is greater than 0', () => {
    expect(getCrumbName(1)).toBe('Projects');
    expect(getCrumbName(3)).toBe('Projects');
    expect(getCrumbName(100)).toBe('Projects');
  });
});
