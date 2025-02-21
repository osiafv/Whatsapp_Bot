import * as fs from 'fs'
import { exec, ExecException } from 'child_process'
import { promisify } from 'util'
import { RandomName } from '../functions/function'
import GIFEncoder from 'gifencoder';
import jimp from "jimp"
const webp = require('node-webpmux')
const execute = promisify(exec)

export async function toVideoV2(input: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const img = new webp.Image()
        const output: string = `./lib/storage/temp/${RandomName(29)}.mp4`
        const temp: string = './lib/storage/temp/'
        await img.load(input)
        let frames: number = img.anim.frames.length
        for (let i: number = 0; frames > i; i++) {
            await execute(`webpmux -get frame ${i} ${input} -o ${temp}${i}.webp`)
            await execute(`dwebp ${temp}${i}.webp -o ${temp}${i}.png`)
        }
        await execute(`ffmpeg -framerate 22 -i ${temp}%d.png -y -c:v libx264 -pix_fmt yuv420p -loop 4 ${output}`)
        for (frames === 0; frames--; ) {
            fs.unlinkSync(`${temp}${frames}.webp`)
            fs.unlinkSync(`${temp}${frames}.png`)
        }
        if (fs.existsSync(output)) resolve(output)
    })
}
export async function Tomp3(input: string): Promise<string | Error> {
    return new Promise(async (resolve, reject) => {
        const output: string = `./lib/storage/temp/${RandomName(22)}.mp3`
        exec(`ffmpeg -i ${input} -b:a 192K -vn ${output}`, function (error: ExecException | null) {
            if (error) {
                if (fs.existsSync(input)) fs.unlinkSync(input)
                reject(error)
            } else {
                if (fs.existsSync(input)) fs.unlinkSync(input)
                if (fs.existsSync(output)) resolve(output)
            }
        })
    })
}
export async function ImgCircle (input: string): Promise <string> {
	return new Promise (async (resolve, reject) => {
		try {
			const Path: string = './lib/storage/temp/' + RandomName(22) + '.png'
			await jimp.read(input, async (err, lenna) => {
				lenna.circle()
				lenna.background(0)
				await lenna.writeAsync(Path)
				if (fs.existsSync(input)) fs.unlinkSync(input)
				return resolve(Path)
			})
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}
export async function WebpCircle (input: string): Promise <string> {
	return new Promise (async (resolve, reject) => {
		const Path: string = './lib/storage/temp/' + RandomName(18) + '.png'
		await exec(`ffmpeg -i ${input} ${Path}`, async (err, call) => {
			if (err) {
				await exec(`magick ${input} ${Path}`, async (err, call) => {
					if (err) throw reject(err);
					await jimp.read(Path, async (err, lenna) => {
						if (err) throw reject(err);
						if (fs.existsSync(input)) fs.unlinkSync(input)
						lenna.circle()
						lenna.background(0)
						await lenna.writeAsync(Path)
						return resolve(Path)
					})
				})
			} else if (fs.existsSync(input)) {
				fs.unlinkSync(input)
				await jimp.read(Path, async (err, lenna) => {
					if (err) throw reject(err)
					if (fs.existsSync(input)) fs.unlinkSync(input)
					lenna.circle()
					lenna.background(0)
					await lenna.writeAsync(Path)
					return resolve(Path)
				})
			}
		})
	})
}
export async function Toimg(input: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const Path: string = './lib/storage/temp/' + RandomName(18) + '.png'
        await exec(`ffmpeg -i ${input} ${Path}`, async (err, call) => {
            if (err) throw reject(err)
            if (fs.existsSync(input)) fs.unlinkSync(input)
            if (fs.existsSync(Path)) return resolve(Path)
        })
    })
}
export async function Tocute(input: string): Promise<string | Error> {
    return new Promise(async (resolve, reject) => {
        const output: string = `./lib/storage/temp/${RandomName(31)}.mp3`
        exec(`ffmpeg -i ${input} -af atempo=3/4,asetrate=44500*4/3 ${output}`, function (error: ExecException | null) {
            if (error) {
                if (fs.existsSync(input)) fs.unlinkSync(input)
                reject(error)
            } else {
                if (fs.existsSync(input)) fs.unlinkSync(input)
                if (fs.existsSync(output)) resolve(output)
            }
        })
    })
}
