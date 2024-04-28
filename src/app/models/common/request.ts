export interface Request {

    body?: object,
    url: string,
    method: Method,
    useAuth?: boolean // true by default

}

export interface Response {
    code: number,
    body?: object
}

export enum Method {
    GET = 'GET',
    POST = 'POST', 
    PUT = 'PUT', 
    DELETE = 'DELETE'
}