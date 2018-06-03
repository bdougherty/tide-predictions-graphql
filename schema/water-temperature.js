import moment from 'moment-timezone';
import calculateDistance from '../lib/distance';
import { formatTimeZone } from '../lib/time';
import {
	getWaterTemperature,
	getWaterTemperaturesNear,
	orderSitesByDistance,
	convertCelsiusToFahrenheit,
	truncateFloat
} from '../lib/water-temperature';

export default {
	Query: {
		waterTemperature: async (obj, { id }) => getWaterTemperature(id),
		waterTemperatures: async (obj, { coordinate, limit }) => {
			const sites = await getWaterTemperaturesNear(coordinate);
			const sitesByDistance = orderSitesByDistance(sites, coordinate);
			return sitesByDistance.slice(0, limit);
		}
	},
	WaterTemperatureSite: {
		id: (site) => site.sourceInfo.siteCode[0].value,
		name: (site) => site.sourceInfo.siteName,
		url: (site) => `https://waterdata.usgs.gov/nwis/uv?site_no=${site.sourceInfo.siteCode[0].value}`,
		lat: (site) => site.sourceInfo.geoLocation.geogLocation.latitude,
		lon: (site) => site.sourceInfo.geoLocation.geogLocation.longitude,
		distance: (site, { from, units }) => {
			if (!from && site.distance) {
				return site.distance;
			}

			if (!from) {
				throw new Error('Must provide from to calculate distance.');
			}

			const { latitude, longitude } = site.sourceInfo.geoLocation.geogLocation;
			const fromPoint = [latitude, longitude];
			const toPoint = [from.lat, from.lon];
			return calculateDistance(fromPoint, toPoint, units);
		},
		temperature: (site, { unit = 'F' }) => {
			const temperatureInCelsius = parseFloat(site.values[0].value[0].value);

			if (unit === 'F') {
				const temperatureInFahrenheit = convertCelsiusToFahrenheit(temperatureInCelsius);
				return truncateFloat(temperatureInFahrenheit, 1);
			}

			return truncateFloat(temperatureInCelsius, 1);
		},
		time: (site) => moment(site.values[0].value[0].dateTime).utc().format(),
		timeZone: (site, { format = 'name' }) => {
			const { latitude, longitude } = site.sourceInfo.geoLocation.geogLocation;
			const coordinate = [latitude, longitude];
			return formatTimeZone(coordinate, format);
		}
	}
};
