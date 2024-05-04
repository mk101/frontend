export interface EditLayer {
    name: string,
    description: string,
    status: 'INFO' | 'WARNING' | 'RESOLVE',
    tags: string[]
}