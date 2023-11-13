import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from './FormInput';

describe('FormInput', () => {
    it('renders label when hideLabel is false', () => {
        const stateField = { name: 'name', value: '', isValid: true };
        const field = { type: 'text', name: 'name', label: 'Name', placeholder: 'Enter your name' };

        const { getByText } = render(
            <FormInput
                stateField={stateField}
                field={field}
                onChange={() => { }}
                onFocus={() => { }}
                onBlur={() => { }}
                hideLabel={false}
            />
        );

        const labelElement = getByText('Name');
        expect(labelElement).toBeInTheDocument();
    });

    it('does not render label when hideLabel is true', () => {
        const stateField = { name: 'name', value: '', isValid: true };
        const field = { type: 'text', name: 'name', label: 'Name', placeholder: 'Enter your name' };
        const { queryByText } = render(
            <FormInput
                stateField={stateField}
                field={field}
                onChange={() => { }}
                onFocus={() => { }}
                onBlur={() => { }}
                hideLabel={true}
            />
        );
        const labelElement = queryByText('Name');
        expect(labelElement).not.toBeInTheDocument();
    });

    it('renders errorText when field is invalid', () => {
        const stateField = { name: 'name', value: '', isValid: false, errorText: 'ErrorText' };
        const field = { type: 'text', name: 'name', label: 'Name', placeholder: 'Enter your name' };

        const { queryByText } = render(
            <FormInput
                stateField={stateField}
                field={field}
                onChange={() => { }}
                onFocus={() => { }}
                onBlur={() => { }}
                hideLabel={false}
            />
        );

        const errorElement = queryByText(stateField.errorText);
        expect(errorElement).toBeInTheDocument();
    });

    it('doesn`t render errorText when field is valid', () => {
        const stateField = { name: 'name', value: '', isValid: true, errorText: 'ErrorText' };
        const field = { type: 'text', name: 'name', label: 'Name', placeholder: 'Enter your name' };

        const { queryByText } = render(
            <FormInput
                stateField={stateField}
                field={field}
                onChange={() => { }}
                onFocus={() => { }}
                onBlur={() => { }}
                hideLabel={false}
            />
        );

        const errorElement = queryByText(stateField.errorText);
        expect(errorElement).not.toBeInTheDocument();
    });

    it('should focus input when clicked and blur when onBlur occurs', () => {
        const stateField = { name: 'name', value: '', isValid: true };
        const field = { type: 'text', name: 'name', label: 'Name', placeholder: 'Enter your name' };

        const onFocusMock = jest.fn();
        const onBlurMock = jest.fn();

        const { getByPlaceholderText } = render(
            <FormInput
                stateField={stateField}
                field={field}
                onChange={() => { }}
                onFocus={onFocusMock}
                onBlur={onBlurMock}
            />
        );

        const input = getByPlaceholderText(field.placeholder);
        userEvent.click(input);
        expect(onFocusMock).toHaveBeenCalledWith(field.name);
        expect(document.activeElement).toBe(input);

        userEvent.tab();
        expect(onBlurMock).toHaveBeenCalledWith(field.name);
        expect(document.activeElement).not.toBe(input);
    });

    it('should update input value when onChange occurs', async () => {
        const stateField = { name: 'name', value: '', isValid: true };
        const field = { type: 'text', name: 'name', label: 'Name', placeholder: 'Enter your name' };

        const onChangeMock = jest.fn();
        const onFocusMock = jest.fn();
        const onBlurMock = jest.fn();

        const { getByPlaceholderText } = render(
            <FormInput
                stateField={stateField}
                field={field}
                onChange={onChangeMock}
                onFocus={onFocusMock}
                onBlur={onBlurMock}
            />
        );

        const input = getByPlaceholderText(field.placeholder) as HTMLInputElement;

        expect(input).toHaveValue('');
        const inputTypedValue = 'Input test text';
        fireEvent.change(input, {target: {value: inputTypedValue}});
        expect(onChangeMock).toBeCalled();
    });

    afterEach(() => {
        jest.clearAllMocks();
    })
});
