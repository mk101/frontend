export interface User {
    id?: string,
    first_name: string,
    last_name: string,
    login?: string,
    password?: string,

    active: boolean,

    avatar?: Avatar,
    roles: UserRole[]
}

export interface Avatar {
    userId: string,
    filename: string
}

export interface UserRole {
    user_id: string,
    role: Role
}

export enum Role {
    CREATE_MAP = 'CREATE_MAP',
    DELETE_OWN_MAP = 'DELETE_OWN_MAP',
    DELETE_ANY_MAP = 'DELETE_ANY_MAP',
    EDIT_OWN_MAP = 'EDIT_OWN_MAP',
    EDIT_ANY_MAP = 'EDIT_ANY_MAP',

    EDIT_USERS = 'EDIT_USERS'
}
