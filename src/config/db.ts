import { MongoClient, Db, Collection } from 'mongodb';
import type { AlumnoType, AsignaturaType } from '../models/types.js';

const client = new MongoClient("mongodb+srv://danielmarcossagradocorazon_db_user:e3K0dNvCey3AxLF2@cluster0.vfgyfny.mongodb.net/");


let asignaturasCollection: Collection<AsignaturaType>;
let alumnosCollection: Collection<AlumnoType>;


export const connectDB = async ()=>{
    await client.connect();

    const db = client.db("Base_ejemplo");

    asignaturasCollection = db.collection<AsignaturaType>("practica4asignaturas");
    alumnosCollection = db.collection<AlumnoType>("practica4alumnos");

    console.log("conectado al Mondongo");
};

export const getAsignaturasCollection = () =>{
    return asignaturasCollection;
}

export const getAlumnosCollection = () => {
    return alumnosCollection;
}