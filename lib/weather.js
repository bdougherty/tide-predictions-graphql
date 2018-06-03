import { URL } from 'url';
import got from 'got';
import lruCache from 'lru-cache';

const cache = lruCache({
	max: 500,
	maxAge: 3600 * 5 * 1000
});

const DIRECTIONS = [
	'N',
	'NNE',
	'NE',
	'ENE',
	'E',
	'ESE',
	'SE',
	'SSE',
	'S',
	'SSW',
	'SW',
	'WSW',
	'W',
	'WNW',
	'NW',
	'NNW'
];

export function bearingToCardinalDirection(bearing) {
	const direction = Math.round(bearing / 360 * DIRECTIONS.length);
	return DIRECTIONS[direction % DIRECTIONS.length];
}

export async function fetchWeatherForecast({ lat, lon }, { units = 'auto', extendedHourly = false }) {
	const apiKey = process.env.DARK_SKY_API_KEY;

	if (!apiKey) {
		return {};
	}

	const url = new URL(`https://api.darksky.net/forecast/${apiKey}/${lat},${lon}`);
	url.searchParams.append('exclude', 'minutely, daily');
	url.searchParams.append('units', units);

	if (extendedHourly) {
		url.searchParams.append('extend', 'hourly');
	}

	const { body } = await got(url, {
		cache,
		json: true
	});

	return body;
}

export function getUvIndexRisk(index) {
	if (index < 3) {
		return 'low';
	}

	if (index < 6) {
		return 'moderate';
	}

	if (index < 8) {
		return 'high';
	}

	if (index < 11) {
		return 'veryhigh';
	}

	return 'extreme';
}

export function getUvIndexColor(index) {
	if (index < 3) {
		return 'green';
	}

	if (index < 6) {
		return 'yellow';
	}

	if (index < 8) {
		return 'orange';
	}

	if (index < 11) {
		return 'red';
	}

	return 'violet';
}
