import { ObjectId } from "mongodb";
import { getAlumnosCollection, getAsignaturasCollection } from "../config/db.js";
import type { AlumnoPathType, AlumnoType, AsignaturaPathType, AsignaturaType } from "../models/types.js";

const checkAsignaturaExisten = async (asignaturasIds: ObjectId[])=>{
    const collection = getAsignaturasCollection();
    const asignaturaExistentes = await collection.find({_id:{$in:asignaturasIds}}).toArray();
    if(asignaturaExistentes.length !== asignaturasIds.length){
        throw new Error('Asignaturas no existen en esa lista');
    }
}

const checkAlumnoExisten = async (alumnosIds: ObjectId[])=>{
    const collection = getAlumnosCollection();
    const asignaturaExistentes = await collection.find({_id:{$in:alumnosIds}}).toArray();
    if(asignaturaExistentes.length !== alumnosIds.length){
        throw new Error('Alumnos no existen en esa lista');
    }
}

export const resolvers = {
    Query:{
        alumnos: async () =>{
            const collection = getAlumnosCollection();
            return await collection.find().toArray();
        },
        alumno: async (_:unknown, args:{id:string})=>{
            const collection = getAlumnosCollection();
            const {id} = args;
            const alumnoConId = await collection.findOne({
                _id: new ObjectId(id)
            })
            return alumnoConId;
        },
        alumnosPorEdad: async (_:unknown, args:{edad:number})=>{
            const collection = getAlumnosCollection();
            const {edad} = args;
            const alumnoPorEdad = await collection.find({
                edad:edad
            }).toArray();
            return alumnoPorEdad;
        },
        asignaturas: async ()=>{
            const collection = getAsignaturasCollection();
            return await collection.find().toArray();
        },
        asignatura: async (_:unknown, args:{id:string})=>{
            const collection = getAsignaturasCollection();
            const {id} = args;
            const asignaturaConId = await collection.findOne({
                _id: new ObjectId(id)
            })
            return asignaturaConId;
        },
        asignaturasPorCurso: async (_:unknown, args:{curso:number})=>{
            const collection = getAsignaturasCollection();
            const {curso} = args;
            const asignaturasporCurso = await collection.find({
                curso:curso
            }).toArray();
            return asignaturasporCurso;
        },
        alumnosPorAsignatura: async (_:unknown, args:{asignaturaId:string})=>{
            const collection = getAlumnosCollection();
            const alumnosPorAsignatura = await collection.find({
                asignaturas: new ObjectId(args.asignaturaId)
            }).toArray();
            return alumnosPorAsignatura;
        },
        asignaturasPorAlumno: async (_:unknown, args:{alumnoId:string})=>{
            const collection = getAsignaturasCollection();
            const asignaturasporCurso = await collection.find({
                alumnos: new ObjectId(args.alumnoId)
            }).toArray();
            return asignaturasporCurso;
        }
    },
    Mutation:{
        crearAlumno: async (_:unknown, args:{input:AlumnoType})=>{
            const collection = getAlumnosCollection();
            const nuevoAlumno:AlumnoType = {
                edad:args.input.edad,
                email:args.input.email,
                nombre:args.input.nombre,
                asignaturas: args.input.asignaturas.map(idAsignatura=> new ObjectId(idAsignatura as string))
            }
            await checkAsignaturaExisten(nuevoAlumno.asignaturas as ObjectId[])
            const insertada = await collection.insertOne(nuevoAlumno);
            const nuevoAlumnoConId = await collection.findOne({
                _id: new ObjectId(insertada.insertedId)
            })
            return nuevoAlumnoConId;
        },
        crearAsignatura: async (_:unknown, args:{input:AsignaturaType})=>{
            const collection = getAsignaturasCollection();
            const nuevaAsigantura:AsignaturaType = {
                nombre:args.input.nombre,
                curso:args.input.curso,
                creditos:args.input.creditos,
                alumnos: args.input.alumnos.map(idAlumno=> new ObjectId(idAlumno as string))
            }
            await checkAlumnoExisten(nuevaAsigantura.alumnos as ObjectId[]);
            const insertada = await collection.insertOne(nuevaAsigantura);
            const nuevaAsiganturaConId = await collection.findOne({
                _id: new ObjectId(insertada.insertedId)
            })
            return nuevaAsiganturaConId;
        },
        actualizarAlumno: async (_:unknown, args:{id:string,input:AlumnoPathType})=>{
            const collection = getAlumnosCollection();
            if(args.input.asignaturas){
                const asignaturasIds = args.input.asignaturas.map(idAsignatura => new ObjectId(idAsignatura as string));
                await checkAsignaturaExisten(asignaturasIds);
                args.input.asignaturas = asignaturasIds;
            }
            const actualizarAlumno = await collection.findOneAndUpdate({
                _id: new ObjectId(args.id)
            },{
                $set:args.input
            },{
                returnDocument: 'after'
            });
            return actualizarAlumno;
        },
        actualizarAsignatura: async (_:unknown, args:{id:string,input:AsignaturaPathType})=>{
            const collection = getAsignaturasCollection();
            if(args.input.alumnos){
                const alumnosIds = args.input.alumnos.map(idAlumno => new ObjectId(idAlumno as string));
                await checkAlumnoExisten(alumnosIds);
                args.input.alumnos = alumnosIds;
            }
            const actualizarAsignatura = await collection.findOneAndUpdate({
                _id: new ObjectId(args.id)
            },{
                $set:args.input
            },{
                returnDocument:  'after'
            });
            return actualizarAsignatura;
        },
        eliminarAlumno: async (_:unknown, args:{id:string})=>{
            const collection = getAlumnosCollection();
            const alumnoEliminado = collection.findOneAndDelete({
                _id: new ObjectId(args.id)
            })
            return alumnoEliminado;
        },
        eliminarAsignatura: async (_:unknown, args:{id:string})=>{
            const collection = getAsignaturasCollection();
            const asignaturaEliminada = collection.findOneAndDelete({
                _id: new ObjectId(args.id)
            })
            return asignaturaEliminada;
        },
        matricularAlumno: async (_:unknown, args:{alumnoId:string,asignaturaId:string})=>{
            const asignaturasCollection = getAsignaturasCollection();
            const alumnosCollection = getAlumnosCollection();
            
            const alumnoId = new ObjectId(args.alumnoId);
            const asignaturaId = new ObjectId(args.asignaturaId);

            await checkAlumnoExisten([alumnoId]);
            await checkAsignaturaExisten([asignaturaId]);

            const alumnoActualizado = await alumnosCollection.findOneAndUpdate({
                _id:alumnoId
            },{
                $addToSet:{asignaturas:asignaturaId}
            },{ 
                returnDocument: 'after' 
            });
            const asignaturaActualizada = await asignaturasCollection.findOneAndUpdate({
                _id:asignaturaId
            },{
                $addToSet:{alumnos:alumnoId}
            },{
                returnDocument: 'after'
            });

            return alumnoActualizado;
        },
        desmatricularAlumno: async (_:unknown, args:{alumnoId:string,asignaturaId:string})=>{
            const asignaturasCollection = getAsignaturasCollection();
            const alumnosCollection = getAlumnosCollection();
            
            const alumnoId = new ObjectId(args.alumnoId);
            const asignaturaId = new ObjectId(args.asignaturaId);

            await checkAlumnoExisten([alumnoId]);
            await checkAsignaturaExisten([asignaturaId]);

            const alumnoActualizado = await alumnosCollection.findOneAndUpdate({
                _id:alumnoId
            },{
                $pull:{asignaturas:asignaturaId}
            },{ 
                returnDocument: 'after' 
            });
            const asignaturaActualizada = await asignaturasCollection.findOneAndUpdate({
                _id:asignaturaId
            },{
                $pull:{alumnos:alumnoId}
            },{
                returnDocument: 'after'
            });

            return alumnoActualizado;
        }

    },
    AlumnoT:{
        asignaturas: async(parent:AlumnoType)=>{
            const collection = getAsignaturasCollection();
            const asignaturas = await collection.find({_id:{$in:parent.asignaturas as ObjectId[]}}).toArray();
            return asignaturas;
        }
    },
    AsignaturaT:{
        alumnos: async(parent:AsignaturaType)=>{
            const collection = getAlumnosCollection();
            const alumnos = await collection.find({_id:{$in:parent.alumnos as ObjectId[]}}).toArray();
            return alumnos;
        }
    }
}