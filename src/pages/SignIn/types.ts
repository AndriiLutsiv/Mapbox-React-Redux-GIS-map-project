export type FieldName = "email" | "password";

export interface StateField {
    name: FieldName,
    value: string,
    isValid: boolean,
    errorText?: string,
}

export interface Fields {
    email: StateField,
    password: StateField
};

export interface MappedField {
    type: string,
    name: FieldName,
    label: string,
    placeholder: string,
}

export interface Validator {
    [key: string]: ((value: string) => string | null)[]
}