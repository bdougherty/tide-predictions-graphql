import got from 'got';
import bbox from '@turf/bbox';
import circle from '@turf/circle';
import LRU from 'lru-cache';
import {
	WaterTemperatureStation,
	USGSWaterTemperatureStation,
	NOAAWaterTemperatureStation
} from '../models/water-temperature-station';
import { calculateDistance } from './distance';

const caches = {
	stations: new LRU({
		max: 100,
		maxAge: 3600 * 1000
	}),
	nearbyStations: new LRU({
		max: 100,
		maxAge: 3600 * 1000
	}),
	noaaStations: new LRU({
		max: 1,
		maxAge: 3600 * 24 * 1000
	})
};

export function convertCelsiusToFahrenheit(temperatureInCelsius) {
	return (temperatureInCelsius * (9 / 5)) + 32;
}

export function truncateFloat(float, decimals = 7) {
	const rounded = float.toFixed(decimals);
	return parseFloat(rounded);
}

export function calculateBboxFromPoint({ lat, lon }, radius = 25) {
	const area = circle([lon, lat], radius, { units: 'miles' });
	const feature = bbox(area);
	return feature.map((val) => truncateFloat(val));
}

function getUSGSWaterServiceBaseUrl() {
	const url = new URL('https://waterservices.usgs.gov/nwis/iv/');
	url.searchParams.set('format', 'json');
	url.searchParams.set('parameterCd', '00010');
	url.searchParams.set('siteStatus', 'active');

	return url;
}

async function fetchUSGSTemperatureSite(id) {
	const url = getUSGSWaterServiceBaseUrl();
	url.searchParams.set('sites', id);

	const { body } = await got(url, {
		cache: caches.stations,
		json: true,
		headers: {
			'User-Agent': process.env.APPLICATION
		}
	});

	return new USGSWaterTemperatureStation(body.value.timeSeries[0]);
}

async function fetchUSGSTemperatureSites(near) {
	const feature = calculateBboxFromPoint(near);

	const url = getUSGSWaterServiceBaseUrl();
	url.searchParams.set('bBox', feature.join(','));

	const { body } = await got(url, {
		cache: caches.nearbyStations,
		json: true,
		headers: {
			'User-Agent': process.env.APPLICATION
		}
	});

	return body.value.timeSeries.map((site) => new USGSWaterTemperatureStation(site));
}

async function fetchNOAATemperatureStation(id, appName = process.env.APPLICATION) {
	const url = new URL('https://tidesandcurrents.noaa.gov/api/datagetter');
	url.searchParams.set('station', id);
	url.searchParams.set('product', 'water_temperature');
	url.searchParams.set('application', appName);
	url.searchParams.set('date', 'latest');
	url.searchParams.set('time_zone', 'lst_ldt');
	url.searchParams.set('units', 'metric');
	url.searchParams.set('format', 'json');

	const { body } = await got(url, {
		cache: caches.stations,
		json: true
	});

	if (body.error) {
		throw new Error(body.error.message);
	}

	return new NOAAWaterTemperatureStation(body);
}

async function fetchNOAATemperatureStations(near, appName = process.env.APPLICATION) {
	const url = new URL('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json');
	url.searchParams.set('type', 'watertemp');
	url.searchParams.set('application', appName);

	const { body } = await got(url, {
		cache: caches.noaaStations,
		json: true
	});

	const stations = body.stations.map((station) => {
		return {
			id: `NOAA:${station.id}`,
			lat: station.lat,
			lon: station.lng
		};
	});

	return orderSitesByDistance(stations, near);
}

export async function getWaterTemperature(id) {
	const [service, serviceId] = id.split(':');

	switch (service) {
		case 'USGS':
			return fetchUSGSTemperatureSite(serviceId);

		case 'NOAA':
			return fetchNOAATemperatureStation(serviceId);

		default:
			throw new TypeError('Invalid water temperature station id.');
	}
}

export async function getWaterTemperaturesNear(near, limit) {
	const [usgsStations, noaaStations] = await Promise.all([
		fetchUSGSTemperatureSites(near),
		fetchNOAATemperatureStations(near)
	]);

	const allStationsByDistance = orderSitesByDistance([...usgsStations, ...noaaStations], near);
	const limitedStations = allStationsByDistance.slice(0, limit);

	const stations = await Promise.all(limitedStations.map(async (station) => {
		if (station instanceof WaterTemperatureStation) {
			return station;
		}

		try {
			const fullStation = await getWaterTemperature(station.id);
			fullStation.distance = station.distance;

			return fullStation;
		}
		catch (error) {
			return null;
		}
	}));

	return stations.filter((station) => station instanceof WaterTemperatureStation);
}

function orderSitesByDistance(sites, { lat, lon }) {
	const sitesWithDistances = [...sites].map((site) => {
		site.distance = calculateDistance([lat, lon], [site.lat, site.lon]);
		return site;
	});

	return sitesWithDistances.sort((a, b) => a.distance - b.distance);
}
