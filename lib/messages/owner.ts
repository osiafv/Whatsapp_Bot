import { GroupGuards as GroupGuard} from ".";
import { WAConnection, MessageType, proto } from '@adiwajshing/baileys'
import { Commands } from '../typings'
import { Client } from '../src/Client'
import { ConnectMoongo } from '../database/mongoodb/main'

export class OwnerOnly extends GroupGuard {
	constructor(public Ra: Client, public database: ConnectMoongo) {
        super(Ra, database)
    }
	public SendOwner () {
		this.sendGlobal()
		this.ResetDatabase()
	}
	private ResetDatabase () {
		globalThis.CMD.on("owner|reset", { event: ["resetdatabase"], tag: "owner"}, ["resetdatabase"], async(res: WAConnection, data: Commands) => {
			if (!data.isOwner) return
			await this.database.resetMongoDb()
			await this.Ra.reply(data.from, "Success", data.mess)
		})
	}
}