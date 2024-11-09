import fs from "node:fs";

export default defineEventHandler(() => {
	return fs.readFileSync("./src/public/CardDemo.html");
});
