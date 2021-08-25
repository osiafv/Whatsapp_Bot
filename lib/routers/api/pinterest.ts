import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import {  RandomArray } from "../../functions/function"


export async function Pinterest(title: string, headers?: AxiosRequestConfig): Promise <string[]> {
	return new Promise (async (resolve, reject) => {
		headers = headers ?? {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90. 0.4430.212 Safari/537.36",
				"cookie": "csrftoken=2b7f7ec7ac13bd56437f571bceb33dd4; g_state={\"i_l\":0}; _auth=1; _pinterest_sess=TWc9PSY2bVVWRHZpc2xuc0kvOVJlZzFCSEpUSllzREFReUhsaWRBQ1BvSVV4Q1haZlU2VHhTZnNzM1NGQ1pVUkh6c2JnbFEyT0hsZFpKT0ZrbHFPdDF1SnVBdW9uaCs2UUNPT1JqSHVqNjJ3YUVyNzdQY2dnQ2kvT3NGSnlTNEg0cHcyb0dCUi8zckVtZmZ4TCs5NjM0THhrSWRXbURNbW5TcjJKNVN5akk0SFZhS2RLNzUrcnpNMXZ6czh1WklDcXl5TjhtY05ESWhOOC9aMWlrYXVWR2E4QWh5dE9CTkNuRVNYZUFhVFVnOTlDU0tVL0ZoeHhVQzNHMUpMVElLTGoyTStQSlF5UkdYcmFtczI4ZW9CMmNwVWxiK1FESy9RQmNzS2wxSWlzT2ZvaWhpTlg1TjhiWE5xZW1FQjZ2Y1p5azVUNUd1c0NLQmRXa0RWempqNlpxTjZPejhidklGQ2FjdWhoN0RSN3FJaHVDVHFXeUthOXo5WE52QmRCL2xNa0Jham4rL0hzQlphckFONXJpNmxUL2ZDNUdzamwrNENOSlNmU3FQRlorVWxjRmJKSzVzOEhjaHZvZ0pMV3RabVk5cGp6K1dZQnFEbEFZWVFMQmxTUjduYnVBTnk1d2N4dnAreWtRQXhRb2w4bGtwNGNuYWtKMm8zRko2c2NqanlsN3pUcnIwWVZJZm1BamZ4YVVZdFQrY1pYYW5rMkp3b1lXZUJicEloTERXYlVmUkpTK0VpdVQ0OWpFUkF1Y2gyQ0FDNVJtMkRSMUVCTnpvNDAxTXdJWFk3YjFBSjY2ZnBRK0JpRUk0NEd3TXg0WUJ5ZVJmTCt3RllsQVZwUnAwNEMxT2tDc1hIdVhMbWNnTklUVHcySUVObHJqQ1piU2FDRklZWGszNEFrOTAyUXJ0d0VqY3RFYko2QVpWWWhTYTZzZEdDY2JIVlpnYk1CRU01YnNTbGtNTHJ0OWxzSWZPWDVqS1RGQmF3ZFBoenBqS05renIvTGRKdnpGOEFYR3FuVVMxSDlDL1dlZ1hzRVhrK3N2eE1PdjRWaDZjTlZnbG4wRHdzYTdjKzJVL2xTVndjPSY2dk00Ly82WjcyRmFXV0k1UkJCTGxwdExhTmc9; _b=\"AVr0YtKObXRBVYTfJLnjFaS+2FCa6zp44gigX9XyirYG0a72vHtT0szwT/gwdO6XebQ=\"; cm_sub=denied; _routing_id=\"9041d9f6-4a3a-4610-ae68-f6720a213a7a\"; sessionFunnelEventLogged=1"
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