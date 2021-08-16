const playstore = require("playstore-scraper");
import { PlayStore } from "../../typings"

export async function PlaystoreSearch (title: string): Promise <PlayStore[]> {
	return new Promise(async (resolve, reject) => {
		try {
			const data = await playstore.search(title)
			if (!data.found) return reject(new Error(String("Tidak ditemukan")))
			return resolve(data.results)
		} catch(err) {
			return reject(new Error(String(err)))
		}
	})
}