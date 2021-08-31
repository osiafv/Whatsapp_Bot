export declare class instaStalk {
    id: string
    username: string
    nickname: string
    thumb: string
    bio: string
    id_fb: string
    akun_bisnis: boolean
    category: string
    private: boolean
    centang: boolean
    total_post: number
	follower: number
	following: number
}
export interface getDataPost {
	isVideo: boolean
	url: string
}
export interface IgPostDown {
	getData?: getDataPost[]
	caption?: string
	username?: string
	like?: number
}
export interface IgReelsDown {
	link?: string;
	total_views?: number | null;
	total_plays?: number | null;
	total_koment?: number;
	username?: string;
	durasi?: number;
	thumbnail?: string;
	like?: number
}
export interface IgTvDown {
	link?: string;
	thumbnail?: string,
	title?: string,
	total_coment?: number,
	total_view?: number | null,
	total_play?: number | null,
	username?: string
}