import { signinValidations } from 'utils/validation/validations';
import { StateField, MappedField, Validator } from './types';

export const email: StateField = { name: "email", value: "", isValid: true };
export const password: StateField = { name: "password", value: "", isValid: true };

export const signinFields: MappedField[] = [
    { type: "text", name: "email", label: "Email", placeholder: "Enter your email" },
    { type: "password", name: "password", label: "Password", placeholder: "Enter your password" },
];

export const fieldsValidation: Validator = {
    email: signinValidations.email,
    password: signinValidations.password,
};

