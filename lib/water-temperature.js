import { URL } from 'url';
import got from 'got';
import bbox from '@turf/bbox';
import circle from '@turf/circle';
import lruCache from 'lru-cache';
import calculateDistance from './distance';

const sitesCache = lruCache({
	max: 100,
	maxAge: 3600 * 1000
});

const sitesNearCache = lruCache({
	max: 100,
	maxAge: 3600 * 1000
});

export function convertCelsiusToFahrenheit(temperatureInCelsius) {
	return (temperatureInCelsius * (9 / 5)) + 32;
}

export function truncateFloat(float, decimals = 7) {
	const rounded = float.toFixed(decimals);
	return parseFloat(rounded);
}

export function calculateBboxFromPoint({ lat, lon }) {
	const area = circle([lon, lat], 50, { units: 'miles' });
	const feature = bbox(area);
	return feature.map((val) => truncateFloat(val));
}

function getWaterServiceBaseUrl() {
	const url = new URL('https://waterservices.usgs.gov/nwis/iv/');
	url.searchParams.set('format', 'json');
	url.searchParams.set('parameterCd', '00010');
	url.searchParams.set('siteStatus', 'active');

	return url;
}

export async function getWaterTemperature(id) {
	const url = getWaterServiceBaseUrl();
	url.searchParams.set('sites', id);

	const { body } = await got(url, {
		cache: sitesCache,
		json: true
	});

	return body.value.timeSeries[0];
}

export async function getWaterTemperaturesNear(near) {
	const feature = calculateBboxFromPoint(near);

	const url = getWaterServiceBaseUrl();
	url.searchParams.set('bBox', feature.join(','));

	const { body } = await got(url, {
		cache: sitesNearCache,
		json: true
	});

	return body.value.timeSeries;
}

export function orderSitesByDistance(sites, { lat, lon }) {
	const sitesWithDistances = [...sites].map((site) => {
		const { latitude, longitude } = site.sourceInfo.geoLocation.geogLocation;
		site.distance = calculateDistance([lat, lon], [latitude, longitude]);
		return site;
	});

	return sitesWithDistances.sort((a, b) => a.distance - b.distance);
}
