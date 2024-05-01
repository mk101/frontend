import { Type } from "ol/geom/Geometry";

export class DrawType {
    public id: Type
    public name: string

    constructor(id: Type, name: string) {
        this.id = id
        this.name = name
    }

    public toString(): string {
        return this.name;
    }
}

export interface SaveLayer {
    name: string,
    description: string,
    status: 'INFO' | 'WARNING',
    tags: string[]
}