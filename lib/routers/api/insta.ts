import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { instaStalk, IgReelsDown, IgPostDown, IgTvDown } from '../../typings'
import got from 'got'
import cheerio, { CheerioAPI } from 'cheerio'
import { config } from "dotenv"
config({ path: './env' })

let getCookies: { cookie?: string} = {
	"cookie": process.env.cookieIg
}
if (!getCookies?.cookie) getCookies = {}

export const InstaStalk = async (username: string, headers?: AxiosRequestConfig): Promise<instaStalk> => {
    return new Promise(async (resolve, reject) => {
        const Headers: AxiosRequestConfig = headers == undefined ? { headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
			...getCookies
		}
	} : headers
        await axios.get(`https://www.instagram.com/${username}/?__a=1`, Headers).then((data: AxiosResponse) => {
                if (data.status !== 200) return reject(new Error(`Error status code : ${data.status}`))
                const Format: instaStalk = {
                    id: data.data.graphql.user.id,
                    username: data.data.graphql.user.username,
                    nickname: data.data.graphql.user.full_name,
                    thumb: data.data.graphql.user.profile_pic_url_hd,
                    bio: data.data.graphql.user.biography,
                    id_fb: data.data.graphql.user.fbid,
                    akun_bisnis: data.data.graphql.user.is_business_account,
                    category: data.data.graphql.user.category_name,
                    private: data.data.graphql.user.is_private,
                    centang: data.data.graphql.user.is_verified,
                    total_post: data.data.graphql.user.edge_owner_to_timeline_media.count,
					follower: data.data.graphql.user.edge_followed_by.count,
					following: data.data.graphql.user.edge_follow.count
                }
                resolve(Format)
            })
            .catch((err: Error) => reject(err))
    })
}
export const InstaStalkV2 = async (username: string): Promise<instaStalk> => {
    return new Promise(async (resolve, reject) => {
        try {
            const Data: any = await got(`https://www.instagram.com/${username}/`, {
                searchParams: { __a: 1 }
            })
            if (Data.statusCode !== 200) return reject(new Error(`Error status code : ${Data.statusCode}`))
            const data: any = Data.json()
            const Format: instaStalk = {
                id: data.graphql.user.id,
                username: data.graphql.user.username,
                nickname: data.graphql.user.full_name,
                thumb: data.graphql.user.profile_pic_url_hd,
                bio: data.graphql.user.biography,
                id_fb: data.graphql.user.fbid,
                akun_bisnis: data.graphql.user.is_business_account,
                category: data.graphql.user.category_name,
                private: data.graphql.user.is_private,
                centang: data.graphql.user.is_verified,
                total_post: data.graphql.user.edge_owner_to_timeline_media.count,
				follower: data.graphql.user.edge_followed_by.count,
				following: data.graphql.user.edge_follow.count
            }
            resolve(Format)
        } catch (err) {
            reject(err)
        }
    })
}
export const InstaStalkV3 = async (username: string): Promise<instaStalk> => {
    return new Promise(async (resolve, reject) => {
        try {
            let Format: instaStalk | any
            const data: AxiosResponse = await axios.get(`https://www.instagram.com/${username}/`, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
                }
            })
            if (data.status !== 200) return reject(new Error(`Error status code : ${data.status}`))
            const $: CheerioAPI = cheerio.load(data.data)
            try {
                const script: string | null = $('script').eq(3).html()
                let Regex: RegExpExecArray | null = /window\._sharedData = (.+);/g.exec(script || '')
                if (Regex == null) return
                const {
                    entry_data: {
                        ProfilePage: {
                            [0]: {
                                graphql: { user }
                            }
                        }
                    }
                } = JSON.parse(Regex[1])
                Format = {
                    id: user.id,
                    username: user.username,
                    nickname: user.full_name,
                    thumb: user.profile_pic_url_hd,
                    bio: user.biography,
                    id_fb: user.fbid,
                    akun_bisnis: user.is_business_account,
                    category: user.category_name,
                    private: user.is_private,
                    centang: user.is_verified,
                    total_post: user.edge_owner_to_timeline_media.count,
					follower: user.edge_followed_by.count,
					following: user.edge_follow.count
                }
            } catch (err) {
                const script: string | null = $('script').eq(4).html()
                let Regex: RegExpExecArray | null = /window\._sharedData = (.+);/g.exec(script || '')
                if (Regex == null) return
                const {
                    entry_data: {
                        ProfilePage: {
                            [0]: {
                                graphql: { user }
                            }
                        }
                    }
                } = JSON.parse(Regex[1])
                Format = {
                    id: user.id,
                    username: user.username,
                    nickname: user.full_name,
                    thumb: user.profile_pic_url_hd,
                    bio: user.biography,
                    id_fb: user.fbid,
                    akun_bisnis: user.is_business_account,
                    category: user.category_name,
                    private: user.is_private,
                    centang: user.is_verified,
                    total_post: user.edge_owner_to_timeline_media.count,
					follower: user.edge_followed_by.count,
					following: user.edge_follow.count
                }
            } finally {
                resolve(Format)
            }
        } catch (err) {
            reject(err)
        }
    })
}
export async function InstaDownloader (url: string): Promise <IgPostDown | IgReelsDown | IgTvDown> {
	return new Promise (async (resolve, reject) => {
		const RegPost: RegExpExecArray | null= /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/p\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		const RegReels: RegExpExecArray | null = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/reel\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		const RegIgTv: RegExpExecArray | null =   /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/tv\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		try {
			if (RegPost) {
				let BaseUrlPost: string = `https://www.instagram.com/p/`
				const data: AxiosResponse = await axios({
					url: BaseUrlPost + RegPost[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						...getCookies
					}
				})
				const image = data.data.graphql.shortcode_media.edge_sidecar_to_children.edges.filter((v: any) => v.node.__typename === "GraphImage")
				const video =  data.data.graphql.shortcode_media.edge_sidecar_to_children.edges.filter((v: any)  => v.node.__typename === "GraphVideo")
				const getData: { isVideo: boolean, url: string}[] = []
				for (let result of image) {
					getData.push({ isVideo: false, url: result.node.display_url })
				}
				for  (let result of video) {
					getData.push({ isVideo: true, url: result.node.video_url})
				}
				const format: IgPostDown = {
					getData,
					caption: data.data.graphql.shortcode_media. edge_media_to_caption.edges[0].node. text,
					username: data.data.graphql.shortcode_media.owner.username,
					like: data.data.graphql.shortcode_media. edge_media_preview_like.count
				}
				return resolve(format)
			} else if (RegReels) {
				let BaseUrlReel: string = "https://www.instagram.com/reel/"
				const data: AxiosResponse = await axios({
					url: BaseUrlReel + RegReels[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						...getCookies
					}
				})
				const Format: IgReelsDown = {
					link: data.data.graphql. shortcode_media.video_url,
					total_views: data.data.graphql. shortcode_media.video_view_count,
					total_plays:  data.data.graphql. shortcode_media.video_play_count,
					total_koment: data.data.graphql. shortcode_media.edge_media_preview_comment.count,
					username:  data.data.graphql. shortcode_media.owner.username,
					durasi: data.data.graphql. shortcode_media.video_duration,
					thumbnail:  data.data.graphql. shortcode_media.thumbnail_src,
					like: data.data.graphql. shortcode_media.edge_media_preview_like.count
				}
				return resolve(Format)
			} else if (RegIgTv) {
				let BaseUrlIgtv: string = "https://www.instagram.com/tv/"
				const data: AxiosResponse = await axios({
					url: BaseUrlIgtv + RegIgTv[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						...getCookies
					}
				})
				const Format: IgTvDown = {
					link: data.data.graphql.shortcode_media.video_url,
					thumbnail: data.data.graphql.shortcode_media.thumbnail_src,
					title: data.data.graphql.shortcode_media.title,
					total_coment:  data.data.graphql.shortcode_media.edge_media_preview_comment.count,
					total_view:  data.data.graphql.shortcode_media.video_view_count,
					total_play:   data.data.graphql.shortcode_media.video_play_count,
					username:  data.data.graphql.shortcode_media.owner.username,
			
				}
				return resolve(Format)
			} else {
				return reject(new Error(String("Url Invalid")))
			}
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}