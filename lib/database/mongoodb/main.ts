import { Muted  as _dataMuted } from '.'

export class ConnectMoongo extends _dataMuted {
    constructor() {
        super()
    }
	public async resetMongoDb (): Promise <void> {
		await this.resetViewOnce()
		await this.resetMuted()
		await this.ResetRegister()
		await this.ResetAfk()
	}
}
