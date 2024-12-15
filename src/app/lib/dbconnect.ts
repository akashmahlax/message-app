import mongoose from "mongoose"

type ConnectionObject = {
    isConnected ? : number
}

export const connection : ConnectionObject =  {}

async function Dbconnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to the database")
        return
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "", {})
        connection.isConnected = conn.connections[0].readyState
        console.log("Connected to the database")
        console.log(conn.connection.host)
        console.log(conn.connection.name)
        console.log(conn.connection.port)
        console.log(conn.connection.db)
    } catch (error) {
        console.log("Error connecting to the database", error)
        process.exit(1)
    }
}

export default Dbconnect