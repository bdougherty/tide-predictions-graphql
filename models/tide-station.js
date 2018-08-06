import geoTz from 'geo-tz';
import * as tc from 'timezonecomplete';
import {
	fetchPredictionsForTideStation,
	formatTideStationName
} from '../lib/tide-station';
import { TidePrediction, WaterLevelPrediction } from './tide-prediction';

export class TideStation {
	constructor(data) {
		this.data = data;
	}

	get id() {
		return null;
	}

	get name() {
		return '';
	}

	get commonName() {
		return '';
	}

	get lat() {
		return 0;
	}

	get lon() {
		return 0;
	}

	get type() {
		return null;
	}

	get url() {
		return '';
	}

	get predictionsUrl() {
		return '';
	}

	async getPredictions() {
		return [];
	}
}

export class NOAATideStation extends TideStation {
	get service() {
		return 'NOAA';
	}

	get id() {
		return `NOAA:${this.data.stationId}`;
	}

	get name() {
		return formatTideStationName(this.data.etidesStnName);
	}

	get commonName() {
		return formatTideStationName(this.data.commonName);
	}

	get lat() {
		return parseFloat(this.data.lat);
	}

	get lon() {
		return parseFloat(this.data.lon);
	}

	get type() {
		return this.data.stationType;
	}

	get url() {
		return `https://tidesandcurrents.noaa.gov/stationhome.html?id=${this.data.stationId}`;
	}

	get predictionsUrl() {
		return `https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=${this.data.stationId}`;
	}

	async getPredictions({ days, datum, units, interval }) {
		const zoneName = geoTz(this.lat, this.lon);

		const appName = process.env.APPLICATION;
		const predictions = await fetchPredictionsForTideStation(this.data, { days, datum, units, interval, appName });

		return predictions.map(({ t, v, type }) => {
			const timeZone = tc.zone(zoneName);
			const date = new tc.DateTime(t, 'yyyy-MM-dd HH:mm', timeZone);

			if (interval === 'h') {
				return new WaterLevelPrediction({
					height: v,
					time: date
				});
			}

			return new TidePrediction({
				type,
				height: v,
				time: date
			});
		});
	}
}
