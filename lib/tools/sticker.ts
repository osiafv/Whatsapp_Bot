import { exec,  ExecException } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import { createExif, Sticker } from "wa-sticker-formatter";
import { RandomName, Buffer, isUrl } from "../functions/function";
import { videoToWebp, gifToWebp, pngToWebp } from "../routers/api"

export async function createStickerV3 (input: string, wm?: string): Promise <string> {
	return new Promise (async (resolve, reject) => {
		if (/^(mp4|gif)$/i.test(input.split(".")[2])) {
			await videoToWebp(input).then(async (res: { status: number, data: string }) => {
				if (!isUrl(res.data)) return reject(new Error("ERROR DATA Undefined"))
				const Output: string = `./lib/storage/temp/${RandomName(39)}.webp`
				const toBuffer: Buffer = await Buffer(res.data)
				await fs.writeFileSync(Output, toBuffer)
				if (fs.existsSync(Output)) {
					const exifPath: string = typeof wm == "string" ? `./lib/storage/exif/${RandomName(25)}` : `./lib/storage/exif/Ra_default_exif`;
					if (!fs.existsSync(exifPath + ".exif")) await createExif(wm || "RA BOT", "", exifPath)
					exec(`webpmux -set exif ${exifPath}.exif ${Output} -o ${Output}`, async function (error: ExecException | null) {
						if (error) {
							if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
							if (fs.existsSync(Output)) fs.unlinkSync(Output);
							reject(error)
						} else {
							if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
							if (fs.existsSync(Output)) resolve(Output)
						}
					})
				}
			})
		} else {
			await pngToWebp(input).then(async (res: any) => {
				if (!isUrl(res.data)) return reject(new Error("ERROR DATA Undefined"))
				const Output: string = `./lib/storage/temp/${RandomName(39)}.webp`
				const toBuffer: Buffer = await Buffer(res.data)
				await fs.writeFileSync(Output, toBuffer)
				if (fs.existsSync(Output)) {
					const exifPath: string = typeof wm == "string" ? `./lib/storage/exif/${RandomName(25)}` : `./lib/storage/exif/Ra_default_exif`;
					if (!fs.existsSync(exifPath + ".exif")) await createExif(wm || "RA BOT", "", exifPath)
					exec(`webpmux -set exif ${exifPath}.exif ${Output} -o ${Output}`, async function (error: ExecException | null) {
						if (error) {
							if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
							if (fs.existsSync(Output)) fs.unlinkSync(Output);
							reject(error)
						} else {
							if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
							if (fs.existsSync(Output)) resolve(Output)
						}
					})
				}
			})
		}
	})
}
export async function createStickerV2 (input: string, wm?: string): Promise <string | Error> {
	return new Promise (async (resolve, reject) => {
		if (!/^(mp4|gif)$/i.test(input.split(".")[2])) {
			const output: string =  `./lib/storage/temp/${RandomName(11)}.webp`;
			exec(`magick ${input} ${output}`, async (err: ExecException | null, respon) => {
				if (err) return reject(err);
				const exifPath: string = typeof wm == "string" ? `./lib/storage/exif/${RandomName(25)}` : `./lib/storage/exif/Ra_default_exif`;
				if (!fs.existsSync(exifPath + ".exif")) await createExif(wm || "RA BOT", "", exifPath)
				exec(`webpmux -set exif ${exifPath}.exif ${output} -o ${output}`, async function (error: ExecException | null) {
					if (error) {
						if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
						if (fs.existsSync(output)) fs.unlinkSync(output);
						reject(error)
					} else {
						if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
						if (fs.existsSync(output)) resolve(output)
					}
				})
			})
		} else {
			await videoToWebp(input).then(async (res: { status: number, data: string }) => {
				if (!isUrl(res.data)) return reject(new Error("ERROR DATA Undefined"))
				const Output: string = `./lib/storage/temp/${RandomName(39)}.webp`
				const toBuffer: Buffer = await Buffer(res.data)
				await fs.writeFileSync(Output, toBuffer)
				if (fs.existsSync(Output)) {
					const exifPath: string = typeof wm == "string" ? `./lib/storage/exif/${RandomName(25)}` : `./lib/storage/exif/Ra_default_exif`;
					if (!fs.existsSync(exifPath + ".exif")) await createExif(wm || "RA BOT", "", exifPath)
						exec(`webpmux -set exif ${exifPath}.exif ${Output} -o ${Output}`, async function (error: ExecException | null) {
					if (error) {
						if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
						if (fs.existsSync(Output)) fs.unlinkSync(Output);
						reject(error)
					} else {
						if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
						if (fs.existsSync(Output)) resolve(Output)
					}
				})
			}
		})
	} 
})
}
export async function CreateSticker (input: string, wm?: string): Promise <string | Error> {
	return new Promise(async (resolve, reject) => {
		if (/^(mp4|gif)$/i.test(input.split(".")[2])) {
			const output: string =  `./lib/storage/temp/${Date.now()}.webp`;
			const exifPath: string = typeof wm == "string" ? `./lib/storage/exif/${RandomName(28)}` : `./lib/storage/exif/Ra_default_exif`;
			await ffmpeg(input)
			.inputFormat(`${input.split(".")[2]}`)
			.on("start", function () {
				console.log("[START FFMPEG]")
			})
			.on("error", function (error) {
				reject(error)
			})
			.on("end", async function () {
				if (fs.existsSync(input)) fs.unlinkSync(input)
				if (!fs.existsSync(exifPath + ".exif")) await createExif(`${wm}`, "", exifPath)
				exec(`webpmux -set exif ${exifPath}.exif ${output} -o ${output}`, function (error: ExecException | null) {
					if (error) {
						if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
						if (fs.existsSync(output)) fs.unlinkSync(output);
						reject(error)
					} else {
						if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
						if (fs.existsSync(output)) resolve(output)
					}
				})
			})
			.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(360,iw)':min'(360,ih)':force_original_aspect_ratio=decrease,fps=15, pad=360:360:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
			.toFormat('webp')
			.save(output)
		} else if (/^(webp)$/i.test(input.split(".")[2])) {
			const exifPath: string = typeof wm == "string" ? `./lib/storage/exif/${RandomName(25)}` : `./lib/storage/exif/Ra_default_exif`;
			if (!fs.existsSync(exifPath + ".exif")) await createExif(wm || "RA BOT", "", exifPath)
			exec(`webpmux -set exif ${exifPath}.exif ${input} -o ${input}`, async function (error: ExecException | null) {
				if (error) {
					if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
					reject(error)
				} else {
					if (fs.existsSync(exifPath + ".exif") && typeof wm == "string") fs.unlinkSync(exifPath + ".exif");
					if (fs.existsSync(input)) resolve(input)
				}
			})
		} else {
			const outpath: string = `./lib/storage/temp/${RandomName(20)}.webp`
			const sticker: Sticker = new Sticker(input, { crop: false,  pack: typeof wm === "string" ? wm : "RA BOT", author: " "})
			await sticker.build()
			const output: Buffer = await sticker.get()
			await fs.writeFileSync(outpath, output)
			if (fs.existsSync(outpath)) resolve(outpath)
		}
	})
}
