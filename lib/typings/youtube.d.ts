export declare class youtubeDlCore {
	status: number
	data: {
		title: string
		quality: string
		size: string
		format: string
		down: string
		like: string
		dislike: string
		viewers: string
		category: string
		rilis: string
		video_url: string
		channel: string
		durasi: string | number
		thumbnail: string | undefined
		desk: string | null
		ago?: string;
		publikasi?: string
	}
}
interface Duration {
	seconds: number;
	timestamp: string;
	toString: () => string;
}
interface author {
	name: string;
	url: string;
}
export interface YtS {
	link: string, 
	quality: string, 
	judul: string, 
	type: string, 
	size: string
}
export interface snappeaAud {
	type: string;
	size: string;
	link: string;
}
export interface YoutubeMP4PlaySer2 {
	title: string;
	description: string;
	url: string;
	videoId: string;
	seconds: number;
	timestamp: string;
	duration: Duration;
	views: number;
	genre: string;
	uploadDate: string;
	ago: string;
	image: string;
	thumbnail: string;
	author: author;
	link?: string; 
	thumb?: string; 
	size?: string 
}
export interface YoutubeMP3PlaySer2 {
	title: string;
	description: string;
	url: string;
	videoId: string;
	seconds: number;
	timestamp: string;
	duration: Duration;
	views: number;
	genre: string;
	uploadDate: string;
	ago: string;
	image: string;
	thumbnail: string;
	author: author;
	link?: string; 
	thumb?: string; 
	size?: string 
}
export declare class Y2Mate {
	link: string; 
	thumb: string; 
	size: string 
}