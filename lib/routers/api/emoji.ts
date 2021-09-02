import axios, { AxiosResponse } from "axios";
import cheerio, { CheerioAPI } from "cheerio";

export async function EmojiAPI (emoji: string): Promise <{ url: string, name: string }[]> {
	return new Promise (async (resolve, reject) => {
		try {
			const data: AxiosResponse = await axios({
				url: `${encodeURI(`https://emojipedia.org/${emoji}/`)}`,
				method: "GET",
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
				}
			})
			const $: CheerioAPI = cheerio.load(data.data)
			let Hasil: { url: string, name: string }[] = []
			$("body > div.container > div.content").find("article > section.vendor-list > ul").each(function (Emo, ji) {
				$(ji).find("li").each(function (co, El) {
					let Url: string | undefined = $(El).find(" div.vendor-container.vendor-rollout-target > div.vendor-image > img").attr("srcset") ?? $(El).find(" div.vendor-container.vendor-rollout-target > div.vendor-image > img").attr("href")
					const Types: string = $(El).find("div.vendor-container.vendor-rollout-target > div.vendor-info > h2 > a").text().trim()
					if (!Url) return
					const Format: { url: string, name: string } = {
						url: Url.split(" ")[0],
						name: Types
					}
					Hasil.push(Format)
				})
			})
			return resolve(Hasil)
		} catch(err) {
			return reject(new Error(String(err)))
		}
	})
}