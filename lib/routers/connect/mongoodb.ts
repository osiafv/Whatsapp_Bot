import { ConnectMongoo } from '../../functions/log'
import { config } from 'dotenv';
import { MongoClient } from "mongodb"
config({ path: './env' })

export class Mongoose {
    public Client = new MongoClient(String(process.env.MONGO_URI))
    constructor() {
			this.Client.connect()
			ConnectMongoo()
    }
}
