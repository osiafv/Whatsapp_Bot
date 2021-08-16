import brainly from "brainly-scraper-v2";
import { Question, Answer } from "../../typings";


export async function BrainlySearch (querry: string): Promise <{ question: Question, answers: Answer[] }[]> {
	return new Promise(async (resolve, reject) => {
		const  Brainly: brainly = new brainly("id")
		await Brainly.search("id", querry).then((value: { question: Question, answers: Answer[] }[]) => {
			return resolve(value)
		}).catch((err: Error) => {
			return reject( new Error(String(err)))
		})
	})
}