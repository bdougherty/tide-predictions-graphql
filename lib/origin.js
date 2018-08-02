export function isAllowedOrigin(origin, list) {
	const normalizedList = [].concat(...list.map((origin) => {
		if (!origin.startsWith('http')) {
			return [
				`http://${origin}`,
				`https://${origin}`
			];
		}

		return origin;
	}));

	return normalizedList.includes(origin);
}
