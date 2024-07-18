export default function (h: number, s: number, b: number) {
	const hsl = {
		h: h,
		l: (2 - s) * b,
		s: s * b,
	};

	if (hsl.l <= 1 && hsl.l > 0) {
		hsl.s /= hsl.l;
	} else {
		hsl.s /= 2 - hsl.l;
	}

	hsl.l /= 2;

	if (hsl.s > 1) {
		hsl.s = 1;
	}

	if (!(hsl.s > 0)) hsl.s = 0;

	hsl.h *= 360;
	hsl.s *= 100;
	hsl.l *= 100;

	return hsl;
}
