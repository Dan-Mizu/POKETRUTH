export default function (hex: string) {
	return hex.length === 6 && !isNaN(Number("0x" + hex));
}
