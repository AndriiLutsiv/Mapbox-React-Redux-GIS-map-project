import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { LabelText } from './LabelText';
import { CustomCheckbox } from '../CustomInputs';

// Mocking the CustomCheckbox component
jest.mock('../CustomInputs', () => ({
  CustomCheckbox: jest.fn(() => null),
}));

describe('LabelText component', () => {
  it('renders with correct label and checkbox', () => {
    const labelVisibility = true;
    const setLabelVisibility = jest.fn();

    render(
      <LabelText labelVisibility={labelVisibility} setLabelVisibility={setLabelVisibility} />
    );

    expect(screen.getByTestId('label-text')).toBeInTheDocument();

    expect(CustomCheckbox).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Show labels',
        value: 'name',
        isChecked: labelVisibility,
        onChange: expect.any(Function),
      }),
      {}
    );
  });

});
