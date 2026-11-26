import type { ObjectId } from "mongodb"


export type AlumnoType = {
    _id?:ObjectId,
    nombre: string,
    edad: number,
    email: string,
    asignaturas: AsignaturaType[] | ObjectId[] | string[],
}

export type AsignaturaType = {
    _id?:ObjectId,
    nombre: string,
    creditos: number,
    curso: number,
    alumnos: AlumnoType[] | ObjectId[] | string[],
}

export type AlumnoPathType = {
    nombre?: string,
    edad?: number,
    email?: string,
    asignaturas?: AsignaturaType[] | ObjectId[] | string[],
}

export type AsignaturaPathType = {
    nombre?: string,
    creditos?: number,
    curso?: number,
    alumnos?: AlumnoType[] | ObjectId[] | string[],
}