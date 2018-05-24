import stateNamesToAbbreviations from 'datasets-us-states-names-abbr';
import { forwardGeocode, reverseGeocode, getCityName, formatAddress } from '../lib/location';
import { fetchTideStations, getStationsByDistance } from '../lib/tide-station';

export default {
	Query: {
		geocode: async (obj, { query, limit = 1, countryCodes }) => {
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
		tideStations: async (location, { limit = 1 }) => {
			const stations = await fetchTideStations();
			const stationsWithDistances = getStationsByDistance(stations, {
				lat: location.lat,
				lon: location.lon
			});
			return stationsWithDistances.slice(0, limit);
		}
	}
};
