import axios, { AxiosResponse } from "axios";
import cheerio, { CheerioAPI } from "cheerio"


export async function SearchSticker (title: string): Promise <string[]> {
	return new Promise (async (resolve, reject) => {
		await axios({
			url: "https://getstickerpack.com/stickers?query=" + title,
			method: "GET"
		}).then(async (value: AxiosResponse) => {
			const $: CheerioAPI = cheerio.load(value.data)
			const Data: string[] = []
			$('#stickerPacks > div > div:nth-child(3)').each(function (_a, b) {
				$(b).find('div').each(function (_c, d) {
					const url = $(d).find('a').attr('href');
					if (!url) return
					Data.push(url);
				});
			});
			await axios({
				url:  Data[Math.floor(Math.random() * (Data.length))],
				method: "GET"
			}).then((respon: AxiosResponse) => {
				const ch: CheerioAPI = cheerio.load(respon.data)
				const Sticker: string[] = [];
				ch('#stickerPack > div > div.row').each(function (_a, b) {
					ch(b).find('div').each(function (_c, d) {
						const sticker = $(d).find('img').attr('data-src-large');
						if (!sticker) return
						Sticker.push(sticker);
					});
				});
				return resolve(Sticker)
			}).catch((err) => {
				return reject (new Error(String (err)))
			})
		}).catch((err) => {
			return reject (new Error(String (err)))
		})
	})
}