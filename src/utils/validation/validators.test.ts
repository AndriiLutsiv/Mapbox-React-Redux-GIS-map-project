import { requiredValidator, passwordValidator, atLeastOneLetter } from './validators';

describe('requiredValidator', () => {
    const errorText = 'The field is required';
    const validate = requiredValidator(errorText);

    it('return error text when the value is empty', () => {
        expect(validate('')).toBe(errorText);
    })

    it('return null if there is value', () => {
        expect(validate('Test value')).toBeNull();
    })
});

describe('passwordValidation', () => {
    const errorText = 'Must be at least 8 characters, one lower case letter, one upper case letter, one number, one special character';
    const validate = passwordValidator(errorText)

    it('return error text when the password is invalid', () => {
        expect(validate('test')).toBe(errorText) // No uppercase letter
        expect(validate('TEST')).toBe(errorText) // No lowercase letter
        expect(validate('Test')).toBe(errorText) // No number
        expect(validate('Test1')).toBe(errorText) // No special character
        expect(validate('Test1$')).toBe(errorText) // Less than 8 characters
    });

    it('return null if password is valid', () => {
        expect(validate('TestValue12$%')).toBeNull();
    })
})

describe('atLeastOneLetter', () => {
    const errorText = 'Invalid data';
    const validate = atLeastOneLetter(errorText);

    it('return error text if the value is invalid', () => {
        expect(validate('$')).toBe(errorText);
        expect(validate('2')).toBe(errorText);
        expect(validate('$=_!@%^&*()1234567890')).toBe(errorText);
    })

    it('return null if the value is special symbol alone', () => {
        expect(validate('a')).toBeNull();
        expect(validate('$=_!@%^&*()1234567890b')).toBeNull()
    })
})
