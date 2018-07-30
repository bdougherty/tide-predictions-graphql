import {
	openStreetMapforwardGeocode,
	geoNamesForwardGeocode,
	openStreetMapReverseGeocode
} from '../lib/location';
import { getTideStationsNear } from '../lib/tide-station';
import { getWaterTemperaturesNear } from '../lib/water-temperature';
import { fetchWeatherForecast } from '../lib/weather';

export default {
	Query: {
		geocode: async (obj, { query, limit, provider, countryCodes }) => {
			if (provider === 'GeoNames') {
				return [await geoNamesForwardGeocode(query)];
			}

			const locations = await openStreetMapforwardGeocode(query, countryCodes);
			return locations.slice(0, limit);
		},
		reverseGeocode: async (obj, { query }) => {
			const locations = await openStreetMapReverseGeocode(query);
			return locations;
		}
	},
	Location: {
		tideStations: async (location, { limit }) => getTideStationsNear(location, limit),
		waterTemperatures: async (location, { limit }) => {
			const near = {
				lat: parseFloat(location.lat),
				lon: parseFloat(location.lon)
			};

			return getWaterTemperaturesNear(near, limit);
		},
		weatherForecast: async (location, { units, extendedHourly }) => {
			return fetchWeatherForecast(location, { units, extendedHourly });
		}
	}
};
