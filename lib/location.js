import got from 'got';
import LRU from 'lru-cache';
import {
	GeonamesLocation,
	OpenStreetMapLocation,
	IPStackLocation,
	IPAPILocation,
	IPDataLocation
} from '../models/location';

const cache = new LRU({
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

export async function ipapiIPLookup(ip) {
	const url = new URL(`http://ip-api.com/json/${ip}`);

	const { body } = await got(url, {
		cache,
		json: true
	});

	return new IPAPILocation(body);
}

export async function ipdataIPLookup(ip) {
	const url = new URL(`https://api.ipdata.co/${ip}`);
	url.searchParams.set('api-key', process.env.IPDATA_API_KEY);

	const { body } = await got(url, {
		cache,
		json: true
	});

	return new IPDataLocation(body);
}

export async function ipstackIPLookup(ip) {
	const url = new URL(`http://api.ipstack.com/${ip}`);
	url.searchParams.set('access_key', process.env.IPSTACK_API_KEY);
	url.searchParams.set('fields', 'main');

	const { body } = await got(url, {
		cache,
		json: true
	});

	return new IPStackLocation(body);
}
