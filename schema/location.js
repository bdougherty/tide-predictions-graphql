import stateNamesToAbbreviations from 'datasets-us-states-names-abbr';
import { forwardGeocode, reverseGeocode, getCityName, formatAddress } from '../lib/location';
import { fetchTideStations, getStationsByDistance } from '../lib/tide-station';
import { getWaterTemperaturesNear, orderSitesByDistance } from '../lib/water-temperature';
import { fetchWeatherForecast } from '../lib/weather';

export default {
	Query: {
		geocode: async (obj, { query, limit, countryCodes }) => {
			const locations = await forwardGeocode(query, countryCodes);
			return locations.slice(0, limit);
		},
		reverseGeocode: async (obj, { query }) => {
			// validateCoordinate(query);

			const locations = await reverseGeocode(query);
			return locations;
		}
	},
	Location: {
		lat: (location) => parseFloat(location.lat),
		lon: (location) => parseFloat(location.lon),
		name: (location) => formatAddress(location),
		streetNumber: (location) => location.address.house_number,
		streetName: (location) => location.address.road,
		city: (location) => getCityName(location),
		state: (location) => location.address.state,
		stateCode: (location) => stateNamesToAbbreviations[location.address.state],
		zipCode: (location) => location.address.postcode,
		country: (location) => location.address.country,
		countryCode: (location) => location.address.country_code.toUpperCase(),
		tideStations: async (location, { limit }) => {
			const stations = await fetchTideStations();
			const stationsWithDistances = getStationsByDistance(stations, {
				lat: parseFloat(location.lat),
				lon: parseFloat(location.lon)
			});
			return stationsWithDistances.slice(0, limit);
		},
		waterTemperatures: async (location, { limit }) => {
			const near = {
				lat: parseFloat(location.lat),
				lon: parseFloat(location.lon)
			};

			const sites = await getWaterTemperaturesNear(near);
			const sitesByDistance = orderSitesByDistance(sites, near);
			return sitesByDistance.slice(0, limit);
		},
		weatherForecast: async (location, { units, extendedHourly }) => {
			return fetchWeatherForecast(location, { units, extendedHourly });
		}
	}
};
