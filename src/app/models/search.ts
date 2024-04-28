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
    status: string,
    tags: string[]
}

export interface Range {
    upper: number,
    lower: number
}
