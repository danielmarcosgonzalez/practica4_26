
export const typeDefs = `#graphql
    
  # =========================

  # TYPES

  # =========================


  type AlumnoT {

    _id: ID!

    nombre: String!

    edad: Int!

    email: String!

    asignaturas: [AsignaturaT]

  }


  type AsignaturaT {

    _id: ID!

    nombre: String!

    creditos: Int!

    curso: Int!

    alumnos: [AlumnoT]

  }



  # =========================

  # INPUT TYPES

  # =========================


  input AlumnoInput {

    nombre: String!

    edad: Int!

    email: String!

    asignaturas: [ID!]

  }


  input AlumnoUpdateInput {

    nombre: String

    edad: Int

    email: String

    asignaturas: [ID!]

  }


  input AsignaturaInput {

    nombre: String!

    creditos: Int!

    curso: Int!

    alumnos: [ID!]

  }


  input AsignaturaUpdateInput {

    nombre: String

    creditos: Int

    curso: Int

    alumnos: [ID!]

  }



  # =========================

  # QUERIES

  # =========================


  type Query {


    # Alumnos

    alumnos: [AlumnoT]

    alumno(id: ID!): AlumnoT

    alumnosPorEdad(edad: Int!): [AlumnoT]


    # Asignaturas

    asignaturas: [AsignaturaT]

    asignatura(id: ID!): AsignaturaT

    asignaturasPorCurso(curso: Int!): [AsignaturaT]


    # Consultas relacionadas

    alumnosPorAsignatura(asignaturaId: ID!): [AlumnoT]

    asignaturasPorAlumno(alumnoId: ID!): [AsignaturaT]

  }



  # =========================

  # MUTATIONS

  # =========================


  type Mutation {


    # Alumnos

    crearAlumno(input: AlumnoInput!): AlumnoT

    actualizarAlumno(id: ID!, input: AlumnoUpdateInput!): AlumnoT

    eliminarAlumno(id: ID!): AlumnoT


    # Asignaturas

    crearAsignatura(input: AsignaturaInput!): AsignaturaT

    actualizarAsignatura(id: ID!, input: AsignaturaUpdateInput!): AsignaturaT

    eliminarAsignatura(id: ID!): AsignaturaT


    # Gestión de matrículas

    matricularAlumno(

      alumnoId: ID!

      asignaturaId: ID!

    ): AlumnoT


    desmatricularAlumno(

      alumnoId: ID!

      asignaturaId: ID!

    ): AlumnoT

  }


`;