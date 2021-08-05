import {  Searching } from "./search";
import { Client } from "../src/Client";
import { Commands, HandlingMessage } from "../typings";
import { WAConnection, MessageType, WAGroupParticipant, WAParticipantAction } from '@adiwajshing/baileys';
import moment from "moment-timezone";
import { IndVoteStart, IndVoting, IndHasilVote, BukanDalamGroup, IndSesiVotingAda,  IndSesiVotingGada, IndResetSesi, IndVoteLebih15, BerhasilKickVote, CancelVote,  DiaKeluarVote  } from "../lang/ind"

let result: Map<String, { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }[]} | any> = new Map()
export class groupMembers  {
	constructor(public Ra: WAConnection, public data: HandlingMessage) {
	}
	public sendDataMembers () {
		this.vote()
		this.ResponVote()
		this.delvote()
	}
	protected async ResponVote () {
		const { from, body, bodyButton, Command, sender, pushname, mess, isBotAdmins, groupMember } = this.data
		if (!from) return
		const data:  { pelapor: string | null | undefined, alasan: string, expired: number, target: string, action: { id: string, status: string, pushname: string }[] | undefined } | undefined= result.get(from)
		if (data !== undefined) {
			setInterval(async () => {
				if (Number(data.expired) <= moment().unix()) {
					const ress:  { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }}  = result.get(from)
					if (ress) result.delete(from) &&  this.Ra.sendMessage(from, IndHasilVote(ress.pelapor || "", ress.target, ress.alasan, ress.action), MessageType.extendedText, { contextInfo: {mentionedJid: [ress.pelapor || "", ress.target]}})
				}
			}, 1000)
			let vote: { id: string, status: string, pushname: string }[] | undefined = data?.action?.filter((value: any) => value.status == "vote")
			let devote: { id: string, status: string, pushname: string }[] | undefined  = data?.action?.filter((value: any) => value.status == "devote")
			let CheckMem: WAGroupParticipant | undefined = groupMember?.find((value) => value.jid === data.target)
			if (Number(vote?.length) > 15 && isBotAdmins && CheckMem) return result.delete(from) && await this.Ra.sendMessage(from, BerhasilKickVote(data.target), MessageType.extendedText, { contextInfo: {mentionedJid: [data.target]}}) && this.Ra.groupRemove(from, [data.target]) 
			if (Number(devote?.length) > 15) return result.delete(from) && await this.Ra.sendMessage(from, CancelVote(), MessageType.text)
			const Body: string = bodyButton == "" ? Command : bodyButton || ""
			switch (Body.toLocaleLowerCase()) {
				case "vote": {
					const Format:  { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }} | any = {
						...data
					}
					if (Format?.action?.find((value: { id: string, status: string, pushname: string}) => value.id === sender)) return 
					Format.action?.push({
						id: sender || "",
						status: "vote",
						pushname: pushname
					})
					result.set(from, Format)
					const hasil:   { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }}  = result.get(from)
					if (!hasil) return
					this.Ra.sendMessage(from, IndVoting(hasil.pelapor || "", hasil.target, hasil.alasan, hasil.action), MessageType.extendedText,  { quoted: mess, contextInfo: {mentionedJid: [hasil.pelapor || "", hasil.target]}})
				}
				break
				case "devote": {
					const Format: { pelapor: string | null | undefined, alasan: string, expired: number, target: string, action: { id: string | null | undefined, status: string, pushname: string}[] } | any = {
						...data
					}
					if (Format.action.find((value: any) => value.id === sender)) return
					Format.action.push({
						id: sender || "",
						status: "devote",
						pushname: pushname 
					})
					result.set(from, Format)
					const hasil:  { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }}  = result.get(from)
					if (!hasil) return
					this.Ra.sendMessage(from, IndVoting(hasil.pelapor || "", hasil.target, hasil.alasan, hasil.action), MessageType.extendedText, { quoted: mess, contextInfo: { mentionedJid: [hasil.pelapor || "", hasil.target]}})
				}
				break
			}
		}
	}
	private delvote () {
		globalThis.CMD.on("voting|delvote", ["delvote", "deletevote","resetvote"], async (res: WAConnection, data: Commands) => {
			const { args, from, isGroupMsg, mess } = data
			if (!isGroupMsg) return await res.sendMessage(from, BukanDalamGroup(), MessageType.extendedText, { quoted: mess})
			const Check:  { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }}  = result.get(from)
			if (!Check) return await res.sendMessage(from,  IndSesiVotingGada(), MessageType.extendedText, { quoted: mess})
			await result.delete(from)
			return void res.sendMessage(from, IndResetSesi(), MessageType.extendedText, { quoted: mess})
		})
	}
	private vote () {
		globalThis.CMD.on("voting|voting <alasan,time,tag/reply>", ["voting"], async (res: WAConnection, respon: Commands) => {
			const { args, from, mentioned, sender, mess, isGroupMsg } = respon
			if (!isGroupMsg) return await res.sendMessage(from, BukanDalamGroup(), MessageType.extendedText, { quoted: mess})
			if (mentioned && mentioned[0] === undefined) return res.sendMessage(from, "Harap tag seseorang", MessageType.text)
			let getRespon: string = args.join(" ").replace("@", "").replace(new RegExp(`${mentioned?.join(" ").replace("@s.whatsapp.net", "")}`, "gi"), "")
			const Check:  { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }}  = result.get(from)
			if (Check) return await res.sendMessage(from, IndSesiVotingAda(), MessageType.extendedText, { quoted: mess})
			if (/[0-9]/g.test(getRespon)) {
				if (Number(getRespon.replace(/\D/g,'')) > 15) return  res.sendMessage(from, IndVoteLebih15(), MessageType.extendedText, { quoted: mess})
				const Format: { pelapor:  string | null | undefined , alasan: string, expired: number, target: string,action: []} = {
					pelapor: sender,
					alasan: getRespon.replace(/[0-9]/, '') || "Nothing",
					expired: Number(moment().add(Number(getRespon.replace(/\D/g,'')), "minutes").unix()),
					target: mentioned ? mentioned[0] : "",
					action: []
				}
				result.set(from, Format)
				const Data:  { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }}  = result.get(from)
				const Buttons: any = {
					contentText: IndVoteStart(Data?.pelapor || "", Data?.target || "", Data?.alasan || "", Number(getRespon.replace(/\D/g,''))),
					footerText: "Notes : Jika Kamu wa jelek gada tombol ketik vote/devote\n\nJika vote melebihi 15 orang maka otomatis target akan dikick JIKA BOT ADMIN, Sebaliknya jika devote melebihi 15 orang maka otomatis di batakan / ditutup\n\n🔖 @Powered bye Ra",
					buttons: [
						{buttonId: "1", buttonText: {displayText: '-'}, type: 1},
						{buttonId: '1', buttonText: {displayText: "VOTE"}, type: 1},
						{buttonId: '1', buttonText: {displayText: 'DEVOTE'}, type: 1}
					],
					headerType: 1
				}
				await res.sendMessage(from, Buttons, MessageType.buttonsMessage, { contextInfo: { mentionedJid: [Data?.target || "", Data?.pelapor || ""]}})
			} else {
				const Format: { pelapor:  string | null | undefined , alasan: string, expired: number, target: string,action: {}[]} = {
					pelapor: sender,
					alasan: getRespon.replace(/[0-9]/, '') || "Nothing",
					expired: Number(moment().add(Number(10), "minutes").unix()),
					target: mentioned ? mentioned[0] : "",
					action: []
				}
				result.set(from, Format)
				const Data:  { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }}  = result.get(from)
				const Buttons: any = {
					contentText: IndVoteStart(Data?.pelapor || "", Data?.target || "", Data?.alasan || "", 10),
					footerText:  "Notes : Jika Kamu wa jelek gada tombol ketik vote/devote\n\nJika vote melebihi 15 orang maka otomatis target akan dikick JIKA BOT ADMIN, Sebaliknya jika devote melebihi 15 orang maka otomatis di batakan / ditutup\n\n🔖 @Powered bye Ra",
					buttons: [
						{buttonId: "1", buttonText: {displayText: '-'}, type: 1},
						{buttonId: '1', buttonText: {displayText: "VOTE"}, type: 1},
						{buttonId: '1', buttonText: {displayText: 'DEVOTE'}, type: 1}
					],
					headerType: 1
				}
				await res.sendMessage(from, Buttons, MessageType.buttonsMessage, { contextInfo: { mentionedJid: [Data?.target || "", Data?.pelapor || ""]}})
			}
		})
	}
}
export class CheckUpdate {
	constructor(public Ra: WAConnection){}
	public CheckMem () {
		this.Ra.on("group-participants-update", async (update: { jid: string, participants: string[], actor?: string | undefined, action: WAParticipantAction}) => {
			const ress: { pelapor: string | null | undefined, alasan: string, expired: number, target: string,action: { id: string | null | undefined, status: string, pushname: string }}  = result.get(update.jid)
			if (update.action == "remove" && result.has(update.jid) && update.participants[0] == ress.target) return  result.delete(update.jid) && await this.Ra.sendMessage(update.jid,  DiaKeluarVote(), MessageType.text)
			
		})
	}
}