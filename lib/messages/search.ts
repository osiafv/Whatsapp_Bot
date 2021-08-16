import { Downloader } from '.';
import { Client } from '../src/Client';
import { ConnectMoongo } from '../database/mongoodb/main';
import { GoogleImage,  GoogleSearch,  BrainlySearch,  GroupWa,  YtSearch,  Pinterest, Wikipedia,  SearchSticker,  PlaystoreSearch  } from "../routers/api"
import { WAConnection, MessageType, compressImage  } from "@adiwajshing/baileys";
import { Commands, GIS, Googlesearch, Question, Answer, PlayStore } from "../typings";
import {  CreateSticker } from "../tools"
import { IndSuccesSearch, IndTungguSearch,  IndLebihDariLimit, IndQuerryKosong, IndGoogleSearch,  IndGoogleKosong, IndBrainly, IndGroupWa,  IndSearchYt, IndWikipedia, IndPlayStore   } from "../lang/ind";
import parsems, { Parsed } from "parse-ms";
import { isUrl, Buffer, RandomName, Tunggu, RandomArray } from '../functions/function';
import { VideoSearchResult } from "yt-search";
import * as fs from "fs"
import filetype, { FileTypeResult } from "file-type";
import { Toimg } from "../tools"

export class Searching extends Downloader {
    constructor(public Ra: Client, public database: ConnectMoongo) {
        super(Ra, database)
    }
    public sendResponse() {
        this.SendDownloader()
		this.GIS()
		this.Google()
		this.Brainly()
		this.SearchGroup()
		this.ytSearch()
		this.pinterest()
		this.Wikiped()
		this.StickerSearch()
		this.PlayStor()
    }
	private async PlayStor () {
		globalThis.CMD.on("search|playstore", ["searchplaystore", "playstore"], async (res: WAConnection, data: Commands) => {
			const { from, args, mess }= data
			if (!args[0]) return this.Ra.reply(from, IndQuerryKosong(), mess)
			this.Ra.reply(from,  IndTungguSearch(), mess)
			await  PlaystoreSearch(args.join(" ")).then(async (value: PlayStore[]) => {
				if (!value[0]) return void  this.Ra.reply(from,  IndGoogleKosong(), mess)
				const Media: Buffer = await Buffer(value[0].icon)
				const File: FileTypeResult | undefined = await filetype.fromBuffer(Media)
				if (File?.mime == "image/png") {
					return void this.Ra.sendImage(from, value[0].icon, IndPlayStore(value), mess)	
				} else {
					const Nama: string = `./lib/storage/temp/${RandomName(13)}`
					await fs.writeFileSync(Nama + String(File?.ext), (Media))
					await Toimg(Nama + String(File?.ext)).then(async (respon: string) => {
						await this.Ra.sendImage(from, respon, IndPlayStore(value), mess)	
						await Tunggu(1000)
						if (typeof respon == "string" && fs.existsSync(respon)) fs.unlinkSync(respon)
					})
				}
			}).catch(() => {
				return void this.Ra.reply(from,  IndGoogleKosong(), mess)
			})
		})
	}
	private async StickerSearch () {
		globalThis.CMD.on("search|stickersearch", ["stickersearch", "searchsticker", "stikersearch", "stikersearch", "searchstiker", "caristiker", "caristicker"], async(res: WAConnection, data: Commands) => {
			const { from, args, mess  } = data
			const Time: number = Date.now()
			if (!args[0]) return this.Ra.reply(from, IndQuerryKosong(), mess)
			this.Ra.reply(from,  IndTungguSearch(), mess)
			await SearchSticker(args.join(" ")).then(async (value: string[]) => {
				let jumlah: number = value.length
				if (value.length > 7) jumlah = 7
				let count: number = 1
				value = RandomArray(value)
				for (let result of value) {
					if  (count >= jumlah) {
						const Timer: Parsed = parsems(Date.now() - Time)
						await this.Ra.reply(from,IndSuccesSearch(String(Timer.seconds + " Detik, " + Timer.milliseconds + " Miliseconds"), "Sticker Search"))
						break
					} else {
						count++
						const Nama: string = `./lib/storage/temp/${RandomName(10)}`
						const Media: Buffer = await Buffer(result)
						const File: FileTypeResult | undefined = await filetype.fromBuffer(Media)
						await fs.writeFileSync(Nama + String(File?.ext), (Media))
						await CreateSticker(Nama + File?.ext).then(async (respon: string | Error) => {
							if (typeof respon == "string") await this.Ra.sendSticker(from, respon, mess)
							await Tunggu(1000)
							if (typeof respon == "string" && fs.existsSync(respon)) fs.unlinkSync(respon)
						})
					}
				}
			})
		})
	}
	private async Wikiped () {
		globalThis.CMD.on("search|wikipedia", ["wikipedia", "wiki"], async (res: WAConnection, data: Commands) => {
			const { from, args, mess } = data
			if (!args[0]) return this.Ra.reply(from, IndQuerryKosong(), mess)
			this.Ra.reply(from,  IndTungguSearch(), mess)
			await Wikipedia(args.join(" ")).then(async (value: { url: string, judul: string, publish: string, desk: string, thumb: string, penjelasan: string}) => {
				const Media: Buffer = await Buffer(value.thumb)
				const Thumb: any = await compressImage(Media)
				return void await res.sendMessage(from, Media, MessageType.image, { caption: IndWikipedia(value), quoted: mess, thumbnail: Thumb})
			})
		})
	}
	private async pinterest () {
		globalThis.CMD.on("search|pinterest", ["pinterest", "pinteres"], async (res: WAConnection, data: Commands) => {
			const { from, args, mess} = data
			if (!args[0]) return this.Ra.reply(from, IndQuerryKosong(), mess)
			const Time: number = Date.now()
			let count: number = 1;
			const Jumlah: number = isNaN(Number(args[0])) ? 5 : Number(args[0])
			if (!isNaN(Number(args[0]))) {
				args.shift()
			}
			if (Jumlah > 8) return this.Ra.reply(from,  IndLebihDariLimit(8, "Pinterest"), mess)
			this.Ra.reply(from,  IndTungguSearch(), mess)
			try {
				await  Pinterest(args.join(" ")).then(async (value: string[]) => {
					if (!value[0]) return void this.Ra.reply(from,  IndGoogleKosong(), mess)
					for (let result of value) {
						if (count > Jumlah) {
							const Timer = parsems(Date.now() - Time)
							await this.Ra.reply(from,IndSuccesSearch(String(Timer.seconds + " Detik, " + Timer.milliseconds + " Miliseconds"), "Pinterest"))
							break;
						} else  if (Jumlah >= value.length) {
							const Timer: Parsed = parsems(Date.now() - Time)
							await this.Ra.reply(from,IndSuccesSearch(String(Timer.seconds + " Detik, " + Timer.milliseconds + " Miliseconds"), "Pinterest"))
							break;
						} else {
							const Media: Buffer =  await Buffer(result)
							const Thumb: any =  await compressImage(Media)
							await res.sendMessage(from, Media, MessageType.image, { quoted: mess, thumbnail: Thumb})
							count++
						}
					}
				})
			} catch (err) {
				return void this.Ra.reply(from,  IndGoogleKosong(), mess)
			}
		})
	}
	private async ytSearch () {
		globalThis.CMD.on("search|ytsearch", ["ytsearch", "cariyt"], async (res: WAConnection, data: Commands) => {
			const { from, args, mess } = data
			if (!args[0]) return this.Ra.reply(from, IndQuerryKosong(), mess)
			this.Ra.reply(from,  IndTungguSearch(), mess)
			await  YtSearch(args.join(" ")).then((respon: VideoSearchResult[]) => {
				if (!respon[0]) return void this.Ra.reply(from,  IndGoogleKosong(), mess)
				return void this.Ra.sendImage(from, respon[0].thumbnail ?? respon[0].image,  IndSearchYt(respon), mess)
			}).catch(() => {
				return void this.Ra.reply(from,  IndGoogleKosong(), mess)
			})
		})
	}
	private async SearchGroup () {
		globalThis.CMD.on("search|groupwa", ["searchgroup", "searchgc", "carigc", "searchgrup", "groupwa", "wagroup", "grupwa", "wagrup"], async (res: WAConnection, data: Commands) => {
			const { from, args, mess } = data
			if (!args[0]) return this.Ra.reply(from, IndQuerryKosong(), mess)
			this.Ra.reply(from,  IndTungguSearch(), mess)
			await  GroupWa(args.join(" ")).then((respon: { status: number; name: string; link: string | undefined }[]) => {
				if (!respon[0]) return void this.Ra.reply(from,  IndGoogleKosong(), mess)
				return void this.Ra.reply(from, IndGroupWa(respon), mess)
			}).catch(() => {
				return void this.Ra.reply(from,  IndGoogleKosong(), mess)
			})
		})
	}
	private async Brainly () {
		globalThis.CMD.on("search|brainly", ["brainly", "brainlysearch"], async (res: WAConnection, data: Commands) => {
			const { from, args, mess } = data
			if (!args[0]) return this.Ra.reply(from, IndQuerryKosong(), mess)
			this.Ra.reply(from,  IndTungguSearch(), mess)
			await  BrainlySearch(args.join(" ")).then((value: { question: Question, answers: Answer[] }[]) => {
				this.Ra.reply(from, IndBrainly(value), mess)
			}).catch(() => {
				return void this.Ra.reply(from,  IndGoogleKosong(), mess)
			})
		})
	}
	private async Google () {
		globalThis.CMD.on("search|google", ["google", "googlesearch"], async (res: WAConnection, data: Commands) => {
			const { from, args, mess } = data
			if (!args[0]) return this.Ra.reply(from, IndQuerryKosong(), mess)
			this.Ra.reply(from,  IndTungguSearch(), mess)
			await  GoogleSearch(args.join(" ")).then((value: Googlesearch[]) => {
				if (!value[0]) return void this.Ra.reply(from,  IndGoogleKosong(), mess)
				return void this.Ra.reply(from,  IndGoogleSearch(value), mess)
			}).catch(() => {
				return void this.Ra.reply(from,  IndGoogleKosong(), mess)
			})
		})
	}
	private async GIS () {
		globalThis.CMD.on("search|googleimg", ["googleimg", "googleimage"], async (res: WAConnection, data: Commands) => {
			const { from, args, mess } = data
			const Time: number = Date.now()
			let count: number = 1;
			const Jumlah: number = isNaN(Number(args[0])) ? 7 : Number(args[0])
			if (!isNaN(Number(args[0]))) {
				args.shift()
			}
			if (Jumlah > 12) return this.Ra.reply(from,  IndLebihDariLimit(12, "Google Image"), mess)
			if (!args[0]) return this.Ra.reply(from, IndQuerryKosong(), mess)
			this.Ra.reply(from,  IndTungguSearch(), mess)
			await GoogleImage(args.join(" ")).then(async (result: GIS[]) => {
				if (!result[0]) return void this.Ra.reply(from,  IndGoogleKosong(), mess)
				for (let respon of  result) {
					if (count > Jumlah) {
						const Timer: Parsed = parsems(Date.now() - Time)
						await this.Ra.reply(from,IndSuccesSearch(String(Timer.seconds + " Detik, " + Timer.milliseconds + " Miliseconds"), "Google Image"))
						break
					} else {
						const Media: Buffer =  await Buffer(respon.url)
						const Thumb: any =  await compressImage(Media)
						await res.sendMessage(from, Media, MessageType.image, { quoted: mess, thumbnail: Thumb})
						count++
					}
				}
			}).catch(() => {
				return void this.Ra.reply(from,  IndGoogleKosong(), mess)
			})
		})
	}
}
