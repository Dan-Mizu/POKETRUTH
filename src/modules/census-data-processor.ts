// src/modules/census-data-processor.ts
import { createResolver, defineNuxtModule } from "nuxt/kit";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

import chartMeta from "~/assets/data/census/2025-config.json";
const chartConfig: CensusChartConfig = chartMeta as CensusChartConfig;

export default defineNuxtModule({
	meta: {
		name: "census-data-processor",
	},
	async setup() {
		const { resolve } = createResolver(import.meta.url);

		// get input/output file paths
		const inputPath = resolve("../assets/data/census/2025.csv"); // Adjust this to your directory structure
		let outputPath = resolve("../public/data/census/2025.json");

		// check if the file exists
		if (!fs.existsSync(inputPath)) {
			console.warn(
				"[census-data-processor] CSV file not found at",
				inputPath
			);
			return;
		}

		// read CSV file
		const csvText = fs.readFileSync(inputPath, "utf-8");
		const parsedData = await parseCsv(csvText);

		// clean data
		const censusData = parsedData.map((entry) => {
			const cleanedEntry: { [key: string]: string | number } = {};
			for (const key in entry) {
				const value = entry[key];
				cleanedEntry[key] =
					typeof value === "number" ||
					(typeof value === "string" && value.trim() !== "")
						? value
						: "Unknown";
			}
			return cleanedEntry;
		});

		// ensure directory exists, then save data as json file
		fs.mkdirSync(path.dirname(outputPath), { recursive: true });
		fs.writeFileSync(
			outputPath,
			JSON.stringify(censusData, null, 2),
			"utf-8"
		);

		// success
		console.log(
			`[census-data-processor] CSV parsed and saved to ${outputPath}`
		);

		// determine chart types
		outputPath = resolve("../public/data/census/2025-meta.json");
		let chartTypes: CensusChartConfig = {};

		// get the questions (column names)
		const firstRow = censusData[0];
		const questionKeys = Object.keys(firstRow);

		// determine chart for each question
		questionKeys.forEach((question) => {
			// get config for this question
			const config = chartConfig[question];

			// initialize object
			chartTypes[question] = {};

			// pass through set settings
			if (config) {
				chartTypes[question] = config;
				if (config.type) {
					chartTypes[question].type =
						// if set to exclude, make sure chart does not show up
						config.type !== "exclude" ? config.type : null;
					return;
				}
			}

			// fallback to pie chart
			chartTypes[question].type = "pie";
		});

		// ensure directory exists, then save data as json file
		fs.mkdirSync(path.dirname(outputPath), { recursive: true });
		fs.writeFileSync(
			outputPath,
			JSON.stringify(chartTypes, null, 2),
			"utf-8"
		);

		// success
		console.log(
			`[census-data-processor] Chart types determined and saved to ${outputPath}`
		);
	},
});

// CSV file parsing
async function parseCsv(data: string) {
	return new Promise<any[]>((resolve, reject) => {
		Papa.parse(data, {
			header: true,
			dynamicTyping: true,
			complete: (results) => resolve(results.data),
			error: reject,
		});
	});
}
