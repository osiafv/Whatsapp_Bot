import { config } from 'dotenv'
config()
import { Browsers, WAOpenResult } from '@adiwajshing/baileys'
import { Main } from '../../src/main'
import chalk from 'chalk'
import * as fs from 'fs'
import { StartingLog } from '../../tools'

export class Connected extends Main {
    constructor() {
        super()
    }
    public async Connect(): Promise<void> {
        await this.SessionsSave()
        StartingLog()
		await this.database.Conneksi()
        this.getUpdate()
        return void (await this.Response())
    }
    protected async SessionsSave(): Promise<WAOpenResult> {
        const Path: string = `./lib/routers/sessions/sessions_default_Ra.json`
        this.client.on('qr', () => {
            console.log(chalk.red('[!]'), chalk.hex('#e3ff00')('Please scan your Qr code immediately...........'))
        })
        fs.existsSync(Path) && this.client.loadAuthInfo(Path)
		this.client.version = [2, 2126, 14]
		this.client.logger.level = "fatal"
		this.client.browserDescription = Browsers.baileys('Chrome')
        const Connect: WAOpenResult = await this.client.connect()
        fs.writeFileSync(Path, JSON.stringify(this.client.base64EncodedAuthInfo(), null, 2))
        return Connect
    }
}
