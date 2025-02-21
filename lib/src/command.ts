import { WAConnection, WAMessage, MessageType } from '@adiwajshing/baileys'
import CMDError from './CmdError'
import { HandlingMessage } from '../typings'
import chalk from 'chalk'
import { IndSpammer, IndSpam5S } from '../lang/ind'
import { CheckCommand } from '../functions/function'
import { config } from 'dotenv'
config({ path: './.env' })

interface Init {
    prefix?: RegExp
    noPrefix?: boolean
    group?: boolean
    private?: boolean
    mods?: boolean
    premium?: boolean
    botAdmin?: boolean
    admin?: boolean
    limit?: boolean | number
    owner?: boolean
    tags?: string[]
    help?: string[]
}
let Reject: Set<string> = new Set()
let Res: Set<string> = new Set()
let AntiSpam: Set<string> = new Set()
let Anti: Set<string> = new Set()

export class Command {
    public events: any = {}
    public _prefix: string = '#'
    public client: WAConnection | undefined
    public prefix: string | string[] | RegExp
    constructor(p: string | string[]) {
        p = /\?/.test(`${p}`) ? '?' : p
        this.prefix = new RegExp(`^${typeof p == 'string' ? p : p.join('')}`)
    }

    public on(eventName: string, tampil: { event: string[], tag: string, withPrefix?: boolean},pattern: any,callback: any,_init: Init = {}) {
		tampil.withPrefix = tampil.withPrefix ?? true
        if (!this.events[eventName])
            this.events[eventName] = {
                name: eventName,
				tampil,
                pattern,
                callback,
                enabled: true,
                ..._init
            }
        this.events[eventName] = {
            ...this.events[eventName],
			tampil,
            pattern,
            callback,
            ..._init
        }
    }

    public validate(data: HandlingMessage, client: WAConnection) {
        return new Promise(async (resolve, reject) => {
            try {
                this.client = client
                const { body, isOwner, bot, user, sender, groupMetadata, fromMe, pushname, Jam, Prefix, IsCMD, from, mess, Command, isSticker, FileSha } = data
                let usedPrefix: any
                if (!sender) return
                if (!from) return
                for (const eventName in this.events) {
                    const event: any = this.events[eventName]
                    if (!event.enabled && !isOwner) continue
                    const prefix: string = this.getPrefix(event)
                    const match: (RegExp | any[])[] = this.getMatch(body?.toLocaleLowerCase() || '', prefix)
                    if (event.noPrefix || !event.pattern) {
                        if (await event.callback(client, { match, ...data })) continue
                    }
                    if (typeof event.callback !== 'function') continue
                    if ((usedPrefix = (match || [])[0])) {
                        const _text: string | undefined = body?.replace(usedPrefix, '').trim() || ''
                        let [command, ...args] = _text.split(' ')
                        args = args || []
                        let _args: string[] = _text.split(' ').slice(1)
                        let text: string = _args.join(' ')
                        let isCmd: boolean = this.getCmd(command.toLocaleLowerCase(), event.pattern)
                        if (!isCmd) continue
                        if (typeof sender !== 'string') return
                        if (typeof from !== 'string') return
                        if (event.owner && !isOwner) {
                            continue
                        }
                        if (event.admin && !(user.isAdmin || user.isSuperAdmin)) {
                            continue
                        }
                        if (event.botAdmin && !(bot.isAdmin || bot.isSuperAdmin)) {
                            continue
                        }
						//if (!CheckCommand(Command, Prefix, isOwner)) return
						if (!!Anti.has(sender)) return
						if (!!AntiSpam.has(sender)) return ((await client.sendMessage(from,IndSpam5S(`${process.env.antispam}`.substring(0, 1)), MessageType.extendedText, { quoted: mess })) && Anti.add(sender))
                        try {
                            return void (await event.callback(client, {
                                args,
                                _args,
                                text,
                                command,
                                _text,
                                match,
                                ...data
                            }))
                        } catch (err) {
                                Anti.delete(sender) 
                                AntiSpam.delete(sender)
                            reject(new CMDError(err, event))
                        } finally {
                            AntiSpam.add(sender)
                            console.log(chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.keyword('blue')(`[\x1b[1;32m${chalk.hex('#009940').bold('RECORD')}]`), chalk.red.bold('\x1b[1;31m=\x1b[1;37m>'),chalk.cyan('\x1bmSTATUS :\x1b'), chalk.hex('#fffb00')(fromMe ? 'SELF' : 'PUBLIK'), chalk.greenBright('[COMMAND]'), chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.blueBright(event.name.split('|')[1]), chalk.hex('#f7ef07')(`[${args?.length}]`),chalk.red.bold('\x1b[1;31m=\x1b[1;37m>'), chalk.hex('#26d126')('[PENGIRIM]'),chalk.hex('#f505c1')(pushname), chalk.hex('#ffffff')(`(${sender?.replace(/@s.whatsapp.net/i, '')})`), chalk.greenBright('IN'), chalk.hex('#0428c9')(`${groupMetadata?.subject}`), chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.hex('#f2ff03')('[DATE] =>'),chalk.greenBright(Jam.split(' GMT')[0]))
                            setTimeout(() => {
                                AntiSpam.delete(sender)
                                Anti.delete(sender)
                            }, Number(process.env.antispam))
                        }
                        break
                    }
                }
            } catch (err) {
                if (typeof data.sender !== 'string') return
                    Anti.delete(data.sender) 
                    AntiSpam.delete(data.sender)
                throw new CMDError(err)
            }
        })
    }
    private getCmd(s: string | null, pattern?: any) {
        const isCmd: boolean =
            pattern instanceof RegExp
                ? pattern.test(s || '')
                : Array.isArray(pattern)
                ? pattern.some((cmd) => (cmd instanceof RegExp ? cmd.test(s || '') : cmd === s))
                : typeof pattern === 'string'
                ? pattern === s
                : false
        return isCmd
    }

    public getPrefix(event: { prefix: any }) {
        return event.prefix ? event.prefix : this.prefix ? this.prefix : this._prefix
    }

    private getMatch(s: string, prefix: any) {
        let match: any =
            prefix instanceof RegExp
                ? [[prefix.exec(s), prefix]]
                : Array.isArray(prefix)
                ? prefix.map((p) => {
                      let re = p instanceof RegExp ? p : new RegExp(this.str2Regex(p))
                      return [re.exec(s), re]
                  })
                : typeof prefix === 'string'
                ? [[new RegExp(this.str2Regex(prefix)).exec(s), new RegExp(this.str2Regex(prefix))]]
                : [[[], new RegExp('(?:)')]]
        let Match = match.find((p: any) => p[1])
        return Match
    }
    private str2Regex(s: string): string {
        return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    }
}
