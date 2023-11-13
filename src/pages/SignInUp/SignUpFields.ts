import { signupValidations } from 'utils/validation/validations';
import { StateField, MappedField, Validator } from './types';

export const name: StateField = { name: "name", value: "", isValid: true };
export const email: StateField = { name: "email", value: "", isValid: true };
export const password: StateField = { name: "password", value: "", isValid: true };

export const signupFields: MappedField[] = [
    { type: "text", name: "name", label: "Name*", placeholder: "Enter your name" },
    { type: "email", name: "email", label: "Email*", placeholder: "Enter your email" },
    { type: "password", name: "password", label: "Password", placeholder: "Create a password" },
];

export const fieldsValidation: Validator = {
    name: signupValidations.name,
    email: signupValidations.email,
    password: signupValidations.password,
};
