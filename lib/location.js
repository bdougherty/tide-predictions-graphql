import { URL } from 'url';
import got from 'got';
import lruCache from 'lru-cache';
import stateNamesToAbbreviations from 'datasets-us-states-names-abbr';

const cache = lruCache({
	max: 500,
	maxAge: 3600 * 24 * 1000
});

export async function forwardGeocode(query, countryCodes = ['US']) {
	const url = new URL('https://nominatim.openstreetmap.org/search');
	url.searchParams.set('format', 'jsonv2');
	url.searchParams.set('addressdetails', '1');
	url.searchParams.set('countrycodes', countryCodes.join(','));
	url.searchParams.set('q', query);

	const { body } = await got(url, {
		cache,
		json: true
	});

	return body;
}

export async function reverseGeocode({ lat, lon }) {
	const url = new URL('https://nominatim.openstreetmap.org/reverse');
	url.searchParams.set('format', 'jsonv2');
	url.searchParams.set('addressdetails', '1');
	url.searchParams.set('zoom', '18');
	url.searchParams.set('lat', lat);
	url.searchParams.set('lon', lon);

	const { body } = await got(url, {
		cache,
		json: true
	});

	return body;
}

export function getCityName(location) {
	if (location.type in location.address) {
		return location.address[location.type];
	}

	return location.address.city || location.address.town || location.address.village;
}

export function formatAddress(location) {
	const { address } = location;
	const cityName = getCityName(location);

	if (!cityName) {
		return location.display_name;
	}

	const abbreviation = stateNamesToAbbreviations[address.state] || address.state;
	const country = address.country_code.toLowerCase() === 'us' ? '' : `, ${address.country}`;
	const locality = `${cityName}, ${abbreviation}${country}`;

	if (address.house_number) {
		return `${address.house_number} ${address.road}, ${locality}`.trim();
	}

	return locality.trim();
}
