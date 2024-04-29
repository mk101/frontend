export interface SearchData {
    id: string,
    createdBy: string,
    createdAt: string,
    editBy?: string,
    editAt?: string,
    horizontalArea: Range,
    verticalArea: Range,
    data: object,
    name: string,
    description: string,
    status: 'WARNING' | 'RESOLVE' | 'INFO',
    tags: string[]
}

export interface Range {
    upper: number,
    lower: number
}
