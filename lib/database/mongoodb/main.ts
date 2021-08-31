import { Muted  as _dataMuted } from '.';
import { ConnectMongoo} from "../../functions/log"

export class ConnectMoongo extends _dataMuted {
    constructor() {
        super()
    }
	public async Conneksi (): Promise <void> {
		await this.Client.connect()
		ConnectMongoo()
	}
	public async resetMongoDb (): Promise <void> {
		await this.resetViewOnce()
		await this.resetMuted()
		await this.ResetRegister()
		await this.ResetAfk()
	}
}
