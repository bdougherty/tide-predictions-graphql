import * as tc from 'timezonecomplete';
import {
	calculateDistance,
	convert
} from '../lib/distance';
import { formatTimeZone } from '../lib/time';
import {
	getTideStation,
	getTideStationsNear
} from '../lib/tide-station';

export default {
	Query: {
		tideStation: async (obj, { id }) => getTideStation(id),
		tideStations: async (obj, { coordinate, limit }) => getTideStationsNear(coordinate, limit)
	},
	StationType: {
		harmonic: 'R',
		subordinate: 'S'
	},
	PredictionType: {
		high: 'H',
		low: 'L'
	},
	TideStation: {
		distance: (station, { from, units }) => {
			if (!from && station.distance) {
				return convert(station.distance, 'km', units);
			}

			if (!from) {
				throw new Error('Must provide from to calculate distance.');
			}

			const fromPoint = [station.lat, station.lon];
			const toPoint = [from.lat, from.lon];
			const distance = calculateDistance(fromPoint, toPoint);
			return convert(distance, 'km', units);
		},
		timeZone: (station, { format = 'name' }) => {
			const coordinate = [station.lat, station.lon];
			return formatTimeZone(coordinate, format);
		},
		predictions: async (station, { days, datum }) => station.getPredictions({ days, datum }),
		hourlyPredictions: async (station, { days, datum }) => station.getPredictions({ days, datum, interval: 'h' })
	},
	TidePrediction: {
		time: ({ time }) => time.toZone(tc.utc()).toIsoString(),
		height: ({ height }, { units }) => {
			const converted = convert(height, 'm', units);
			return parseFloat(converted.toFixed(3));
		}
	},
	WaterLevelPrediction: {
		time: ({ time }) => time.toZone(tc.utc()).toIsoString(),
		height: ({ height }, { units }) => {
			const converted = convert(height, 'm', units);
			return parseFloat(converted.toFixed(3));
		}
	}
};
