export default function (integer: number) {
	return "#" + integer.toString(16).toUpperCase().padStart(6, "0");
}
