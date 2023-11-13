import { createUserValidations } from 'utils/validation/validations';
import { StateField, MappedField, Validator } from './types';

export const username: StateField = { name: "username", value: "", isValid: true, isFocused: false };
export const userEmail: StateField = { name: "userEmail", value: "", isValid: true, isFocused: false };
export const userPassword: StateField = { name: "userPassword", value: "", isValid: true, isFocused: false };

export const createUserFields: MappedField[] = [
    { type: "text", name: "username", label: "User name*", placeholder: "Enter username" },
    { type: "email", name: "userEmail", label: "User email*", placeholder: "Enter user email" },
    { type: "password", name: "userPassword", label: "User password", placeholder: "Create user password" },
];

export const fieldsValidation: Validator = {
    username: createUserValidations.username,
    userEmail: createUserValidations.userEmail,
    userPassword: createUserValidations.userPassword,
};
