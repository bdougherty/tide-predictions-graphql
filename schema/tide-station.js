import * as tc from 'timezonecomplete';
import calculateDistance from '../lib/distance';
import {
	fetchPredictionsForTideStation,
	fetchTideStations,
	formatTideStationName,
	getStationsByDistance
} from '../lib/tide-station';
import { formatTimeZone } from '../lib/time';

const appName = process.env.APPLICATION;

export default {
	Query: {
		station: async (obj, { id }) => {
			const stations = await fetchTideStations();
			return stations.get(id);
		},
		stations: async (obj, { coordinate, limit }) => {
			const stations = await fetchTideStations();
			const stationsWithDistances = getStationsByDistance(stations, coordinate);
			return stationsWithDistances.slice(0, limit);
		}
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
		id: (station) => station.stationId,
		name: (station) => formatTideStationName(station.etidesStnName),
		commonName: (station) => formatTideStationName(station.commonName),
		type: (station) => station.stationType,
		url: (station) => `https://tidesandcurrents.noaa.gov/stationhome.html?id=${station.stationId}`,
		tidesUrl: (station) => `https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=${station.stationId}`,
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
		predictions: async (station, { days, datum, units }) => {
			const predictions = await fetchPredictionsForTideStation(station, { days, datum, units, appName });
			return predictions;
		}
	},
	TidePrediction: {
		height: (prediction) => parseFloat(prediction.v),
		time: ({ t, tz }) => {
			const timeZone = tc.zone(tz);
			const date = new tc.DateTime(t, 'yyyy-MM-dd HH:mm', timeZone);
			return date.toZone(tc.utc()).toIsoString();
		}
	}
};
