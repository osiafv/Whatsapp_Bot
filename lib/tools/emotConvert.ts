import { exec, ExecException } from "child_process"
import { Buffer, RandomName, isUrl } from "../functions/function";
import * as fs from "fs";
import { createExif } from "../tools"


export const EmojiWebpTopng = async (Url: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		if (!isUrl(Url)) return reject(new Error("Bukan Url"))
		let getFile: string = "./lib/storage/temp/" + RandomName(14) + ".png"
		let Returns: string =  "./lib/storage/temp/" + RandomName(17) + ".webp"
		fs.writeFileSync(getFile, await Buffer(Url))
		exec(`ffmpeg -i ${getFile} ${Returns}`, async function (err: ExecException | null, respon) {
			if (err) return reject(new Error(String (err)))
			if (fs.existsSync(getFile)) fs.unlinkSync(getFile)
			if (fs.existsSync(Returns))  return resolve(Returns)
		})
	})
}
export const ConvertStickerEmoWM = async (path: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		if (!fs.existsSync(path)) return reject(new Error("Path not found"))
		const exifPath: string = `./lib/storage/exif/Ra_default_exif`
		if (!fs.existsSync(exifPath + '.exif')) await createExif('RA BOT', '', exifPath)
		exec(`webpmux -set exif ${exifPath}.exif ${path} -o ${path}`, async function (error: ExecException | null) {
			if (error) {
				if (fs.existsSync(path)) fs.unlinkSync(path)
				return reject(error)
			} else {
				if (fs.existsSync(path)) return resolve(path)
			}
		})
	})
}
export async function StickerEmoji (Url: string): Promise <string> {
	return new Promise (async (resolve, reject) => {
		try {
			let data: string = await EmojiWebpTopng(Url)
			await ConvertStickerEmoWM(data).then((value) => {
				return resolve(value)
			}).catch((err) => reject(err))
		} catch(err) {
			return reject(new Error(String(err)))
		}
	})
}