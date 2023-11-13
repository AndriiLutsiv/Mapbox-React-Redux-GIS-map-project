import { render, screen } from '@testing-library/react';
import { tagRender } from './TagRender';

describe('tagRender', () => {
  it('renders the tag with correct label and color', () => {
    const props = {
      label: 'Test Tag',
      value: 'blue',
      closable: true,
      onClose: jest.fn(),
    };

    render(tagRender(props));

    const tag = screen.getByTestId('TagRender');
    expect(tag).toHaveTextContent('Test Tag');
  });
});
