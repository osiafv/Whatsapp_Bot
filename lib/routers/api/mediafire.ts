import axios, { AxiosResponse } from "axios";
import cheerio, { CheerioAPI } from "cheerio";

export async function mediafireDown (url: string): Promise <{ link: string | undefined, size: string}> {
	return new Promise (async (resolve, reject) => {
		try {
			let RegMediaFire: RegExpExecArray | null=  /(?:http(?:s|):\/\/|)(?:www\.|)mediafire.com\/file\/([-_0-9A-Za-z]{4,18})/gi.exec(url)
			if (!RegMediaFire) return reject(new Error(String("Url Invalid")))
			const data: AxiosResponse = await axios({
				url: RegMediaFire[0], 
				method: "GET",
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
				}
			})
			const $: CheerioAPI = cheerio.load(data.data)
			let Size: RegExpMatchArray | null =  $("#downloadButton").text().trim().match(/([\.0-9A-Za-z]{2,14})/gi)
			if (!Size)  Size = ["10MB"]
			const Format: { link: string | undefined, size: string} = {
				link: $("#downloadButton").attr("href"),
				size: Size[1]
			}
			return resolve(Format)
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}