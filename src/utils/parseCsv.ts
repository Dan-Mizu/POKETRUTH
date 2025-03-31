import Papa from "papaparse";

export default async function (data: string) {
	return new Promise((resolve, reject) => {
		Papa.parse(data, {
			header: true,
			dynamicTyping: true,
			complete: (results) => resolve(results.data),
			error: reject,
		});
	});
}
