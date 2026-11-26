import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {typeDefs} from "./schema/index.js";
import {resolvers} from "./resolvers/index.js";
import { connectDB } from "./config/db.js";


const server = new ApolloServer({
    typeDefs,
    resolvers
});

const startServer = async ()=>{

    await connectDB();
    
    const {url} = await startStandaloneServer(server,{
        listen: {port:3000}
    });
    console.log(`Servidor iniciado en ${url}`)
}

startServer();