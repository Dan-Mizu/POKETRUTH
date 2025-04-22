export function useThemeColorMeta() {
	const setThemeColorMeta = (color: string) => {
		let metaTag = document.querySelector(
			'meta[name="theme-color"]'
		) as HTMLMetaElement;

		if (!metaTag) {
			metaTag = document.createElement("meta");
			metaTag.name = "theme-color";
			document.head.appendChild(metaTag);
		}

		metaTag.content = color;
	};

	return { setThemeColorMeta };
}
