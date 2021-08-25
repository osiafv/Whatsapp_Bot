import { Banned } from ".";

export class Muted extends Banned {
	private _dataMute = this.Client.get('muted')
	constructor() {
		super()
	}
	public async AddMuted (from: string): Promise <void> {
		if (await this.CheckMuted(from)) return 
		return void await this._dataMute.insert({ from: from })
	}
	public async CheckMuted (from: string): Promise <boolean> {
		let status: boolean = false;
		if (await this._dataMute.findOne({ from: from })) {
			status = true
		}
		return status
	}
	public async deleteMuted (from: string): Promise <void> {
		if (!await this.CheckMuted(from)) return
		return void await this._dataMute.remove({ from: from })
	}
	public async resetMuted (): Promise <void> {
		return void await this._dataMute.remove()
	}
}