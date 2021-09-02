import translate, { ITranslateResponse, languages } from "@vitalets/google-translate-api";


export async function Translate (text: string, to?: string): Promise <ITranslateResponse> {
	return new Promise (async (resolve, reject) => {
		if (!to) to = "id"
		if (!languages.isSupported(to)) return reject(new Error("Lang not support"))
		await translate(text, { to: to }).then((values: ITranslateResponse) => {
			return resolve(values)
		}).catch((err) => reject(new Error(String(err))))
	})
}