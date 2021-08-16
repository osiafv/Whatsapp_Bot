const gis = require("g-i-s");
const google = require("google-it");
import { GIS, Googlesearch } from "../../typings"

export async function GoogleImage (querry: string): Promise <GIS[]> {
	return new Promise (async (resolve, reject) => {
		await gis(String(querry), (err: Error, data: GIS[]) => {
			if (err) return reject(new Error (String(err)))
			return resolve(data)
		})
	})
}

export async function GoogleSearch (querry: string): Promise <Googlesearch[]> {
	return new Promise (async (resolve, reject) => {
		await google({'query': querry, "disableConsole": true}).then((respon: Googlesearch[]) => {
			return resolve(respon)
		}).catch((err: Error) => {
			return reject(new Error(String(err)))
		})
	})
}