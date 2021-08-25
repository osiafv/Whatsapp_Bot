import ytSearch, { SearchResult, ChannelSearchResult, VideoSearchResult, VideoMetadataResult } from 'yt-search'
import axios, { AxiosResponse } from 'axios'
import cheerio, { CheerioAPI } from 'cheerio'
import  ytdl, { videoInfo, videoFormat } from 'ytdl-core';
import { convertAngka } from "../../functions/function";
import filesize from "filesize";
import { youtubeDlCore, Y2Mate, YoutubeMP3PlaySer2, YtS, snappeaAud, YoutubeMP4PlaySer2 } from "../../typings"

export async function ytStalk(channel: string): Promise<ChannelSearchResult> {
    return new Promise(async (resolve, reject) => {
        await ytSearch(channel, (err, call: SearchResult) => {
            if (err) return reject(err)
            const Channel: ChannelSearchResult = call.channels[0]
            resolve(Channel)
        })
    })
}
export async function Y2mateMp3(url: string): Promise<Y2Mate> {
    return new Promise(async (resolve, reject) => {
        try {
            const ytIdRegex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
            const Format: { url: string; q_auto: string; ajax: string } = {
                url: url,
                q_auto: '0',
                ajax: '1'
            }
            const data: AxiosResponse = await axios({
                url: 'https://www.y2mate.com/mates/en68/analyze/ajax',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                data: new URLSearchParams(Object.entries(Format))
            })
            const $: CheerioAPI = cheerio.load(data.data.result)
            const IdYt: RegExpExecArray | null = ytIdRegex?.exec(url)
            if (!IdYt) return
            const convert: { type: string, _id: string, v_id: string, ajax: number, token: string, ftype: string, fquality: string } | any = {
                type: 'youtube',
                _id: data.data.result.split(/var k__id = /)[1].split('; ')[0].replace(/"/gi, ''),
                v_id: IdYt[1],
                ajax: 1,
                token: '',
                ftype: 'mp3',
                fquality: '128'
            }
            const Upload: AxiosResponse = await axios({
                url: 'https://www.y2mate.com/mates/convert',
                method: 'POST',
                headers: {
                    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                data: new URLSearchParams(Object.entries(convert))
            })
            const ch: CheerioAPI = cheerio.load(Upload.data.result)
            const result: { link: string; thumb: string; size: string } = {
                link: ch('div').find('a').attr('href') || '',
                thumb: $('div.thumbnail.cover').find('a > img').attr('src') || '',
                size: $('#audio > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
            }
            resolve(result)
        } catch (err) {
            reject(err)
        }
    })
}
export async function Y2mateVid(url: string): Promise<{ link: string; thumb: string; size: string }> {
    return new Promise(async (resolve, reject) => {
        try {
            const ytIdRegex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
            const Format: { url: string; q_auto: string; ajax: string } = {
                url: url,
                q_auto: '0',
                ajax: '1'
            }
            const data: AxiosResponse = await axios({
                url: 'https://www.y2mate.com/mates/en12/downloader/ajax',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                data: new URLSearchParams(Object.entries(Format))
            })
            const $: CheerioAPI = cheerio.load(data.data.result)
            const IdYt: RegExpExecArray | null = ytIdRegex?.exec(url)
            if (!IdYt) return
            const convert: { type: string, _id: string, v_id: string, ajax: number, token: string, ftype: string, fquality: string } | any = {
                type: 'youtube',
                _id: data.data.result.split(/var k__id = /)[1].split('; ')[0].replace(/"/gi, '')[1],
                v_id: IdYt,
                ajax: 1,
                token: '',
                ftype: 'mp4',
                fquality: '720p'
            }
            const Upload: AxiosResponse = await axios({
                url: 'https://www.y2mate.com/mates/convert',
                method: 'POST',
                headers: {
                    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                data: new URLSearchParams(Object.entries(convert))
            })
            const ch: CheerioAPI = cheerio.load(Upload.data.result)
            const result: { link: string; thumb: string; size: string } = {
                link: ch('div').find('a').attr('href') || '',
                thumb: $('div.thumbnail.cover').find('a > img').attr('src') || '',
                size: $('#mp4 > table > tbody > tr:nth-child(2) > td:nth-child(2)').text()
            }
            resolve(result)
        } catch (err) {
            reject(err)
        }
    })
}
export async function SnappeaVid(Url: string): Promise <snappeaAud> {
    return new Promise(async (resolve, reject) => {
        try {
            const data: AxiosResponse = await axios.get('https://api.snappea.com/v1/video/details?url=' + Url)
			const Hasil = data.data.videoInfo.downloadInfoList.find((value: any) => value.formatExt == "mp4")
			if (!Hasil) return reject(new Error("Hasil Undefined"))
			const Format: snappeaAud = {
				type: Hasil.formatExt,
				size: filesize(Hasil.size),
				link: Hasil.partList[0].urlList[0]
			}
            resolve(Format)
        } catch (err) {
            reject(err)
        }
    })
}
export async function SnappeaAud(Url: string): Promise <snappeaAud> {
    return new Promise(async (resolve, reject) => {
        try {
            const data: AxiosResponse = await axios.get('https://api.snappea.com/v1/video/details?url=' + Url)
			const Hasil = data.data.videoInfo.downloadInfoList.find((value: any) => value.formatAlias == "128k")
			if (!Hasil) return reject(new Error("Hasil Undefined"))
			const Format: snappeaAud = {
				type: Hasil.formatExt,
				size: filesize(Hasil.size),
				link: Hasil.partList[0].urlList[0]
			}
            resolve(Format)
        } catch (err) {
            reject(err)
        }
    })
}
export async function keepVideoMP3(Url: string): Promise<{ link: string; size: string }> {
    return new Promise(async (resolve, reject) => {
        try {
            const res: AxiosResponse = await axios({
                url: 'https://keepv.id/',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                }
            })
            const $: CheerioAPI = cheerio.load(res.data)
            const Sid: string = $('#page-top > main').find('script:nth-child(10)').html() || ''
            const data: AxiosResponse = await axios({
                url: 'https://keepv.id/',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                    cookie: res.headers['set-cookie'][0]
                },
                data: new URLSearchParams(Object.entries({ url: Url, sid: Sid.split("'")[1].split("'")[0] }))
            })
            const ch: CheerioAPI = cheerio.load(data.data)
            const Format: { link: string; size: string } = {
                link: ch('#moreOptions > h6:nth-child(3) > div > div:nth-child(1)').find('table:nth-child(2) > tbody > tr:nth-child(3) > td.text-right > a').attr('href') || '',
                size: ch('#moreOptions > h6:nth-child(3) > div > div:nth-child(1)').find('table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(3)').text().trim()
            }
            return resolve(Format)
        } catch (err) {
            reject(err)
        }
    })
}

export async function keepVideoMP4(Url: string): Promise<{ link: string; size: string }> {
    return new Promise(async (resolve, reject) => {
        try {
            const res: AxiosResponse = await axios({
                url: 'https://keepv.id/',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                }
            })
            const $: CheerioAPI = cheerio.load(res.data)
            const Sid: string = $('#page-top > main').find('script:nth-child(10)').html() || ''
            const data: AxiosResponse = await axios({
                url: 'https://keepv.id/',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                    cookie: res.headers['set-cookie'][0]
                },
                data: new URLSearchParams(Object.entries({ url: Url, sid: Sid.split("'")[1].split("'")[0] }))
            })
            const ch: CheerioAPI = cheerio.load(data.data)
            const Format: { link: string; size: string } = {
                link: ch('#moreOptions > h6:nth-child(3) > div > div:nth-child(2)').find('table > tbody > tr:nth-child(3) > td.text-right > a').attr('href') || '',
                size: ch('#moreOptions > h6:nth-child(3) > div > div:nth-child(2)').find('table > tbody > tr:nth-child(3) > td:nth-child(3)').text().trim()
            }
            return resolve(Format)
        } catch (err) {
            reject(err)
        }
    })
}
export async function Yt1SAud(Url: string): Promise<YtS> {
    return new Promise(async (resolve, reject) => {
        try {
            const data: AxiosResponse = await axios({
                url: 'https://yt1s.com/api/ajaxSearch/index',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                data: new URLSearchParams(Object.entries({ q: Url, vt: 'home' }))
            })
            const Format: { vid: string; k: string } = {
                vid: data.data.vid,
                k: data.data.links.mp3.mp3128.k
            }
            const Upload: AxiosResponse = await axios({
                url: 'https://yt1s.com/api/ajaxConvert/convert',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                data: new URLSearchParams(Object.entries(Format))
            })
            const convert: YtS = {
                link: Upload.data.dlink,
                quality: Upload.data.fquality,
                judul: Upload.data.title,
                type: Upload.data.ftype,
                size: data.data.links.mp3.mp3128.size
            }
            resolve(convert)
        } catch (err) {
            reject(err)
        }
    })
}
export async function Yt1SVid(Url: string): Promise<YtS> {
    return new Promise(async (resolve, reject) => {
        try {
            const data: AxiosResponse = await axios({
                url: 'https://yt1s.com/api/ajaxSearch/index',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                data: new URLSearchParams(Object.entries({ q: Url, vt: 'home' }))
            })
            const Format: { vid: string; k: string } = {
                vid: data.data.vid,
                k: data.data.links.mp4['136'].k
            }
            const Upload: AxiosResponse = await axios({
                url: 'https://yt1s.com/api/ajaxConvert/convert',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                data: new URLSearchParams(Object.entries(Format))
            })
            const convert: YtS = {
                link: Upload.data.dlink,
                quality: Upload.data.fquality,
                judul: Upload.data.title,
                type: Upload.data.ftype,
                size: data.data.links.mp4['136'].size
            }
            resolve(convert)
        } catch (err) {
            reject(err)
        }
    })
}
export async function YtPlaymp4 (title: string): Promise <youtubeDlCore> {
	return new Promise (async (resolve, reject) => {
		if (/(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/.test(title)) {
			let Id: RegExpExecArray | null | string = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/.exec(title)
			if (!Id) Id = ""
			const result: VideoMetadataResult = await ytSearch({ videoId: Id[1]})
			await Ytmp4(title).then((value: youtubeDlCore) => {
				value.data.thumbnail = result.thumbnail
				value.data.durasi = result.timestamp
				value.data.ago = result.ago
				value.data.publikasi = result.uploadDate
				return resolve(value)
			}).catch((err) => {
				return reject(new Error(String(err)))
			})
		} else {
			const result: VideoSearchResult[] = await YtSearch(title)
			const GetPublikasi: VideoMetadataResult =  await ytSearch({ videoId: result[0].videoId })
			await Ytmp4(result[0].url).then((value: youtubeDlCore) => {
				value.data.thumbnail = result[0].thumbnail
				value.data.durasi = result[0].timestamp
				value.data.ago = result[0].ago
				value.data.publikasi = GetPublikasi.uploadDate
				return resolve(value)
			}).catch((err) => {
				return reject(new Error(String(err)))
			})
		}
	})
}
export async function YtPlaymp3 (title: string): Promise <youtubeDlCore> {
	return new Promise (async (resolve, reject) => {
		if (/(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/.test(title)) {
			let Id: RegExpExecArray | null | string = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/.exec(title)
			if (!Id) Id = ""
			const result: VideoMetadataResult = await ytSearch({ videoId: Id[1]})
			await Ytmp3(title).then((value: youtubeDlCore) => {
				value.data.thumbnail = result.thumbnail
				value.data.durasi = result.timestamp
				value.data.ago = result.ago
				value.data.publikasi = result.uploadDate
				return resolve(value)
			}).catch((err) => {
				return reject(new Error(String(err)))
			})
		} else {
			const result: VideoSearchResult[] = await YtSearch(title)
			const GetPublikasi: VideoMetadataResult =  await ytSearch({ videoId: result[0].videoId })
			await Ytmp3(result[0].url).then((value: youtubeDlCore) => {
				value.data.thumbnail = result[0].thumbnail
				value.data.durasi = result[0].timestamp
				value.data.ago = result[0].ago
				value.data.publikasi = GetPublikasi.uploadDate
				return resolve(value)
			}).catch((err) => {
				return reject(new Error(String(err)))
			})
		}
	})
}
export async function Ytplaymp4Server2(title: string): Promise <YoutubeMP4PlaySer2> {
	return new Promise (async (resolve, reject) => {
		if (/(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/.test(title)) {
			let Id: RegExpExecArray | null | string = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/.exec(title)
			if (!Id) Id = ""
			const result: VideoMetadataResult = await ytSearch({ videoId: Id[1]})
			await  Y2mateVid(title).then((value: Y2Mate) => {
				const Format:  YoutubeMP3PlaySer2  = {
					...result,
					...value
				}
				return resolve(Format)
			}).catch(async () => {
				await keepVideoMP4(title).then((value: { link: string; size: string }) => {
					const Format: YoutubeMP4PlaySer2 = {
						...result,
						...value
					}
					return resolve(Format)
				}).catch(async () => {
					await  Yt1SVid(title).then((value: YtS) => {
						const Format: YoutubeMP4PlaySer2 = {
							...result,
							...value
						}
						return resolve(Format)
					}).catch(async () => {
						await SnappeaVid(title).then((value: snappeaAud) => {
							const Format: YoutubeMP4PlaySer2 = {
								...result,
								...value
							}
							return resolve(Format)
						}).catch((err) => {
							return reject (new Error(err))
						})
					})
				})
			})
		} else {
			const result: VideoSearchResult[] = await YtSearch(title)
			const getData: VideoMetadataResult = await ytSearch({ videoId: result[0].videoId})
			await  Y2mateVid(result[0].url).then((value: Y2Mate) => {
				const Format: YoutubeMP4PlaySer2  = {
					...getData,
					...value
				}
				return resolve(Format)
			}).catch(async () => {
				await keepVideoMP4(result[0].url).then((value: { link: string; size: string }) => {
					const Format: YoutubeMP4PlaySer2 = {
						...getData,
						...value
					}
					return resolve(Format)
				}).catch(async () => {
					await Yt1SVid(result[0].url).then((value: YtS) => {
						const Format:YoutubeMP4PlaySer2 = {
							...getData,
							...value
						}
						return resolve(Format)
					}).catch(async () => {
						await SnappeaVid(title).then((value: snappeaAud) => {
							const Format: YoutubeMP4PlaySer2 = {
								...getData,
								...value
							}
							return resolve(Format)
						}).catch((err) => {
							return reject (new Error(err))
						})
					})
				})
			})
		}
	})
}
export async function Ytplaymp3Server2 (title: string): Promise <YoutubeMP3PlaySer2> {
	return new Promise (async (resolve, reject) => {
		if (/(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/.test(title)) {
			let Id: RegExpExecArray | null | string = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/.exec(title)
			if (!Id) Id = ""
			const result: VideoMetadataResult = await ytSearch({ videoId: Id[1]})
			await  Y2mateMp3(title).then((value: Y2Mate) => {
				const Format:  YoutubeMP3PlaySer2  = {
					...result,
					...value
				}
				return resolve(Format)
			}).catch(async () => {
				await keepVideoMP3(title).then((value: { link: string; size: string }) => {
					const Format: YoutubeMP3PlaySer2 = {
						...result,
						...value
					}
					return resolve(Format)
				}).catch(async () => {
					await  Yt1SAud(title).then((value: YtS) => {
						const Format: YoutubeMP3PlaySer2 = {
							...result,
							...value
						}
						return resolve(Format)
					}).catch(async () => {
						await SnappeaAud(title).then((value: snappeaAud) => {
							const Format: YoutubeMP3PlaySer2 = {
								...result,
								...value
							}
							return resolve(Format)
						}).catch((err) => {
							return reject (new Error(err))
						})
					})
				})
			})
		} else {
			const result: VideoSearchResult[] = await YtSearch(title)
			const getData: VideoMetadataResult = await ytSearch({ videoId: result[0].videoId})
			await  Y2mateMp3(result[0].url).then((value: Y2Mate) => {
				const Format: YoutubeMP3PlaySer2  = {
					...getData,
					...value
				}
				return resolve(Format)
			}).catch(async () => {
				await keepVideoMP3(result[0].url).then((value: { link: string; size: string }) => {
					const Format: YoutubeMP3PlaySer2 = {
						...getData,
						...value
					}
					return resolve(Format)
				}).catch(async () => {
					await Yt1SAud(result[0].url).then((value: YtS) => {
						const Format: YoutubeMP3PlaySer2 = {
							...getData,
							...value
						}
						return resolve(Format)
					}).catch(async () => {
						await SnappeaAud(title).then((value: snappeaAud) => {
							const Format: YoutubeMP3PlaySer2 = {
								...getData,
								...value
							}
							return resolve(Format)
						}).catch((err) => {
							return reject (new Error(err))
						})
					})
				})
			})
		}
	})
}
export async function Ytmp4 (url: string): Promise <youtubeDlCore> {
	return new Promise (async (resolve, reject) => {
		const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
		if (!regex.test(url)) return reject(new Error("URL null"))
		const getId: RegExpExecArray | null = regex.exec(url)
		if (!getId) return reject(new Error("Bukan id youtube"))
		const data: videoInfo = await ytdl.getInfo(getId[1], {
			requestOptions: {
				headers: {

			}
		}
	});
	const format: videoFormat | undefined = ytdl.filterFormats(data.formats, 'video').find((result => result.mimeType?.startsWith("video/mp4")))
	if (!format) return reject(new Error("data undefined"))
	const size: string = await filesize(Number(format.contentLength))
	const result: youtubeDlCore = {
		status: 200,
		data: {
			title: data.videoDetails.title,
			quality: format.quality,
			size: size,
			format: format.container,
			down: format.url,
			like: convertAngka (Number(data.videoDetails.likes)),
			dislike: convertAngka(Number(data.videoDetails.dislikes)),
			viewers:convertAngka(Number(data.videoDetails.viewCount)),
			category: data.videoDetails.category,
			rilis: data.videoDetails.category,
			video_url: data.videoDetails.video_url,
			channel: data.videoDetails.ownerChannelName,
			durasi: data.videoDetails.lengthSeconds,
			thumbnail: data.videoDetails.thumbnails.find((filter) => filter.width === 1920)?.url,
			desk: data.videoDetails.description
		}
	}
	return resolve(result)
	})
}
export async function Ytmp3 (url: string): Promise <youtubeDlCore> {
	return new Promise (async (resolve, reject) => {
		const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
		if (!regex.test(url)) return reject(new Error("URL null"))
		const getId: RegExpExecArray | null = regex.exec(url)
		if (!getId) return reject(new Error("Bukan id youtube"))
		const data: videoInfo = await ytdl.getInfo(getId[1], {
			requestOptions: {
				headers: {
				"x-client-data": "CJC2yQEIo7bJAQjBtskBCKmdygEIj4PLAQjQmssBCKCgywEI7/LLAQjO9ssBCLT4ywEInvnLAQj5+csBCK/6ywEI5P3LARiOnssBGJD1ywE=",
				"cookie": "VISITOR_INFO1_LIVE=8e7t2Dg-NmE; _gcl_au=1.1.1617653021.1627691158; PREF=f6=80&tz=Asia.Jakarta&f4=4000000&volume=100; SID=AQip5ysp5adFams5UT9n94EynigA2OK7Vh5fgpPLQLHLWTDBb3A7la6nqDA4oqfKS4tgyw.; __Secure-1PSID=AQip5ysp5adFams5UT9n94EynigA2OK7Vh5fgpPLQLHLWTDB9rzz_IaGpyhKuZXlnpclAQ.; __Secure-3PSID=AQip5ysp5adFams5UT9n94EynigA2OK7Vh5fgpPLQLHLWTDB0ErTDQOpGoE0ovY3JNXuow.; HSID=ARVyrsPj7nmdDg_6m; SSID=A7RZ-xsTjLDRoJd6A; APISID=hyaiT7h78kbTrQQj/ABbIkQ22EWIWVeLHo; SAPISID=W9fYb-gZz5a3-6PX/ALt2Ga0J-JKO6AxBu; __Secure-1PAPISID=W9fYb-gZz5a3-6PX/ALt2Ga0J-JKO6AxBu; __Secure-3PAPISID=W9fYb-gZz5a3-6PX/ALt2Ga0J-JKO6AxBu; YSC=k5G6V7YF61I; LOGIN_INFO=AFmmF2swRgIhAPjS7cNQkC5f--ibbeYFaYt48d2KKqgwqHKW3lfZtf-xAiEAqVgTVHk95ecSQrIntqq147pl_wxkGbI_ukm7UpZK-ho:QUQ3MjNmd0JoNUtNRWY5Zk52Wl9SWFBxU2dybTBxZUlaU1VESFFmWjNmZnNTbDdReDgtNWpJYkxZaFZSVEp2V2psRmZZcmhNbk44VFFpdlNUTlhPdmRqdDRsVU83bWJ6MDNWZFJBU2p0MFRPY0w2RTRLWkptMU95T1lRaHMxNXJXb1VGNVBvMW90SDhXWmwxb20zaEJxRmhJOFlvYjh4NGtR; SIDCC=AJi4QfFWZu3VKnFr41KbinoXiN8Hhzul-_FHdneWzi3XVOZbzv4nb438cKMA2MMzVYC_rbY3Uvc; __Secure-3PSIDCC=AJi4QfERWxYOAvPi0i8QF2IwRa90Cp2sQkJsUntUv-N7G5lyzw-r_oXKSi8Ctc31qDhgX7Ndqn4"
			}
		}
	});
	const format: videoFormat | undefined = ytdl.filterFormats(data.formats, 'audioonly').find((result => result.audioQuality === "AUDIO_QUALITY_MEDIUM"))
	if (!format) return reject(new Error("data undefined"))
	const size: string = await filesize(Number(format.contentLength))
	const result: youtubeDlCore = {
		status: 200,
		data: {
			title: data.videoDetails.title,
			quality: format.quality,
			size: size,
			format: format.container,
			down: format.url,
			like: convertAngka (Number(data.videoDetails.likes)),
			dislike: convertAngka(Number(data.videoDetails.dislikes)),
			viewers:convertAngka(Number(data.videoDetails.viewCount)),
			category: data.videoDetails.category,
			rilis: data.videoDetails.category,
			video_url: data.videoDetails.video_url,
			channel: data.videoDetails.ownerChannelName,
			durasi: data.videoDetails.lengthSeconds,
			thumbnail: data.videoDetails.thumbnails.find((filter) => filter.width === 1920)?.url,
			desk: data.videoDetails.description
		}
	}
	return resolve(result)
	})
}
export async function YtSearch (judul: string): Promise <VideoSearchResult[]> {
	return new Promise (async (resolve, reject) => {
		await ytSearch(judul).then((value:  SearchResult) => {
			return resolve(value.videos)
		}).catch((err: Error) => {
			return reject(new Error(String(err)))
		})
	})
}