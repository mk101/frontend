export interface LoginRequest {
    login: string,
    password: string
}

export interface TokensResponse {
    access: string,
    refresh: string
}

export interface RegisterRequest {
    first_name: string,
    last_name: string,
    login: string,
    password: string,
    group: string
}
