import axios, { AxiosResponse } from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import { FaceBookDown } from "../../typings"
import { config } from "dotenv"
config({ path: './env' })


export async function FacebookDown (url: string): Promise <FaceBookDown> {
	return new Promise(async (resolve, reject) => {
		const RegFb: RegExpMatchArray | null = url.match(/(?:http(?:s|):\/\/|)(?:www\.|)facebook.com\/([0-9A-Za-z]{2,16})\/videos\/([0-9]{2,18})/gi)
		if (!RegFb) return reject(new Error("Data Invalid"))
		let getCookies: { cookie?: string | undefined}= {
			"cookie": process.env.cookieFacebook
		}
		if (!getCookies?.cookie) getCookies = {}
		const data: AxiosResponse = await axios({
			url: RegFb[0],
			method: "GET",
			headers: {
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
				...getCookies 
			}
		})
		const $: CheerioAPI= cheerio.load(data.data)
		const getData = JSON.parse(String($('script[type="application/ld+json"]').html()))
		let Durasi: string = getData.duration
		Durasi = Durasi.toUpperCase().replace("T", "");
		Durasi = Durasi.split("").map((x: string, y: number) => !parseInt(x) ? (y === Durasi.length - 1 ? "" : ":") : x).join("");
		const Format: FaceBookDown = {
			nama: getData.name,
			desk: getData.description,
			rawVideo: getData.contentUrl,
			thumbnail: getData.thumbnailUrl,
			uploadedAt: new Date(getData.uploadDate),
			durasi: Durasi,
			url_stream: getData.url,
			publishedAt: new Date(getData.datePublished),
			width: getData.width,
			height: getData.height,
			nsfw: !getData.isFamilyFriendly,
			genre: getData.genre,
			keywords: getData.keywords ? getData.keywords.split(", ") : [],
			total_koment: getData.commentCount,
			size: getData.contentSize,
			quality: getData.videoQuality,
			username: getData.author.name, 
			transcript: getData.transcript
		}
		return resolve(Format)
	})
}