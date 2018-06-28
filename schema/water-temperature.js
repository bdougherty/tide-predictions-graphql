import * as tc from 'timezonecomplete';
import calculateDistance from '../lib/distance';
import { formatTimeZone } from '../lib/time';
import {
	getWaterTemperature,
	getWaterTemperaturesNear,
	convertCelsiusToFahrenheit,
	truncateFloat
} from '../lib/water-temperature';

export default {
	Query: {
		waterTemperature: async (obj, { id }) => getWaterTemperature(id),
		waterTemperatures: async (obj, { coordinate, limit }) => getWaterTemperaturesNear(coordinate, limit)
	},
	WaterTemperatureSite: {
		distance: (station, { from, units }) => {
			if (!from && station.distance) {
				return station.distance;
			}

			if (!from) {
				throw new Error('Must provide from to calculate distance.');
			}

			const fromPoint = [station.lat, station.lon];
			const toPoint = [from.lat, from.lon];
			return calculateDistance(fromPoint, toPoint, units);
		},
		temperature: (station, { unit = 'F' }) => {
			if (station.temperature === null) {
				return null;
			}

			if (unit === 'F') {
				const temperatureInFahrenheit = convertCelsiusToFahrenheit(station.temperature);
				return truncateFloat(temperatureInFahrenheit, 1);
			}

			return truncateFloat(station.temperature, 1);
		},
		time: (station) => {
			return station.time.toZone(tc.utc()).toIsoString();
		},
		timeZone: (station, { format = 'name' }) => {
			const coordinate = [station.lat, station.lon];
			return formatTimeZone(coordinate, format);
		}
	}
};
