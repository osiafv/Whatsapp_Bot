import axios, { AxiosResponse} from "axios";
import {  GhStalk } from "../../typings"


export async function githubStalk (username: string): Promise <GhStalk> {
	return new Promise(async (resolve, reject) => {
		try {
			const data: AxiosResponse  = await axios.get(`https://api.github.com/users/${username}`)
			if (data.status !== 200) return reject(new Error(String(data.status)));
			const hasil: GhStalk  = data.data
			resolve(hasil)
		} catch (err) {
			reject(new Error(String("Kode invalid")))
		}
	})
}