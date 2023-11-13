export interface User {
    username: string,
    email: string,
    is_active?: boolean,
    is_superuser?: boolean,
    company_uuid: string,
    uuid: string,
    is_admin?: boolean
}

//signUp token
export interface SignUpTokenResponse {
    expires_in_minutes: number,
    token: string
}

export interface SignUpTokenError {
    data: {
        detail: string;
    }
}

//signup
export interface SignUpUser {
    username: string,
    email: string,
    password: string,
    token: string
}

export interface SignUpUserResponse {
    username: string,
    email: string,
    is_active: boolean,
    is_superuser: boolean,
    company_uuid: string,
    uuid: string,
    is_admin: boolean
}

export interface SignUpUserError {
    data: {
        detail: string;
    }
}
//create
export interface CreateUser {
    username: string,
    email: string,
    password: string,
}

export interface CreateUserResponse {
    username: string,
    email: string,
    is_active: boolean,
    is_superuser: boolean,
    company_uuid: string,
    uuid: string,
    is_admin: boolean
}

export interface CreateUserError {
    data: {
        detail: string;
    }
}

// get
export type GetUsersResponse = User[];
export type GetUserResponse = User;
export type GetCurrentUserResponse = User;

//delete
export interface DeleteUserResponse {
    success: boolean,
    message: string
}

export interface DeleteUser {
    user_uuid: string,
    token: string
}

export interface DeleteUserError {
    data: {
        detail: string;
    }
}

//update
export type UpdateUserResponse = User;
export interface UpdateUser {
    uuid: string,
    username?: string,
    password?: string,
    email?: string,
    is_active?: boolean,
    is_superuser?: boolean,
    company_uuid?: string
}

export interface UpdateUserError {
    data: {
        detail: string;
    }
}
