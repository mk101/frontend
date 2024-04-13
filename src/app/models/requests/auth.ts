export interface LoginRequest {
    login: string,
    password: string
}

export interface TokensResponse {
    access: string,
    refresh: string
}