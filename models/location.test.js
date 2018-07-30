import test from 'ava';
import { OpenStreetMapLocation } from './location';

function name(t, input, expected) {
	const location = new OpenStreetMapLocation(input);
	t.is(location.name, expected);
}

name.title = (providedTitle, input) => `Properly formats ”${input.display_name}“`;

/* eslint-disable camelcase */
test(name, {
	display_name: 'Hawaii, United States of America',
	category: 'boundary',
	type: 'administrative',
	address: {
		state: 'Hawaii',
		country: 'United States of America',
		country_code: 'us'
	}
}, 'Hawaii, United States of America');

test(name, {
	display_name: 'Ventnor City, Atlantic County, New Jersey, 08406, United States of America',
	category: 'place',
	type: 'city',
	address: {
		city: 'Ventnor City',
		county: 'Atlantic County',
		state: 'New Jersey',
		postcode: '08406',
		country: 'United States of America',
		country_code: 'us'
	}
}, 'Ventnor City, NJ');

test(name, {
	display_name: 'Guam, United States of America',
	category: 'boundary',
	type: 'administrative',
	address: {
		state: 'Guam',
		country: 'United States of America',
		country_code: 'us'
	}
}, 'Guam, United States of America');

test(name, {
	display_name: 'Weno, Chuuk, Micronesia',
	category: 'place',
	type: 'island',
	address: {
		island: 'Weno',
		city: 'Weno',
		state: 'Chuuk',
		country: 'Micronesia',
		country_code: 'fm'
	}
}, 'Weno, Chuuk, Micronesia');
/* eslint-enable camelcase */
