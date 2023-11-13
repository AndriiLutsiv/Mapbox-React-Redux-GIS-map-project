export interface Token {
    username: string;
    password: string;
    scope?: string;
}

export interface ErrorResponse {
    data: {
        detail: string;
    }
}