export type FieldName = "username" | "userEmail" | "userPassword";

export interface StateField {
    name: FieldName,
    value: string,
    isValid: boolean,
    errorText?: string,
    isFocused: boolean,
}

export interface Fields {
    username: StateField,
    userEmail: StateField,
    userPassword: StateField
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