import { TiktokStalk } from '../../typings'
import axios, { AxiosResponse } from 'axios'
import cheerio, { CheerioAPI } from 'cheerio'
import { convertAngka } from "../../functions/function";


export async function tiktokStalk(username: string): Promise<TiktokStalk> {
    return new Promise(async (resolve, reject) => {
        const User: string = username.startsWith('@') ? username : '@' + username
        await axios({
            url: `https://www.tiktok.com/${User}?lang=id`,
            method: 'GET',
            headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36' 
            }
        }).then((data: AxiosResponse) => {
			const $: CheerioAPI = cheerio.load(data.data)
            const res: any = $('body').find('#__NEXT_DATA__').get()[0].children[0]
            const result = JSON.parse(res.data).props.pageProps.userInfo.user
			const Stat = JSON.parse(res.data).props.pageProps.userInfo.stats
			const Format: TiktokStalk = {
				...result,
				follower: convertAngka(Number(Stat.followerCount)),
				following: convertAngka(Number(Stat.followingCount)),
				suka: convertAngka(Number(Stat.heart)),
				total_video: Stat. videoCount,
			}
			resolve(Format)
		}).catch((err: Error) => {
			reject(err)
			})
    })
}
