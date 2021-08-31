import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import {  RandomArray } from "../../functions/function";
import { config } from "dotenv"
config({ path: './env' })

let getCookies: { cookie?: string} = {
	"cookie": process.env.cookiePinterest
}
if (!getCookies?.cookie) getCookies = {}

export async function Pinterest(title: string, headers?: AxiosRequestConfig): Promise <string[]> {
	return new Promise (async (resolve, reject) => {
		headers = headers ?? {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90. 0.4430.212 Safari/537.36",
				...getCookies
			}
		};
		await axios.request({
			url: `https://id.pinterest.com/search/pins/?q=${title}&rs=typed&term_meta[]=${title}%7Ctyped`,
			method: "GET",
			...headers
		}).then((data: AxiosResponse) => {
			const $: CheerioAPI  = cheerio.load(data.data)
			const result: string[] = []
			$("div > div > div > div > div > div > div:nth-child(1) > div > div > div > div:nth-child(1)").each(function (a, b) {
				$(b).find("div").each(function (c, d) {
					const url = $(d).find("a > div > div > div > div > div > div > div > img").attr("src")
					if (url === undefined) return;
					result.push(url.replace(/236x/, "originals"))
				})
			})
			let hasil: string[] = result.filter(function(res1, res2) {
				return result.indexOf(res1) == res2
			})
			hasil = RandomArray(hasil)
			return resolve(hasil)
		}).catch ((err: Error) => {
			return reject(err)
		})
	})
}