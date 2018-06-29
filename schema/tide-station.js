import * as tc from 'timezonecomplete';
import calculateDistance from '../lib/distance';
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
	PredictionUnit: {
		ft: 'english',
		m: 'metric'
	},
	TideStation: {
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
		timeZone: (station, { format = 'name' }) => {
			const coordinate = [station.lat, station.lon];
			return formatTimeZone(coordinate, format);
		},
		predictions: async (station, { days, datum, units }) => station.getPredictions({ days, datum, units })
	},
	TidePrediction: {
		time: ({ time }) => time.toZone(tc.utc()).toIsoString()
	}
};
