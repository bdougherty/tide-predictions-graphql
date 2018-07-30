import { URL } from 'url';
import got from 'got';
import lruCache from 'lru-cache';
import { GeonamesLocation, OpenStreetMapLocation } from '../models/location';

const cache = lruCache({
	max: 500,
	maxAge: 3600 * 24 * 1000
});

export async function openStreetMapforwardGeocode(query, countryCodes = ['US']) {
	const url = new URL('https://nominatim.openstreetmap.org/search');
	url.searchParams.set('format', 'jsonv2');
	url.searchParams.set('addressdetails', '1');
	url.searchParams.set('countrycodes', countryCodes.join(','));
	url.searchParams.set('q', query);

	const { body } = await got(url, {
		cache,
		json: true,
		headers: {
			'User-Agent': process.env.APPLICATION
		}
	});

	return body.map((data) => new OpenStreetMapLocation(data));
}

export async function openStreetMapReverseGeocode({ lat, lon }) {
	const url = new URL('https://nominatim.openstreetmap.org/reverse');
	url.searchParams.set('format', 'jsonv2');
	url.searchParams.set('addressdetails', '1');
	url.searchParams.set('zoom', '18');
	url.searchParams.set('lat', lat);
	url.searchParams.set('lon', lon);

	const { body } = await got(url, {
		cache,
		json: true,
		headers: {
			'User-Agent': process.env.APPLICATION
		}
	});

	return new OpenStreetMapLocation(body);
}

export async function geoNamesForwardGeocode(query) {
	const url = new URL('http://api.geonames.org/geoCodeAddressJSON');
	url.searchParams.set('q', query);
	url.searchParams.set('username', process.env.GEONAMES_USERNAME);

	const { body } = await got(url, {
		cache,
		json: true
	});

	return new GeonamesLocation(body.address);
}

export async function geoNamesReverseGeocode({ lat, lon }) {
	const url = new URL('http://api.geonames.org/geoCodeAddressJSON');
	url.searchParams.set('lat', lat);
	url.searchParams.set('lng', lon);
	url.searchParams.set('username', process.env.GEONAMES_USERNAME);

	const { body } = await got(url, {
		cache,
		json: true
	});

	return new GeonamesLocation(body.address);
}
