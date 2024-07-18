export default function (integer: number) {
	return "#" + integer.toString(16).padStart(6, "0");
}
