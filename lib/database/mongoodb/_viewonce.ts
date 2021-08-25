import { AFK as _afk } from '.'

export class ViewOnce extends _afk {
	private database = this.Client.get('viewonce')
    constructor() {
        super()
    }
	public async checkViewOnce (id: string): Promise <boolean> {
		let status: boolean = false
		if (await this.database.findOne({ id: id })) {
			status = true
		}
		return status
	}
	public async  AddViewOnce (id: string): Promise <void> {
		if (await this.checkViewOnce(id)) return
		return void await this.database.insert({ id: id })
	}
	public async deleteViewOnce (id: string): Promise <void> {
		if (!(await this.checkAfk(id))) return
		return void await this.database.remove({ id: id })
	}
	public async resetViewOnce (): Promise <void> {
		return void await this.database.remove()
	}
}