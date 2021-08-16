import { GroupCommands} from ".";
import { Client } from '../src/Client'
import { ConnectMoongo } from '../database/mongoodb/main'
import { WAConnection, MessageType } from '@adiwajshing/baileys'
import { Commands } from '../typings'
import {  IndAntiDahViewOnce,  IndAntiViewOnce, PilihOnOff,  IndMuted,  IndMutedDah } from "../lang/ind"


export class GroupGuards extends GroupCommands {
    constructor(public Ra: Client, public database: ConnectMoongo) {
        super(Ra, database)
    }
	public sendGlobal () {
		this.sendHandling()
		this.AntiViewOnce()
		this.MutedGc()
	}
	private async MutedGc () {
		globalThis.CMD.on("guard|muted <on/off>", ["mute", "muted"], async (res: WAConnection, data: Commands) => {
			const { from, isGroupMsg, isOwner, isGroupAdmins, groupMetadata, args, mess } = data
			if (!isGroupMsg) return
			if (!isOwner && !isGroupAdmins) return 
			if (!groupMetadata) return
			if (args[0] && args[0].toLowerCase() == "on") {
				if (await this.database.CheckMuted(from)) return  this.Ra.reply(from,  IndMutedDah(true), mess)
				await this.database.AddMuted(from)
				return void await this.Ra.reply(from, IndMuted(true, groupMetadata), mess)
			} else if (args[0] && args[0].toLocaleLowerCase() == "off") {
				if (!(await this.database.CheckMuted(from))) return this.Ra.reply(from,  IndMutedDah(false), mess)
				await this.database.deleteMuted(from)
				return void await this.Ra.reply(from,   IndMuted(false, groupMetadata), mess)
			} else {
				return void await this.Ra.reply(from, PilihOnOff(), mess)
			}
		})
	}
	private async AntiViewOnce () {
		globalThis.CMD.on("guard|antiviewonce <on/off>", ["antiviewonce", "antivo"], async (res: WAConnection, data: Commands) => {
			const { args, from, isGroupMsg, mess, groupMetadata, isGroupAdmins, isOwner } = data
			if (!isGroupMsg) return
			if (!isOwner && !isGroupAdmins) return 
			if (!groupMetadata) return
			if (args[0] && args[0].toLowerCase() == "on") {
				if (await this.database.checkViewOnce(from)) return await this.Ra.reply(from, IndAntiDahViewOnce(true), mess)
				await this.database.AddViewOnce(from)
				return void await this.Ra.reply(from,  IndAntiViewOnce(true, groupMetadata), mess)
			} else if (args[0] && args[0].toLocaleLowerCase() == "off") {
				if (!(await this.database.checkViewOnce(from))) return  await this.Ra.reply(from, IndAntiDahViewOnce(false), mess)
				await this.database.deleteViewOnce(from)
				return void await this.Ra.reply(from,  IndAntiViewOnce(false, groupMetadata), mess)
			} else {
				return void await this.Ra.reply(from, PilihOnOff(), mess)
			}
		})
	}
}