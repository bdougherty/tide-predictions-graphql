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
		waterTemperatures: async (obj, { near, limit = 1 }) => {
			const sites = await getWaterTemperaturesNear(near);
			const sitesByDistance = orderSitesByDistance(sites, near);
			return sitesByDistance.slice(0, limit);
		}
	},
	WaterTemperatureSite: {
		id: (source) => source.sourceInfo.siteCode[0].value,
		name: (source) => source.sourceInfo.siteName,
		url: (source) => `https://waterdata.usgs.gov/nwis/uv?site_no=${source.sourceInfo.siteCode[0].value}`,
		lat: (source) => source.sourceInfo.geoLocation.geogLocation.latitude,
		lon: (source) => source.sourceInfo.geoLocation.geogLocation.longitude,
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
		temperature: (source, { unit = 'C' }) => {
			const temperatureInCelsius = parseFloat(source.values[0].value[0].value);

			if (unit === 'F') {
				const temperatureInFahrenheit = convertCelsiusToFahrenheit(temperatureInCelsius);
				return truncateFloat(temperatureInFahrenheit, 1);
			}

			return truncateFloat(temperatureInCelsius, 1);
		},
		time: (source) => moment(source.values[0].value[0].dateTime).utc().format(),
		timeZone: (source, { format = 'name' }) => {
			const { latitude, longitude } = source.sourceInfo.geoLocation.geogLocation;
			const coordinate = [latitude, longitude];
			return formatTimeZone(coordinate, format);
		}
	}
};
